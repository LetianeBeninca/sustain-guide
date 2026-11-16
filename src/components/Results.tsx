import { ArrowLeft, CheckCircle2, Download, Plug, Sparkles, Sun, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { City, ClimateSummary } from '@/lib/climate';
import { ConsumptionSummary } from '@/lib/appliances';
import { HomeInput, Report } from '@/lib/home';
import { formatNumber, useI18n } from '@/lib/i18n';
import { ClimateCard } from './ClimateCard';

interface Props {
  city: City;
  cityLabel: string;
  climate: ClimateSummary;
  home: HomeInput;
  consumption: ConsumptionSummary;
  report: Report;
  price: number | null;
  currency: string;
  onReset: () => void;
}

export function Results({ city, cityLabel, climate, home, consumption, report, price, currency, onReset }: Props) {
  const { t, lang } = useI18n();
  const { toast } = useToast();

  const subtitle = t('res.for', {
    type: t(`home.type.${home.homeType}`),
    area: formatNumber(lang, home.area),
    city: cityLabel,
  });
  const costLine =
    price && consumption.totalKwh ? `${currency} ${formatNumber(lang, consumption.totalKwh * price, 0)}` : null;

  const handlePdf = async () => {
    try {
      // Loaded on demand: the PDF library is large and most visits never need it.
      const { exportReportPdf } = await import('@/lib/pdf');
      exportReportPdf({ lang, title: t('res.title'), subtitle, report, climate, consumption, costLine });
      toast({ title: t('res.pdfDone') });
    } catch {
      toast({ title: t('res.pdfError'), variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-serif text-foreground">{t('res.title')}</h2>
        <p className="text-foreground/80">{subtitle}</p>
        <p className="inline-flex items-center gap-1.5 text-xs text-foreground/60">
          {report.source === 'ai' && <Sparkles className="h-3.5 w-3.5" />}
          {t(report.source === 'ai' ? 'res.ai' : 'res.rules')}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif">{t('res.summary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{report.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            {t('res.climate')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">{report.climateReading}</p>
          <ClimateCard cityName={city.name} climate={climate} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {t('res.priorities')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-5">
            {report.priorities.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-foreground">{p.title}</h3>
                    <Badge variant="outline" className="font-normal">
                      {t('res.cost')}: {t(`cost.${p.cost}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-medium">{t('res.why')}: </span>
                    {p.why}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-medium">{t('res.how')}: </span>
                    {p.how}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            {t('res.consumption')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {consumption.rows.length > 0 && (
            <>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs text-foreground/60">{t('res.totalYear')}</dt>
                  <dd className="text-2xl font-semibold text-foreground tabular-nums">
                    {formatNumber(lang, consumption.totalKwh)} <span className="text-sm font-normal">kWh</span>
                  </dd>
                </div>
                {consumption.kwhPerM2 != null && (
                  <div>
                    <dt className="text-xs text-foreground/60">{t('res.perM2')}</dt>
                    <dd className="text-2xl font-semibold text-foreground tabular-nums">
                      {formatNumber(lang, consumption.kwhPerM2)} <span className="text-sm font-normal">kWh/m²</span>
                    </dd>
                  </div>
                )}
                {costLine && (
                  <div>
                    <dt className="text-xs text-foreground/60">{t('res.costYear')}</dt>
                    <dd className="text-2xl font-semibold text-foreground tabular-nums">{costLine}</dd>
                  </div>
                )}
              </dl>

              <ul className="space-y-2.5" aria-label={t('res.consumption')}>
                {consumption.rows.map((r) => (
                  <li key={r.key} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-3 text-sm text-foreground">
                      <span className="min-w-0 truncate">
                        {t(`a.${r.typeId}`)}
                        {r.quantity > 1 ? ` ×${r.quantity}` : ''}
                      </span>
                      <span className="tabular-nums shrink-0">
                        {formatNumber(lang, r.kwh)} kWh · {Math.round(r.share * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-border/60">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${Math.max(1, (r.kwh / consumption.rows[0].kwh) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">{t('res.appliances')}</h3>
            <ul className="space-y-1.5 list-disc pl-5 text-sm text-foreground leading-relaxed">
              {report.appliances.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            {t('res.quick')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-foreground leading-relaxed">
            {report.quickWins.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs text-foreground/60 leading-relaxed">{t('res.assumptions')}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handlePdf} className="sm:flex-1" size="lg">
          <Download className="h-4 w-4 mr-2" />
          {t('btn.pdf')}
        </Button>
        <Button onClick={onReset} variant="outline" className="sm:flex-1" size="lg">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('btn.restart')}
        </Button>
      </div>
    </div>
  );
}
