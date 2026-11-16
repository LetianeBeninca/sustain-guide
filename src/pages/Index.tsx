import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AppliancesStep } from '@/components/AppliancesStep';
import { CityStep } from '@/components/CityStep';
import { Header } from '@/components/Header';
import { HomeStep } from '@/components/HomeStep';
import { Results } from '@/components/Results';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApplianceEntry, summarizeConsumption } from '@/lib/appliances';
import { City, ClimateSummary, cityLabel } from '@/lib/climate';
import { DEFAULT_HOME, HomeInput, Report } from '@/lib/home';
import { useI18n } from '@/lib/i18n';
import { generateReport } from '@/lib/report';

const STEPS = ['step.city', 'step.home', 'step.appliances'];

const Index = () => {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(0);
  const [showRequired, setShowRequired] = useState(false);
  const [city, setCity] = useState<City | null>(null);
  const [climate, setClimate] = useState<ClimateSummary | null>(null);
  const [home, setHome] = useState<HomeInput>(DEFAULT_HOME);
  const [entries, setEntries] = useState<ApplianceEntry[]>([]);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('€');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const consumption = useMemo(() => summarizeConsumption(entries, home.area), [entries, home.area]);
  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const next = async () => {
    if (step === 0 && !(city && climate)) return setShowRequired(true);
    if (step === 1 && !home.area) return setShowRequired(true);
    setShowRequired(false);
    if (step < 2) {
      setStep(step + 1);
      return top();
    }
    if (!city || !climate) return;
    setLoading(true);
    const result = await generateReport({ lang, cityLabel: cityLabel(city), climate, home, consumption });
    setReport(result);
    setLoading(false);
    top();
  };

  const back = () => {
    setShowRequired(false);
    setStep(Math.max(0, step - 1));
    top();
  };

  const reset = () => {
    setReport(null);
    setStep(0);
    top();
  };

  const priceNumber = parseFloat(price);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container py-8 md:py-12 px-4 flex-1">
        {report && city && climate ? (
          <Results
            city={city}
            cityLabel={cityLabel(city)}
            climate={climate}
            home={home}
            consumption={consumption}
            report={report}
            price={priceNumber > 0 ? priceNumber : null}
            currency={currency}
            onReset={reset}
          />
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            {step === 0 && (
              <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">{t('intro.title')}</h2>
                <p className="text-foreground/80 leading-relaxed">{t('intro.text')}</p>
              </div>
            )}

            <ol className="flex items-center gap-2 text-sm" aria-label="Steps">
              {STEPS.map((key, i) => (
                <li key={key} className="flex items-center gap-2 flex-1 min-w-0">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      i <= step ? 'bg-primary text-primary-foreground' : 'bg-border text-foreground/70'
                    }`}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    {i + 1}
                  </span>
                  <span className={`truncate ${i === step ? 'font-medium text-foreground' : 'text-foreground/60'}`}>
                    {t(key)}
                  </span>
                </li>
              ))}
            </ol>

            <Card className="shadow-lg">
              <CardContent className="pt-6 space-y-6">
                {step === 0 && (
                  <CityStep
                    city={city}
                    climate={climate}
                    showRequired={showRequired}
                    onChange={(c, cl) => {
                      setCity(c);
                      setClimate(cl);
                    }}
                  />
                )}
                {step === 1 && <HomeStep home={home} onChange={setHome} showRequired={showRequired} />}
                {step === 2 && (
                  <AppliancesStep
                    entries={entries}
                    onChange={setEntries}
                    price={price}
                    onPriceChange={setPrice}
                    currency={currency}
                    onCurrencyChange={setCurrency}
                  />
                )}

                <div className="flex gap-3">
                  {step > 0 && (
                    <Button type="button" variant="outline" size="lg" onClick={back} disabled={loading}>
                      {t('btn.back')}
                    </Button>
                  )}
                  <Button type="button" size="lg" className="flex-1" onClick={next} disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {step < 2 ? t('btn.next') : loading ? t('btn.generating') : t('btn.generate')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="py-6 px-4 border-t border-border bg-card">
        <p className="text-center text-xs text-foreground/60 max-w-2xl mx-auto">{t('footer.text')}</p>
      </footer>
    </div>
  );
};

export default Index;
