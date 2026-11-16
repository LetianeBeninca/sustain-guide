import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import pt from '@/locales/pt';
import es from '@/locales/es';
import en from '@/locales/en';

export type Lang = 'pt' | 'es' | 'en';

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'pt', label: 'PT' },
  { id: 'es', label: 'ES' },
  { id: 'en', label: 'EN' },
];

const DICTS: Record<Lang, Record<string, string>> = { pt, es, en };

export type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let s = DICTS[lang][key] ?? DICTS.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

export function monthName(lang: Lang, month: number, style: 'short' | 'long' = 'long'): string {
  const s = new Intl.DateTimeFormat(lang, { month: style, timeZone: 'UTC' }).format(new Date(Date.UTC(2024, month, 15)));
  return s.replace('.', '');
}

export function formatNumber(lang: Lang, n: number, digits = 0): string {
  return new Intl.NumberFormat(lang, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
}

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'pt' || saved === 'es' || saved === 'en') return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase();
  if (nav.startsWith('pt')) return 'pt';
  if (nav.startsWith('es') || nav.startsWith('ca') || nav.startsWith('gl')) return 'es';
  return 'en';
}

interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translate;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${translate(lang, 'app.name')} · ${translate(lang, 'app.tagline')}`;
  }, [lang]);

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem('lang', l);
        } catch {
          /* storage unavailable */
        }
      },
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n must be used inside I18nProvider');
  return v;
}
