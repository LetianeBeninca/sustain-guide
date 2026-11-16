import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApplianceEntry, ApplianceType, CATALOG, annualKwh, newEntry } from '@/lib/appliances';
import { formatNumber, useI18n } from '@/lib/i18n';

interface Props {
  entries: ApplianceEntry[];
  onChange: (entries: ApplianceEntry[]) => void;
  price: string;
  onPriceChange: (price: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

const GROUPS: ApplianceType['group'][] = ['climate', 'water', 'kitchen', 'laundry', 'lighting', 'electronics'];
export const CURRENCIES = ['€', 'R$', '$', '£'];

export function AppliancesStep({ entries, onChange, price, onPriceChange, currency, onCurrencyChange }: Props) {
  const { t, lang } = useI18n();
  const [addKey, setAddKey] = useState(0); // remounts the picker so it returns to its placeholder

  const update = (key: string, patch: Partial<ApplianceEntry>) =>
    onChange(entries.map((e) => (e.key === key ? { ...e, ...patch } : e)));

  const total = entries.reduce((s, e) => s + annualKwh(e), 0);

  const num = (entry: ApplianceEntry, fieldName: keyof ApplianceEntry, label: string, step = '1', max?: number) => (
    <div className="space-y-1">
      <Label htmlFor={`${entry.key}-${fieldName}`} className="text-xs text-foreground/70">
        {label}
      </Label>
      <Input
        id={`${entry.key}-${fieldName}`}
        type="number"
        inputMode="decimal"
        min="0"
        max={max}
        step={step}
        value={Number.isFinite(entry[fieldName] as number) ? (entry[fieldName] as number) : ''}
        onChange={(e) => update(entry.key, { [fieldName]: parseFloat(e.target.value) } as Partial<ApplianceEntry>)}
        className="h-9"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-medium text-foreground">{t('app.title')}</h3>
        <p className="text-sm text-foreground/70">{t('app.help')}</p>
      </div>

      <Select
        key={addKey}
        onValueChange={(typeId) => {
          onChange([...entries, newEntry(typeId)]);
          setAddKey((k) => k + 1);
        }}
      >
        <SelectTrigger aria-label={t('app.addPlaceholder')}>
          <SelectValue placeholder={`+ ${t('app.addPlaceholder')}`} />
        </SelectTrigger>
        <SelectContent>
          {GROUPS.map((g) => (
            <SelectGroup key={g}>
              <SelectLabel>{t(`group.${g}`)}</SelectLabel>
              {CATALOG.filter((c) => c.group === g).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {t(`a.${c.id}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {entries.length === 0 && <p className="text-sm text-foreground/70">{t('app.empty')}</p>}

      <ul className="space-y-3">
        {entries.map((entry) => {
          const type = CATALOG.find((c) => c.id === entry.typeId)!;
          return (
            <li key={entry.key} className="rounded-lg border border-border bg-card p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{t(`a.${entry.typeId}`)}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm tabular-nums text-foreground">
                    {formatNumber(lang, Math.round(annualKwh(entry)))} {t('app.perYear')}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`${t('btn.remove')}: ${t(`a.${entry.typeId}`)}`}
                    onClick={() => onChange(entries.filter((e) => e.key !== entry.key))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {num(entry, 'quantity', t('app.qty'))}
                {type.mode === 'power' ? (
                  <>
                    {num(entry, 'watts', t('app.watts'), '10')}
                    {num(entry, 'hoursPerDay', t('app.hours'), '0.5', 24)}
                    {num(entry, 'monthsPerYear', t('app.months'), '1', 12)}
                  </>
                ) : (
                  <>
                    {num(entry, 'kwhPerUse', t('app.kwhUse'), '0.1')}
                    {num(entry, 'usesPerWeek', t('app.usesWeek'), '1')}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {entries.length > 0 && (
        <p className="flex items-baseline justify-between border-t border-border pt-3 text-foreground">
          <span className="text-sm font-medium">{t('app.total')}</span>
          <span className="text-lg font-semibold tabular-nums">
            {formatNumber(lang, Math.round(total))} {t('app.perYear')}
          </span>
        </p>
      )}

      <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
        <div className="space-y-2">
          <Label htmlFor="price">{t('app.price')}</Label>
          <Input
            id="price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">{t('app.currency')}</Label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger id="currency" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
