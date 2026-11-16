import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { City, ClimateSummary, cityLabel, fetchClimate, searchCities } from '@/lib/climate';
import { useI18n } from '@/lib/i18n';
import { ClimateCard } from './ClimateCard';

interface Props {
  city: City | null;
  climate: ClimateSummary | null;
  onChange: (city: City | null, climate: ClimateSummary | null) => void;
  showRequired: boolean;
}

export function CityStep({ city, climate, onChange, showRequired }: Props) {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState(city ? cityLabel(city) : '');
  const [results, setResults] = useState<City[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [loadingClimate, setLoadingClimate] = useState(false);
  const [climateError, setClimateError] = useState(false);
  const skipSearch = useRef(!!city);

  // Debounced city search.
  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(false);
      try {
        setResults(await searchCities(q, lang, controller.signal));
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setSearchError(true);
          setResults(null);
        }
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, lang]);

  const pick = async (c: City) => {
    skipSearch.current = true;
    setQuery(cityLabel(c));
    setResults(null);
    setClimateError(false);
    setLoadingClimate(true);
    onChange(c, null);
    try {
      onChange(c, await fetchClimate(c));
    } catch {
      setClimateError(true);
      onChange(null, null);
    } finally {
      setLoadingClimate(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {t('city.title')}
        </Label>
        <p className="text-sm text-foreground/70">{t('city.help')}</p>
        <div className="relative">
          <Input
            id="city"
            autoComplete="off"
            placeholder={t('city.placeholder')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (city) onChange(null, null);
            }}
          />
          {searching && <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-foreground/50" />}
        </div>

        {results && results.length > 0 && (
          <ul className="rounded-md border border-border bg-card divide-y divide-border overflow-hidden">
            {results.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => pick(c)}
                  className="w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-accent focus:bg-accent focus:outline-none"
                >
                  {cityLabel(c)}
                </button>
              </li>
            ))}
          </ul>
        )}
        {results && results.length === 0 && !searching && (
          <p className="text-sm text-foreground/70">{t('city.none')}</p>
        )}
        {searchError && <p className="text-sm text-destructive">{t('city.error')}</p>}
        {climateError && <p className="text-sm text-destructive">{t('city.climateError')}</p>}
        {showRequired && !climate && !loadingClimate && (
          <p className="text-sm text-destructive">{t('city.required')}</p>
        )}
      </div>

      {loadingClimate && (
        <p className="flex items-center gap-2 text-sm text-foreground/70">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('city.loadingClimate')}
        </p>
      )}

      {city && climate && <ClimateCard cityName={city.name} climate={climate} />}
    </div>
  );
}
