import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ClimateSummary } from '@/lib/climate';
import { formatNumber, monthName, useI18n } from '@/lib/i18n';

interface Props {
  cityName: string;
  climate: ClimateSummary;
}

interface TipProps {
  active?: boolean;
  payload?: { payload: { name: string; tMean: number; tMax: number; tMin: number } }[];
}

export function ClimateCard({ cityName, climate }: Props) {
  const { t, lang } = useI18n();

  const data = climate.monthly.map((m) => ({
    label: monthName(lang, m.month, 'short'),
    name: monthName(lang, m.month, 'long'),
    tMean: m.tMean,
    tMax: m.tMax,
    tMin: m.tMin,
    range: [m.tMin, m.tMax],
  }));

  const stats = [
    { label: t('climate.annualMean'), value: `${formatNumber(lang, climate.annualMean, 1)} °C` },
    {
      label: t('climate.hottest'),
      value: `${monthName(lang, climate.hottestMonth)} · ${formatNumber(lang, climate.monthly[climate.hottestMonth].tMax, 0)} °C`,
    },
    {
      label: t('climate.coldest'),
      value: `${monthName(lang, climate.coldestMonth)} · ${formatNumber(lang, climate.monthly[climate.coldestMonth].tMin, 0)} °C`,
    },
    { label: t('climate.hotDays'), value: formatNumber(lang, climate.hotDays) },
    { label: t('climate.coldDays'), value: formatNumber(lang, climate.coldDays) },
    { label: t('climate.rain'), value: `${formatNumber(lang, climate.annualPrecip)} mm` },
    { label: t('climate.sun'), value: `${formatNumber(lang, climate.solarAnnual)} kWh/m²` },
  ];

  const Tip = ({ active, payload }: TipProps) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-md text-foreground">
        <p className="font-medium capitalize mb-1">{p.name}</p>
        <p>{t('climate.max')}: {formatNumber(lang, p.tMax, 1)} °C</p>
        <p>{t('climate.mean')}: {formatNumber(lang, p.tMean, 1)} °C</p>
        <p>{t('climate.min')}: {formatNumber(lang, p.tMin, 1)} °C</p>
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 md:p-5 space-y-4">
      <div>
        <h3 className="font-serif text-lg text-foreground">{t('climate.title', { city: cityName })}</h3>
        <p className="text-xs text-foreground/60">
          {t('climate.period', { from: climate.years[0], to: climate.years[1] })}
        </p>
      </div>

      <p className="text-sm text-foreground leading-relaxed">{t(`climate.profile.${climate.profile}`)}</p>

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-foreground/60">{s.label}</dt>
            <dd className="text-sm font-medium text-foreground first-letter:uppercase">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div>
        <p className="text-sm font-medium text-foreground">{t('climate.chartTitle')}</p>
        <p className="text-xs text-foreground/60 mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-primary" aria-hidden />
            {t('climate.mean')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 h-3 rounded-sm bg-primary/20" aria-hidden />
            {t('climate.range')}
          </span>
        </p>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--foreground))', opacity: 0.7 }} interval={0} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--foreground))', opacity: 0.7 }} width={44} />
              <Tooltip content={<Tip />} cursor={{ stroke: 'hsl(var(--foreground))', strokeOpacity: 0.25 }} />
              <Area dataKey="range" type="monotone" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.18} isAnimationActive={false} activeDot={false} />
              <Line dataKey="tMean" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: 'hsl(var(--card))', strokeWidth: 2 }} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-primary font-medium">{t('climate.table')}</summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs text-foreground">
            <thead>
              <tr className="text-left text-foreground/60 border-b border-border">
                <th className="py-1.5 pr-3 font-medium">{t('climate.month')}</th>
                <th className="py-1.5 pr-3 font-medium text-right">{t('climate.min')}</th>
                <th className="py-1.5 pr-3 font-medium text-right">{t('climate.mean')}</th>
                <th className="py-1.5 pr-3 font-medium text-right">{t('climate.max')}</th>
                <th className="py-1.5 font-medium text-right">{t('climate.rainMm')}</th>
              </tr>
            </thead>
            <tbody>
              {climate.monthly.map((m) => (
                <tr key={m.month} className="border-b border-border/50">
                  <td className="py-1.5 pr-3 capitalize">{monthName(lang, m.month)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{formatNumber(lang, m.tMin, 1)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{formatNumber(lang, m.tMean, 1)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{formatNumber(lang, m.tMax, 1)}</td>
                  <td className="py-1.5 text-right tabular-nums">{formatNumber(lang, m.precip)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
