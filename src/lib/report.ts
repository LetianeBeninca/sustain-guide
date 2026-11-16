import { ClimateSummary } from './climate';
import { ConsumptionSummary } from './appliances';
import { HomeInput, Priority, Report, Cost } from './home';
import { Lang, formatNumber, monthName, translate } from './i18n';

export interface DiagnosisInput {
  lang: Lang;
  cityLabel: string;
  climate: ClimateSummary;
  home: HomeInput;
  consumption: ConsumptionSummary;
}

/**
 * Rule-based report. It is what the app shows when the AI service is not
 * reachable (no API key, no credits, rate limit, offline), so the app always
 * returns something useful.
 */
export function buildRulesReport(input: DiagnosisInput): Report {
  const { lang, cityLabel, climate, home, consumption } = input;
  const t = (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars);
  const cityName = cityLabel.split(',')[0];
  const has = (typeId: string) => consumption.rows.some((r) => r.typeId === typeId);
  const share = (typeId: string) =>
    consumption.rows.filter((r) => r.typeId === typeId).reduce((s, r) => s + r.share, 0);

  const needsHeating = climate.profile === 'heating' || climate.profile === 'both';
  const needsCooling = climate.profile === 'cooling' || climate.profile === 'both';

  const priorities: Priority[] = [];
  const add = (id: string, cost: Cost, vars?: Record<string, string | number>) =>
    priorities.push({ title: t(`r.${id}.t`), why: t(`r.${id}.w`), how: t(`r.${id}.h`, vars), cost });

  if (home.issues.includes('damp')) add('damp', 'low');
  if (needsCooling || home.issues.includes('hotSummer')) {
    if (home.shading !== 'external') add('shade', 'medium');
    add('night', 'low');
  }
  const coldMatters = needsHeating || home.issues.includes('coldWinter');
  if (coldMatters) {
    if (home.issues.includes('drafts') || home.period === 'pre1980' || home.period === 'unknown') add('seal', 'low');
    if (home.windows === 'single') add('win', 'high');
  }
  if (home.heating === 'electric' || has('heater')) add('hp', 'high');
  if ((needsHeating || needsCooling) && (home.insulation === 'none' || home.insulation === 'unknown')) {
    add('ins', 'high');
  }
  if (share('waterHeater') + share('electricShower') >= 0.15) add('water', 'medium');
  if (coldMatters) add('sun', 'low', { equator: t(climate.southernHemisphere ? 'dir.N' : 'dir.S') });
  if (has('oldLights')) add('led', 'low');
  if (home.tenure === 'owner' && climate.solarAnnual >= 1300) add('pv', 'high');

  // Renters first see what does not need building works.
  const order: Record<Cost, number> = { low: 0, medium: 1, high: 2 };
  const sorted =
    home.tenure === 'renter' ? [...priorities].sort((a, b) => order[a.cost] - order[b.cost]) : priorities;

  let summary = t('r.summary', {
    city: cityName,
    mean: formatNumber(lang, climate.annualMean, 1),
    coldest: monthName(lang, climate.coldestMonth),
    hottest: monthName(lang, climate.hottestMonth),
    profile: t(`climate.profile.${climate.profile}`),
  });
  const top = consumption.rows[0];
  if (top) {
    summary += t('r.summary.kwh', { kwh: formatNumber(lang, consumption.totalKwh), top: t(`a.${top.typeId}`).toLowerCase() });
  }

  const appliances: string[] = [];
  if (!consumption.rows.length) {
    appliances.push(t('r.app.none'));
  } else {
    consumption.rows.slice(0, 3).forEach((r) =>
      appliances.push(t('r.app.top', { name: t(`a.${r.typeId}`), pct: Math.round(r.share * 100), kwh: formatNumber(lang, r.kwh) })),
    );
    const climateGroup = consumption.byGroup.find((g) => g.group === 'climate');
    if (climateGroup && climateGroup.share >= 0.2) {
      appliances.push(t('r.app.climate', { pct: Math.round(climateGroup.share * 100) }));
    }
  }

  const quickWins: string[] = [];
  if (needsCooling) quickWins.push(t('r.q.blinds'));
  if (home.heating !== 'none' || home.cooling === 'ac') quickWins.push(t('r.q.thermostat'));
  if (has('standby') || has('tv') || has('computer')) quickWins.push(t('r.q.standby'));
  if (has('washer')) quickWins.push(t('r.q.wash'));
  if (has('fridge')) quickWins.push(t('r.q.fridge'));
  quickWins.push(t('r.q.bill'));

  return {
    source: 'rules',
    summary,
    climateReading: t('r.climate', {
      hot: climate.hotDays,
      cold: climate.coldDays,
      rain: formatNumber(lang, climate.annualPrecip),
      sun: formatNumber(lang, climate.solarAnnual),
    }),
    priorities: sorted.slice(0, 6),
    appliances,
    quickWins: quickWins.slice(0, 4),
  };
}

/** Compact payload sent to the server function. No personal data beyond what the user typed. */
export function buildPayload(input: DiagnosisInput) {
  const { lang, cityLabel, climate, home, consumption } = input;
  return {
    lang,
    city: cityLabel,
    climate: {
      years: climate.years,
      annualMeanC: climate.annualMean,
      monthlyMeanC: climate.monthly.map((m) => m.tMean),
      monthlyMaxC: climate.monthly.map((m) => m.tMax),
      monthlyMinC: climate.monthly.map((m) => m.tMin),
      monthlyRainMm: climate.monthly.map((m) => m.precip),
      monthlySolarKwhM2Day: climate.monthly.map((m) => m.solar),
      heatingDegreeDays18: climate.hdd,
      coolingDegreeDays22: climate.cdd,
      daysAbove30: climate.hotDays,
      daysBelow5: climate.coldDays,
      solarKwhM2Year: climate.solarAnnual,
      profile: climate.profile,
      hemisphere: climate.southernHemisphere ? 'south' : 'north',
    },
    home,
    consumption: {
      totalKwhYear: consumption.totalKwh,
      kwhPerM2Year: consumption.kwhPerM2,
      appliances: consumption.rows.map((r) => ({
        type: r.typeId,
        quantity: r.quantity,
        kwhYear: r.kwh,
        sharePct: Math.round(r.share * 100),
      })),
    },
  };
}

function isReport(x: unknown): x is Omit<Report, 'source'> {
  const r = x as Report;
  return (
    !!r &&
    typeof r.summary === 'string' &&
    typeof r.climateReading === 'string' &&
    Array.isArray(r.priorities) &&
    r.priorities.length > 0 &&
    r.priorities.every((p) => p && typeof p.title === 'string' && typeof p.why === 'string' && typeof p.how === 'string') &&
    Array.isArray(r.appliances) &&
    Array.isArray(r.quickWins)
  );
}

/** Asks the server function for the AI report. Returns null on any failure. */
export async function fetchAiReport(input: DiagnosisInput): Promise<Report | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(input)),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!isReport(data.report)) return null;
    const r = data.report;
    return {
      source: 'ai',
      summary: r.summary,
      climateReading: r.climateReading,
      priorities: r.priorities.slice(0, 5).map((p) => ({
        title: p.title,
        why: p.why,
        how: p.how,
        cost: p.cost === 'low' || p.cost === 'high' ? p.cost : 'medium',
      })),
      appliances: r.appliances.filter((s) => typeof s === 'string').slice(0, 5),
      quickWins: r.quickWins.filter((s) => typeof s === 'string').slice(0, 5),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateReport(input: DiagnosisInput): Promise<Report> {
  return (await fetchAiReport(input)) ?? buildRulesReport(input);
}
