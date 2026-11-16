// Appliance catalogue with typical values. Every number is an editable starting
// point: real consumption depends on the model, its age and how it is used.

export type ApplianceMode = 'power' | 'cycle';

export interface ApplianceType {
  id: string;
  mode: ApplianceMode;
  watts?: number; // rated power (mode: power)
  hoursPerDay?: number;
  monthsPerYear?: number;
  loadFactor?: number; // share of the time actually drawing rated power
  kwhPerUse?: number; // (mode: cycle)
  usesPerWeek?: number;
  group: 'climate' | 'water' | 'kitchen' | 'laundry' | 'lighting' | 'electronics';
}

export const CATALOG: ApplianceType[] = [
  { id: 'fridge', mode: 'power', watts: 120, hoursPerDay: 24, monthsPerYear: 12, loadFactor: 0.3, group: 'kitchen' },
  { id: 'freezer', mode: 'power', watts: 100, hoursPerDay: 24, monthsPerYear: 12, loadFactor: 0.35, group: 'kitchen' },
  { id: 'hob', mode: 'power', watts: 1800, hoursPerDay: 1, monthsPerYear: 12, loadFactor: 0.5, group: 'kitchen' },
  { id: 'oven', mode: 'cycle', kwhPerUse: 1.2, usesPerWeek: 2, group: 'kitchen' },
  { id: 'microwave', mode: 'power', watts: 1000, hoursPerDay: 0.15, monthsPerYear: 12, loadFactor: 1, group: 'kitchen' },
  { id: 'dishwasher', mode: 'cycle', kwhPerUse: 1.0, usesPerWeek: 4, group: 'kitchen' },
  { id: 'washer', mode: 'cycle', kwhPerUse: 0.8, usesPerWeek: 4, group: 'laundry' },
  { id: 'dryer', mode: 'cycle', kwhPerUse: 2.5, usesPerWeek: 2, group: 'laundry' },
  { id: 'waterHeater', mode: 'power', watts: 2000, hoursPerDay: 2, monthsPerYear: 12, loadFactor: 1, group: 'water' },
  { id: 'electricShower', mode: 'power', watts: 5500, hoursPerDay: 0.4, monthsPerYear: 12, loadFactor: 1, group: 'water' },
  { id: 'ac', mode: 'power', watts: 1000, hoursPerDay: 5, monthsPerYear: 3, loadFactor: 0.6, group: 'climate' },
  { id: 'heatPump', mode: 'power', watts: 1000, hoursPerDay: 6, monthsPerYear: 4, loadFactor: 0.6, group: 'climate' },
  { id: 'heater', mode: 'power', watts: 1500, hoursPerDay: 4, monthsPerYear: 4, loadFactor: 0.7, group: 'climate' },
  { id: 'fan', mode: 'power', watts: 50, hoursPerDay: 6, monthsPerYear: 4, loadFactor: 1, group: 'climate' },
  { id: 'dehumidifier', mode: 'power', watts: 300, hoursPerDay: 6, monthsPerYear: 5, loadFactor: 0.6, group: 'climate' },
  { id: 'ledLights', mode: 'power', watts: 9, hoursPerDay: 5, monthsPerYear: 12, loadFactor: 1, group: 'lighting' },
  { id: 'oldLights', mode: 'power', watts: 50, hoursPerDay: 5, monthsPerYear: 12, loadFactor: 1, group: 'lighting' },
  { id: 'tv', mode: 'power', watts: 100, hoursPerDay: 4, monthsPerYear: 12, loadFactor: 1, group: 'electronics' },
  { id: 'computer', mode: 'power', watts: 80, hoursPerDay: 6, monthsPerYear: 12, loadFactor: 1, group: 'electronics' },
  { id: 'standby', mode: 'power', watts: 15, hoursPerDay: 24, monthsPerYear: 12, loadFactor: 1, group: 'electronics' },
];

export interface ApplianceEntry {
  key: string; // unique row id
  typeId: string;
  quantity: number;
  watts: number;
  hoursPerDay: number;
  monthsPerYear: number;
  kwhPerUse: number;
  usesPerWeek: number;
}

export function newEntry(typeId: string): ApplianceEntry {
  const t = CATALOG.find((c) => c.id === typeId)!;
  return {
    key: `${typeId}-${Math.random().toString(36).slice(2, 8)}`,
    typeId,
    quantity: typeId === 'ledLights' || typeId === 'oldLights' ? 8 : 1,
    watts: t.watts ?? 0,
    hoursPerDay: t.hoursPerDay ?? 0,
    monthsPerYear: t.monthsPerYear ?? 12,
    kwhPerUse: t.kwhPerUse ?? 0,
    usesPerWeek: t.usesPerWeek ?? 0,
  };
}

const DAYS_PER_MONTH = 365 / 12;
const WEEKS_PER_YEAR = 52;

export function annualKwh(e: ApplianceEntry): number {
  const t = CATALOG.find((c) => c.id === e.typeId);
  if (!t) return 0;
  const qty = Math.max(0, e.quantity || 0);
  if (t.mode === 'cycle') {
    return qty * Math.max(0, e.kwhPerUse || 0) * Math.max(0, e.usesPerWeek || 0) * WEEKS_PER_YEAR;
  }
  const hours = Math.min(24, Math.max(0, e.hoursPerDay || 0));
  const months = Math.min(12, Math.max(0, e.monthsPerYear || 0));
  return (qty * Math.max(0, e.watts || 0) * hours * months * DAYS_PER_MONTH * (t.loadFactor ?? 1)) / 1000;
}

export interface ConsumptionRow {
  key: string;
  typeId: string;
  group: ApplianceType['group'];
  quantity: number;
  kwh: number;
  share: number; // 0-1
}

export interface ConsumptionSummary {
  rows: ConsumptionRow[]; // sorted, largest first
  totalKwh: number;
  kwhPerM2: number | null;
  byGroup: { group: ApplianceType['group']; kwh: number; share: number }[];
}

export function summarizeConsumption(entries: ApplianceEntry[], areaM2?: number): ConsumptionSummary {
  const raw = entries.map((e) => ({ e, kwh: annualKwh(e) })).filter((r) => r.kwh > 0);
  const totalKwh = raw.reduce((s, r) => s + r.kwh, 0);
  const rows: ConsumptionRow[] = raw
    .map(({ e, kwh }) => ({
      key: e.key,
      typeId: e.typeId,
      group: CATALOG.find((c) => c.id === e.typeId)!.group,
      quantity: e.quantity,
      kwh: Math.round(kwh),
      share: totalKwh ? kwh / totalKwh : 0,
    }))
    .sort((a, b) => b.kwh - a.kwh);
  const groups = new Map<ApplianceType['group'], number>();
  rows.forEach((r) => groups.set(r.group, (groups.get(r.group) ?? 0) + r.kwh));
  const byGroup = [...groups.entries()]
    .map(([group, kwh]) => ({ group, kwh, share: totalKwh ? kwh / totalKwh : 0 }))
    .sort((a, b) => b.kwh - a.kwh);
  return {
    rows,
    totalKwh: Math.round(totalKwh),
    kwhPerM2: areaM2 && areaM2 > 0 ? Math.round(totalKwh / areaM2) : null,
    byGroup,
  };
}
