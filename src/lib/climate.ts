// Real climate data by city, from Open-Meteo (free, no API key).
// Geocoding: https://open-meteo.com/en/docs/geocoding-api
// Historical weather (ERA5 reanalysis): https://open-meteo.com/en/docs/historical-weather-api

export interface City {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
}

export interface MonthClimate {
  month: number; // 0-11
  tMean: number;
  tMax: number; // average daily maximum
  tMin: number; // average daily minimum
  precip: number; // mm per month
  solar: number; // kWh/m2 per day, horizontal surface
}

export type ClimateProfile = 'heating' | 'cooling' | 'both' | 'mild';

export interface ClimateSummary {
  years: [number, number];
  monthly: MonthClimate[];
  annualMean: number;
  hottestMonth: number;
  coldestMonth: number;
  annualPrecip: number;
  solarAnnual: number; // kWh/m2 per year, horizontal surface
  hdd: number; // heating degree days, base 18 C
  cdd: number; // cooling degree days, base 22 C
  hotDays: number; // days per year with maximum above 30 C
  coldDays: number; // days per year with minimum below 5 C
  profile: ClimateProfile;
  southernHemisphere: boolean;
}

export const HDD_BASE = 18;
export const CDD_BASE = 22;

export async function searchCities(query: string, lang: string, signal?: AbortSignal): Promise<City[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=${lang}&format=json`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`geocoding ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as number,
    name: r.name as string,
    admin1: r.admin1 as string | undefined,
    country: r.country as string | undefined,
    countryCode: r.country_code as string | undefined,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
    elevation: r.elevation as number | undefined,
  }));
}

export function cityLabel(c: City): string {
  return [c.name, c.admin1 !== c.name ? c.admin1 : undefined, c.country].filter(Boolean).join(', ');
}

interface DailyData {
  time: string[];
  temperature_2m_mean?: (number | null)[];
  temperature_2m_max: (number | null)[];
  temperature_2m_min: (number | null)[];
  precipitation_sum: (number | null)[];
  shortwave_radiation_sum: (number | null)[];
}

export async function fetchClimate(city: City, signal?: AbortSignal): Promise<ClimateSummary> {
  const lastYear = new Date().getFullYear() - 1;
  const firstYear = lastYear - 4; // five complete years
  const request = (variables: string) =>
    fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${city.latitude}&longitude=${city.longitude}` +
        `&start_date=${firstYear}-01-01&end_date=${lastYear}-12-31&daily=${variables}&timezone=auto`,
      { signal },
    );
  const base = 'temperature_2m_max,temperature_2m_min,precipitation_sum,shortwave_radiation_sum';
  let res = await request(`temperature_2m_mean,${base}`);
  // If the daily mean is refused, ask without it: the mean is then (max + min) / 2.
  if (res.status === 400) res = await request(base);
  if (!res.ok) throw new Error(`climate ${res.status}`);
  const data = await res.json();
  if (!data.daily?.time?.length) throw new Error('climate: empty response');
  return summarizeClimate(data.daily as DailyData, city.latitude, [firstYear, lastYear]);
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function summarizeClimate(d: DailyData, latitude: number, years: [number, number]): ClimateSummary {
  const nYears = years[1] - years[0] + 1;
  const acc = Array.from({ length: 12 }, () => ({ n: 0, mean: 0, max: 0, min: 0, precip: 0, solar: 0, solarN: 0 }));
  let hdd = 0;
  let cdd = 0;
  let hotDays = 0;
  let coldDays = 0;

  for (let i = 0; i < d.time.length; i++) {
    const tMax = d.temperature_2m_max[i];
    const tMin = d.temperature_2m_min[i];
    if (tMax == null || tMin == null) continue;
    const tMean = d.temperature_2m_mean?.[i] ?? (tMax + tMin) / 2;
    const m = Number(d.time[i].slice(5, 7)) - 1;
    const a = acc[m];
    a.n++;
    a.mean += tMean;
    a.max += tMax;
    a.min += tMin;
    a.precip += d.precipitation_sum[i] ?? 0;
    const sw = d.shortwave_radiation_sum[i];
    if (sw != null) {
      a.solar += sw / 3.6; // MJ/m2 -> kWh/m2
      a.solarN++;
    }
    hdd += Math.max(0, HDD_BASE - tMean);
    cdd += Math.max(0, tMean - CDD_BASE);
    if (tMax > 30) hotDays++;
    if (tMin < 5) coldDays++;
  }

  const monthly: MonthClimate[] = acc.map((a, month) => ({
    month,
    tMean: round1(a.mean / Math.max(1, a.n)),
    tMax: round1(a.max / Math.max(1, a.n)),
    tMin: round1(a.min / Math.max(1, a.n)),
    precip: Math.round(a.precip / nYears),
    solar: round1(a.solar / Math.max(1, a.solarN)),
  }));

  const totalDays = acc.reduce((s, a) => s + a.n, 0);
  const annualMean = round1(acc.reduce((s, a) => s + a.mean, 0) / Math.max(1, totalDays));
  const hottestMonth = monthly.reduce((b, m) => (m.tMean > monthly[b].tMean ? m.month : b), 0);
  const coldestMonth = monthly.reduce((b, m) => (m.tMean < monthly[b].tMean ? m.month : b), 0);
  const solarAnnual = Math.round(acc.reduce((s, a) => s + a.solar, 0) / nYears);
  const hddY = Math.round(hdd / nYears);
  const cddY = Math.round(cdd / nYears);

  return {
    years,
    monthly,
    annualMean,
    hottestMonth,
    coldestMonth,
    annualPrecip: monthly.reduce((s, m) => s + m.precip, 0),
    solarAnnual,
    hdd: hddY,
    cdd: cddY,
    hotDays: Math.round(hotDays / nYears),
    coldDays: Math.round(coldDays / nYears),
    profile: classifyProfile(hddY, cddY),
    southernHemisphere: latitude < 0,
  };
}

// Simple reading of which season dominates the energy need of a home.
export function classifyProfile(hdd: number, cdd: number): ClimateProfile {
  const heating = hdd >= 800;
  const cooling = cdd >= 150;
  if (heating && cooling) return 'both';
  if (heating) return 'heating';
  if (cooling) return 'cooling';
  return 'mild';
}
