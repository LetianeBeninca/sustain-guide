import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HomeInput, Issue } from '@/lib/home';
import { useI18n } from '@/lib/i18n';

interface Props {
  home: HomeInput;
  onChange: (home: HomeInput) => void;
  showRequired: boolean;
}

const ISSUES: Issue[] = ['coldWinter', 'hotSummer', 'damp', 'drafts', 'highBills'];

export function HomeStep({ home, onChange, showRequired }: Props) {
  const { t } = useI18n();
  const set = <K extends keyof HomeInput>(key: K, value: HomeInput[K]) => onChange({ ...home, [key]: value });

  const field = <K extends keyof HomeInput>(key: K, options: string[], labelKey: string) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{t(labelKey)}</Label>
      <Select value={home[key] as string} onValueChange={(v) => set(key, v as HomeInput[K])}>
        <SelectTrigger id={key}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o === 'unknown' ? t('opt.unknown') : t(`${labelKey}.${o}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const toggleIssue = (issue: Issue, checked: boolean) =>
    set('issues', checked ? [...home.issues, issue] : home.issues.filter((i) => i !== issue));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-medium text-foreground">{t('home.title')}</h3>
        <p className="text-sm text-foreground/70">{t('home.help')}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {field('homeType', ['apartment', 'house'], 'home.type')}
        <div className="space-y-2">
          <Label htmlFor="area">{t('home.area')}</Label>
          <Input
            id="area"
            type="number"
            inputMode="decimal"
            min="1"
            value={home.area || ''}
            onChange={(e) => set('area', Math.max(0, parseFloat(e.target.value) || 0))}
            className={showRequired && !home.area ? 'border-destructive' : ''}
          />
          {showRequired && !home.area && <p className="text-sm text-destructive">{t('home.area.required')}</p>}
        </div>
        {field('tenure', ['owner', 'renter'], 'home.tenure')}
        {field('period', ['pre1980', '1980_2006', 'post2006', 'unknown'], 'home.period')}
        {field('orientation', ['N', 'S', 'E', 'W', 'unknown'], 'home.orientation')}
        {field('windows', ['single', 'double', 'unknown'], 'home.windows')}
        {field('shading', ['none', 'internal', 'external'], 'home.shading')}
        {field('insulation', ['none', 'some', 'good', 'unknown'], 'home.insulation')}
        {field('heating', ['none', 'gas', 'electric', 'heatPump', 'other'], 'home.heating')}
        {field('cooling', ['none', 'fans', 'ac'], 'home.cooling')}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">{t('home.issues')}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ISSUES.map((issue) => (
            <label key={issue} className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
              <Checkbox
                checked={home.issues.includes(issue)}
                onCheckedChange={(checked) => toggleIssue(issue, checked === true)}
              />
              {t(`issue.${issue}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('home.notes')}</Label>
        <Textarea
          id="notes"
          maxLength={500}
          rows={3}
          placeholder={t('home.notes.placeholder')}
          value={home.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </div>
    </div>
  );
}
