import { Leaf } from 'lucide-react';
import { LANGS, useI18n } from '@/lib/i18n';

export function Header() {
  const { t, lang, setLang } = useI18n();

  return (
    <header className="w-full py-5 px-4 border-b border-border bg-card">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-serif font-semibold text-foreground tracking-tight">
              {t('app.name')}
            </h1>
            <p className="text-sm text-foreground/70 truncate">{t('app.tagline')}</p>
          </div>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden shrink-0" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLang(l.id)}
              aria-pressed={lang === l.id}
              className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                lang === l.id ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-accent'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
