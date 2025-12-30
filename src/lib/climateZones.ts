export type ClimateZone = 
  | 'tropical'
  | 'arid'
  | 'temperate'
  | 'continental'
  | 'polar'
  | 'mediterranean';

export interface ClimateInfo {
  zone: ClimateZone;
  label: string;
  characteristics: string;
  primaryConcern: 'cooling' | 'heating' | 'both';
}

// Climate zone data based on Köppen climate classification simplified for building design
const climateDatabase: Record<string, ClimateInfo> = {
  // Tropical regions
  'singapore': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'bangkok': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'jakarta': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'manila': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'mumbai': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid with monsoon', primaryConcern: 'cooling' },
  'kuala lumpur': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'rio de janeiro': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'miami': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid subtropical', primaryConcern: 'cooling' },
  'hawaii': { zone: 'tropical', label: 'Tropical', characteristics: 'Warm oceanic climate', primaryConcern: 'cooling' },
  'honolulu': { zone: 'tropical', label: 'Tropical', characteristics: 'Warm oceanic climate', primaryConcern: 'cooling' },
  
  // Arid regions
  'dubai': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry with extreme temperatures', primaryConcern: 'cooling' },
  'abu dhabi': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry with extreme temperatures', primaryConcern: 'cooling' },
  'riyadh': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry desert climate', primaryConcern: 'cooling' },
  'doha': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry desert climate', primaryConcern: 'cooling' },
  'phoenix': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry desert climate', primaryConcern: 'cooling' },
  'las vegas': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry desert climate', primaryConcern: 'cooling' },
  'cairo': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry desert climate', primaryConcern: 'cooling' },
  'marrakech': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot semi-arid climate', primaryConcern: 'cooling' },
  'tehran': { zone: 'arid', label: 'Arid/Semi-arid', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  
  // Mediterranean regions
  'barcelona': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, mild wet winters', primaryConcern: 'both' },
  'madrid': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, cold winters', primaryConcern: 'both' },
  'rome': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, mild winters', primaryConcern: 'both' },
  'milan': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  'athens': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, mild winters', primaryConcern: 'both' },
  'lisbon': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Warm dry summers, mild winters', primaryConcern: 'both' },
  'tel aviv': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, mild winters', primaryConcern: 'cooling' },
  'los angeles': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Warm dry summers, mild winters', primaryConcern: 'cooling' },
  'san francisco': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Mild year-round with fog', primaryConcern: 'both' },
  'cape town': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Warm dry summers, mild winters', primaryConcern: 'both' },
  'perth': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, mild winters', primaryConcern: 'cooling' },
  'adelaide': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot summers, mild winters', primaryConcern: 'both' },
  
  // Temperate regions
  'london': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild temperatures, frequent rain', primaryConcern: 'heating' },
  'paris': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild summers, cool winters', primaryConcern: 'heating' },
  'amsterdam': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild maritime climate', primaryConcern: 'heating' },
  'brussels': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild maritime climate', primaryConcern: 'heating' },
  'dublin': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild and wet year-round', primaryConcern: 'heating' },
  'seattle': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild with wet winters', primaryConcern: 'heating' },
  'portland': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild with wet winters', primaryConcern: 'heating' },
  'vancouver': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild oceanic climate', primaryConcern: 'heating' },
  'auckland': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild maritime climate', primaryConcern: 'heating' },
  'wellington': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild and windy', primaryConcern: 'heating' },
  'melbourne': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Variable weather, mild overall', primaryConcern: 'both' },
  'sydney': { zone: 'temperate', label: 'Temperate', characteristics: 'Warm summers, mild winters', primaryConcern: 'both' },
  'tokyo': { zone: 'temperate', label: 'Temperate Humid', characteristics: 'Hot humid summers, mild winters', primaryConcern: 'both' },
  'seoul': { zone: 'temperate', label: 'Temperate Humid', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  'shanghai': { zone: 'temperate', label: 'Temperate Humid', characteristics: 'Hot humid summers, cold winters', primaryConcern: 'both' },
  'new york': { zone: 'temperate', label: 'Temperate Humid', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  'washington': { zone: 'temperate', label: 'Temperate Humid', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  'boston': { zone: 'temperate', label: 'Temperate Humid', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'sao paulo': { zone: 'temperate', label: 'Temperate Humid', characteristics: 'Mild temperatures year-round', primaryConcern: 'both' },
  'buenos aires': { zone: 'temperate', label: 'Temperate Humid', characteristics: 'Warm summers, mild winters', primaryConcern: 'both' },
  
  // Continental regions
  'berlin': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'munich': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold snowy winters', primaryConcern: 'heating' },
  'vienna': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'prague': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'warsaw': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'zurich': { zone: 'continental', label: 'Continental', characteristics: 'Mild summers, cold winters', primaryConcern: 'heating' },
  'geneva': { zone: 'continental', label: 'Continental', characteristics: 'Mild summers, cold winters', primaryConcern: 'heating' },
  'copenhagen': { zone: 'continental', label: 'Continental', characteristics: 'Cool summers, cold winters', primaryConcern: 'heating' },
  'stockholm': { zone: 'continental', label: 'Continental', characteristics: 'Mild summers, cold winters', primaryConcern: 'heating' },
  'oslo': { zone: 'continental', label: 'Continental', characteristics: 'Cool summers, cold winters', primaryConcern: 'heating' },
  'helsinki': { zone: 'continental', label: 'Continental', characteristics: 'Cool summers, very cold winters', primaryConcern: 'heating' },
  'moscow': { zone: 'continental', label: 'Continental', characteristics: 'Short summers, very cold winters', primaryConcern: 'heating' },
  'chicago': { zone: 'continental', label: 'Continental', characteristics: 'Hot summers, very cold winters', primaryConcern: 'both' },
  'toronto': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'montreal': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, very cold winters', primaryConcern: 'heating' },
  'minneapolis': { zone: 'continental', label: 'Continental', characteristics: 'Hot summers, very cold winters', primaryConcern: 'heating' },
  'denver': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters, dry', primaryConcern: 'both' },
  'beijing': { zone: 'continental', label: 'Continental', characteristics: 'Hot summers, very cold winters', primaryConcern: 'both' },
  
  // Polar/Subarctic regions
  'reykjavik': { zone: 'polar', label: 'Subarctic', characteristics: 'Cool summers, cold winters', primaryConcern: 'heating' },
  'anchorage': { zone: 'polar', label: 'Subarctic', characteristics: 'Cool summers, very cold winters', primaryConcern: 'heating' },
  'fairbanks': { zone: 'polar', label: 'Subarctic', characteristics: 'Short summers, extreme cold winters', primaryConcern: 'heating' },
  'tromso': { zone: 'polar', label: 'Subarctic', characteristics: 'Cool summers, cold winters', primaryConcern: 'heating' },
};

// Country-based fallback climate assignments
const countryClimateDefaults: Record<string, ClimateInfo> = {
  // Tropical countries
  'indonesia': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'malaysia': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'thailand': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'philippines': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid year-round', primaryConcern: 'cooling' },
  'vietnam': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid', primaryConcern: 'cooling' },
  'india': { zone: 'tropical', label: 'Tropical/Subtropical', characteristics: 'Hot with monsoon seasons', primaryConcern: 'cooling' },
  'brazil': { zone: 'tropical', label: 'Tropical', characteristics: 'Warm to hot year-round', primaryConcern: 'cooling' },
  'nigeria': { zone: 'tropical', label: 'Tropical', characteristics: 'Hot and humid', primaryConcern: 'cooling' },
  'kenya': { zone: 'tropical', label: 'Tropical', characteristics: 'Warm with seasonal variation', primaryConcern: 'cooling' },
  
  // Arid countries
  'uae': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry', primaryConcern: 'cooling' },
  'united arab emirates': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry', primaryConcern: 'cooling' },
  'saudi arabia': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry', primaryConcern: 'cooling' },
  'qatar': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry', primaryConcern: 'cooling' },
  'egypt': { zone: 'arid', label: 'Arid/Desert', characteristics: 'Hot and dry', primaryConcern: 'cooling' },
  'morocco': { zone: 'arid', label: 'Arid/Semi-arid', characteristics: 'Hot and dry', primaryConcern: 'cooling' },
  'iran': { zone: 'arid', label: 'Arid/Semi-arid', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  
  // Mediterranean countries
  'spain': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, mild winters', primaryConcern: 'both' },
  'italy': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot summers, mild winters', primaryConcern: 'both' },
  'greece': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, mild winters', primaryConcern: 'both' },
  'portugal': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Warm dry summers, mild winters', primaryConcern: 'both' },
  'israel': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot dry summers, mild winters', primaryConcern: 'cooling' },
  'turkey': { zone: 'mediterranean', label: 'Mediterranean', characteristics: 'Hot summers, variable winters', primaryConcern: 'both' },
  
  // Temperate countries
  'uk': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild temperatures, frequent rain', primaryConcern: 'heating' },
  'united kingdom': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild temperatures, frequent rain', primaryConcern: 'heating' },
  'england': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild temperatures, frequent rain', primaryConcern: 'heating' },
  'ireland': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild and wet year-round', primaryConcern: 'heating' },
  'france': { zone: 'temperate', label: 'Temperate', characteristics: 'Variable by region', primaryConcern: 'heating' },
  'netherlands': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild maritime climate', primaryConcern: 'heating' },
  'belgium': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild maritime climate', primaryConcern: 'heating' },
  'japan': { zone: 'temperate', label: 'Temperate', characteristics: 'Variable by region', primaryConcern: 'both' },
  'south korea': { zone: 'temperate', label: 'Temperate', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  'korea': { zone: 'temperate', label: 'Temperate', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  'china': { zone: 'temperate', label: 'Temperate', characteristics: 'Variable by region', primaryConcern: 'both' },
  'australia': { zone: 'temperate', label: 'Temperate', characteristics: 'Variable by region', primaryConcern: 'both' },
  'new zealand': { zone: 'temperate', label: 'Temperate Oceanic', characteristics: 'Mild maritime climate', primaryConcern: 'heating' },
  'usa': { zone: 'temperate', label: 'Temperate', characteristics: 'Variable by region', primaryConcern: 'both' },
  'united states': { zone: 'temperate', label: 'Temperate', characteristics: 'Variable by region', primaryConcern: 'both' },
  
  // Continental countries
  'germany': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'austria': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'switzerland': { zone: 'continental', label: 'Continental', characteristics: 'Variable by altitude', primaryConcern: 'heating' },
  'czech republic': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'czechia': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'poland': { zone: 'continental', label: 'Continental', characteristics: 'Warm summers, cold winters', primaryConcern: 'heating' },
  'hungary': { zone: 'continental', label: 'Continental', characteristics: 'Hot summers, cold winters', primaryConcern: 'both' },
  'denmark': { zone: 'continental', label: 'Continental', characteristics: 'Cool summers, cold winters', primaryConcern: 'heating' },
  'sweden': { zone: 'continental', label: 'Continental', characteristics: 'Mild summers, cold winters', primaryConcern: 'heating' },
  'norway': { zone: 'continental', label: 'Continental', characteristics: 'Cool summers, cold winters', primaryConcern: 'heating' },
  'finland': { zone: 'continental', label: 'Continental', characteristics: 'Cool summers, very cold winters', primaryConcern: 'heating' },
  'russia': { zone: 'continental', label: 'Continental', characteristics: 'Short summers, very cold winters', primaryConcern: 'heating' },
  'canada': { zone: 'continental', label: 'Continental', characteristics: 'Variable by region, cold winters', primaryConcern: 'heating' },
  
  // Polar/Subarctic
  'iceland': { zone: 'polar', label: 'Subarctic', characteristics: 'Cool summers, cold winters', primaryConcern: 'heating' },
  'greenland': { zone: 'polar', label: 'Polar', characteristics: 'Very cold year-round', primaryConcern: 'heating' },
};

export function detectClimateZone(location: string): ClimateInfo {
  const normalizedLocation = location.toLowerCase().trim();
  
  // First, try to match city names
  for (const [city, climate] of Object.entries(climateDatabase)) {
    if (normalizedLocation.includes(city)) {
      return climate;
    }
  }
  
  // Then, try to match country names
  for (const [country, climate] of Object.entries(countryClimateDefaults)) {
    if (normalizedLocation.includes(country)) {
      return climate;
    }
  }
  
  // Default to temperate if no match found
  return {
    zone: 'temperate',
    label: 'Temperate (Estimated)',
    characteristics: 'Moderate seasonal variation',
    primaryConcern: 'both',
  };
}

export function getClimateRecommendations(climate: ClimateInfo): {
  envelopeFocus: string;
  passiveStrategies: string;
  systemsPriority: string;
  waterConsiderations: string;
} {
  switch (climate.zone) {
    case 'tropical':
      return {
        envelopeFocus: 'Focus on solar heat gain reduction, roof insulation, and moisture-resistant assemblies to manage heat and humidity effectively.',
        passiveStrategies: 'Prioritize cross-ventilation, elevated structures for airflow, extensive shading devices, and reflective or vegetated roof surfaces.',
        systemsPriority: 'Select high-efficiency cooling systems with dehumidification capabilities and consider displacement ventilation strategies.',
        waterConsiderations: 'Integrate rainwater harvesting given abundant precipitation, and ensure proper drainage and moisture management.',
      };
    case 'arid':
      return {
        envelopeFocus: 'Emphasize high thermal mass construction, well-insulated assemblies, and reflective exterior surfaces to moderate extreme temperature swings.',
        passiveStrategies: 'Incorporate thermal mass, night cooling strategies, minimal west-facing glazing, and consider courtyard configurations for microclimate control.',
        systemsPriority: 'Evaluate evaporative cooling potential and specify systems optimized for dry conditions with minimal water consumption.',
        waterConsiderations: 'Prioritize water efficiency as the primary resource concern, with greywater recycling and drought-tolerant landscaping.',
      };
    case 'mediterranean':
      return {
        envelopeFocus: 'Design envelope to address both summer cooling and winter heating needs with appropriate thermal mass and insulation balance.',
        passiveStrategies: 'Integrate adjustable shading systems, thermal mass for temperature stabilization, and natural ventilation for shoulder seasons.',
        systemsPriority: 'Consider reversible heat pump systems to efficiently address both heating and cooling demands throughout the year.',
        waterConsiderations: 'Plan for seasonal water availability variations with storage systems and drought-resistant landscape approaches.',
      };
    case 'continental':
      return {
        envelopeFocus: 'Prioritize high insulation levels, airtight construction, and thermal bridge elimination to address significant heating loads.',
        passiveStrategies: 'Maximize south-facing glazing with appropriate shading, incorporate thermal mass for heat storage, and ensure controlled ventilation with heat recovery.',
        systemsPriority: 'Specify high-efficiency heating systems with consideration for brief summer cooling periods in well-insulated buildings.',
        waterConsiderations: 'Consider snow melt and seasonal precipitation patterns in drainage design and potential rainwater collection.',
      };
    case 'polar':
      return {
        envelopeFocus: 'Maximize insulation to exceptional levels, eliminate thermal bridges completely, and ensure vapor-tight construction to prevent moisture damage.',
        passiveStrategies: 'Optimize for minimal heat loss with compact building forms, vestibule entries, and maximum passive solar gain during limited daylight hours.',
        systemsPriority: 'Focus exclusively on highly efficient heating systems with robust heat recovery ventilation and backup capacity.',
        waterConsiderations: 'Address freeze-thaw cycles in water systems and consider seasonal water availability constraints.',
      };
    case 'temperate':
    default:
      return {
        envelopeFocus: 'Balance insulation and thermal mass to address moderate heating demands with some summer overheating prevention.',
        passiveStrategies: 'Incorporate natural ventilation, moderate solar gain optimization, and appropriate shading to minimize mechanical system dependence.',
        systemsPriority: 'Select balanced systems capable of efficient heating with supplementary cooling capacity for warming periods.',
        waterConsiderations: 'Integrate rainwater management systems appropriate to consistent precipitation patterns throughout the year.',
      };
  }
}
