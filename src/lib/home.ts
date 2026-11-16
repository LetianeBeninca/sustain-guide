export type Issue = 'coldWinter' | 'hotSummer' | 'damp' | 'drafts' | 'highBills';

export interface HomeInput {
  homeType: 'apartment' | 'house';
  area: number;
  period: 'pre1980' | '1980_2006' | 'post2006' | 'unknown';
  orientation: 'N' | 'S' | 'E' | 'W' | 'unknown';
  windows: 'single' | 'double' | 'unknown';
  shading: 'none' | 'internal' | 'external';
  insulation: 'none' | 'some' | 'good' | 'unknown';
  heating: 'none' | 'gas' | 'electric' | 'heatPump' | 'other';
  cooling: 'none' | 'fans' | 'ac';
  tenure: 'owner' | 'renter';
  issues: Issue[];
  notes: string;
}

export const DEFAULT_HOME: HomeInput = {
  homeType: 'apartment',
  area: 0,
  period: 'unknown',
  orientation: 'unknown',
  windows: 'unknown',
  shading: 'none',
  insulation: 'unknown',
  heating: 'none',
  cooling: 'none',
  tenure: 'owner',
  issues: [],
  notes: '',
};

export type Cost = 'low' | 'medium' | 'high';

export interface Priority {
  title: string;
  why: string;
  how: string;
  cost: Cost;
}

export interface Report {
  source: 'ai' | 'rules';
  summary: string;
  climateReading: string;
  priorities: Priority[];
  appliances: string[];
  quickWins: string[];
}
