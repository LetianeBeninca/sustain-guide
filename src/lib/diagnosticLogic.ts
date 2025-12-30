import { detectClimateZone, getClimateRecommendations, ClimateInfo } from './climateZones';

export interface DiagnosticInput {
  location: string;
  buildingType: 'residential' | 'commercial' | 'educational' | 'other';
  floorArea: number;
  projectStage: 'new_construction' | 'full_renovation' | 'partial_renovation';
  efficiencyLevel: 'low' | 'medium' | 'high';
}

export interface DiagnosticResult {
  diagnostic: string;
  recommendations: string[];
  checklist: string[];
  impactLevel: 'Low' | 'Medium' | 'High';
  impactExplanation: string;
  climateInfo: ClimateInfo;
}

const buildingTypeLabels: Record<string, string> = {
  residential: 'residential building',
  commercial: 'commercial building',
  educational: 'educational facility',
  other: 'building',
};

const projectStageLabels: Record<string, string> = {
  new_construction: 'new construction',
  full_renovation: 'full renovation',
  partial_renovation: 'partial renovation',
};

export function generateDiagnostic(input: DiagnosticInput): DiagnosticResult {
  const { location, buildingType, floorArea, projectStage, efficiencyLevel } = input;
  
  // Detect climate zone based on location
  const climateInfo = detectClimateZone(location);
  
  const buildingLabel = buildingTypeLabels[buildingType];
  const stageLabel = projectStageLabels[projectStage];
  const isLargeBuilding = floorArea >= 2000;
  const isNewConstruction = projectStage === 'new_construction';
  const isRenovation = projectStage !== 'new_construction';
  
  // Generate diagnostic paragraph with climate context
  const diagnosticParts: string[] = [];
  
  if (isNewConstruction) {
    diagnosticParts.push(
      `This ${stageLabel} project for a ${buildingLabel} in ${location} (${climateInfo.label} climate: ${climateInfo.characteristics.toLowerCase()}) presents significant opportunities to integrate climate-responsive sustainability measures from the earliest design stages.`
    );
  } else {
    diagnosticParts.push(
      `This ${stageLabel} project for a ${buildingLabel} in ${location} (${climateInfo.label} climate: ${climateInfo.characteristics.toLowerCase()}) offers valuable opportunities to enhance building performance through climate-appropriate interventions.`
    );
  }
  
  if (isLargeBuilding) {
    diagnosticParts.push(
      `With approximately ${floorArea.toLocaleString()} m² of floor area, the project scale allows for meaningful absolute reductions in energy demand and resource consumption.`
    );
  } else {
    diagnosticParts.push(
      `At approximately ${floorArea.toLocaleString()} m², focusing on high-impact, cost-effective measures will maximize sustainability improvements within the project scope.`
    );
  }
  
  // Add climate-specific context
  if (climateInfo.primaryConcern === 'cooling') {
    diagnosticParts.push(
      `Given the ${climateInfo.label.toLowerCase()} conditions, cooling load reduction and heat mitigation strategies should be prioritized.`
    );
  } else if (climateInfo.primaryConcern === 'heating') {
    diagnosticParts.push(
      `Given the ${climateInfo.label.toLowerCase()} conditions, heating efficiency and thermal retention strategies should be prioritized.`
    );
  } else {
    diagnosticParts.push(
      `The climate requires balanced attention to both heating and cooling performance throughout the year.`
    );
  }

  // Generate recommendations based on context including climate
  const recommendations = generateRecommendations(input, isNewConstruction, isRenovation, isLargeBuilding, climateInfo);
  
  // Generate checklist linked to recommendations
  const checklist = generateChecklist(recommendations, climateInfo);
  
  // Determine impact level
  const { impactLevel, impactExplanation } = calculateImpact(input, isLargeBuilding, isNewConstruction);

  return {
    diagnostic: diagnosticParts.join(' '),
    recommendations,
    checklist,
    impactLevel,
    impactExplanation,
    climateInfo,
  };
}

function generateRecommendations(
  input: DiagnosticInput,
  isNewConstruction: boolean,
  isRenovation: boolean,
  isLargeBuilding: boolean,
  climateInfo: ClimateInfo
): string[] {
  const { buildingType, efficiencyLevel } = input;
  const climateRecs = getClimateRecommendations(climateInfo);
  
  const recommendations: string[] = [];
  
  // Priority 1: Envelope (climate-specific)
  if (isRenovation) {
    recommendations.push(
      `Evaluate thermal envelope performance with climate-specific priorities. ${climateRecs.envelopeFocus}`
    );
  } else {
    recommendations.push(
      `Prioritize high-performance building envelope design optimized for ${climateInfo.label.toLowerCase()} conditions. ${climateRecs.envelopeFocus}`
    );
  }
  
  // Priority 2: Passive strategies (climate-specific)
  if (isNewConstruction) {
    recommendations.push(
      `Integrate passive design strategies appropriate for the ${climateInfo.label.toLowerCase()} climate. ${climateRecs.passiveStrategies}`
    );
  } else {
    recommendations.push(
      `Assess opportunities for passive improvements suited to local climate conditions. ${climateRecs.passiveStrategies}`
    );
  }
  
  // Priority 3: Systems (climate and efficiency level specific)
  if (efficiencyLevel === 'high') {
    if (buildingType === 'commercial' || buildingType === 'educational') {
      recommendations.push(
        `Specify high-efficiency HVAC systems optimized for ${climateInfo.primaryConcern === 'cooling' ? 'cooling-dominant' : climateInfo.primaryConcern === 'heating' ? 'heating-dominant' : 'balanced heating and cooling'} operation. ${climateRecs.systemsPriority}`
      );
    } else {
      recommendations.push(
        `Select high-efficiency systems sized for ${climateInfo.label.toLowerCase()} climate demands. ${climateRecs.systemsPriority}`
      );
    }
  } else if (efficiencyLevel === 'medium') {
    recommendations.push(
      `Evaluate mechanical system options appropriate for ${climateInfo.label.toLowerCase()} conditions, prioritizing efficiency ratings and proper sizing.`
    );
  } else {
    recommendations.push(
      `Focus on right-sizing mechanical systems for local climate conditions and ensuring proper installation practices.`
    );
  }
  
  // Priority 4: Water and resources (climate-specific)
  if (isLargeBuilding || efficiencyLevel !== 'low') {
    recommendations.push(
      `Address water management with climate-appropriate strategies. ${climateRecs.waterConsiderations}`
    );
  } else {
    recommendations.push(
      `Specify water-efficient fixtures and consider local precipitation patterns for basic rainwater management.`
    );
  }
  
  // Priority 5: Materials and lifecycle
  if (efficiencyLevel === 'high') {
    recommendations.push(
      `Consider material selection criteria including climate resilience, embodied carbon, durability under ${climateInfo.label.toLowerCase()} conditions, and local sourcing.`
    );
  } else if (efficiencyLevel === 'medium') {
    recommendations.push(
      `Incorporate sustainable material considerations prioritizing durability and performance in ${climateInfo.label.toLowerCase()} conditions.`
    );
  } else {
    recommendations.push(
      `Select durable, climate-appropriate materials to extend building lifespan and reduce maintenance requirements.`
    );
  }
  
  return recommendations;
}

function generateChecklist(recommendations: string[], climateInfo: ClimateInfo): string[] {
  const baseItems = [
    'Conduct initial assessment of current or baseline building performance conditions',
    'Define measurable sustainability targets aligned with project objectives and budget',
    'Engage relevant consultants early to inform design decisions with technical input',
  ];
  
  // Add climate-specific checklist items
  const climateItems: string[] = [];
  
  if (climateInfo.primaryConcern === 'cooling') {
    climateItems.push('Analyze solar exposure and develop shading strategy for cooling load reduction');
  } else if (climateInfo.primaryConcern === 'heating') {
    climateItems.push('Assess thermal bridging risks and develop insulation continuity strategy');
  } else {
    climateItems.push('Evaluate seasonal performance requirements and develop balanced design approach');
  }
  
  climateItems.push('Plan monitoring approach to verify performance outcomes during operation');
  
  return [...baseItems, ...climateItems];
}

function calculateImpact(
  input: DiagnosticInput,
  isLargeBuilding: boolean,
  isNewConstruction: boolean
): { impactLevel: 'Low' | 'Medium' | 'High'; impactExplanation: string } {
  const { efficiencyLevel, projectStage } = input;
  
  let score = 0;
  
  // Floor area factor
  if (isLargeBuilding) score += 2;
  else score += 1;
  
  // Project stage factor
  if (isNewConstruction) score += 2;
  else if (projectStage === 'full_renovation') score += 2;
  else score += 1;
  
  // Efficiency level factor
  if (efficiencyLevel === 'high') score += 2;
  else if (efficiencyLevel === 'medium') score += 1;
  
  let impactLevel: 'Low' | 'Medium' | 'High';
  let impactExplanation: string;
  
  if (score >= 5) {
    impactLevel = 'High';
    impactExplanation = 'The combination of project scope, intervention depth, and efficiency targets creates substantial potential for meaningful sustainability improvements.';
  } else if (score >= 3) {
    impactLevel = 'Medium';
    impactExplanation = 'The project context supports moderate sustainability improvements through targeted interventions within the defined scope.';
  } else {
    impactLevel = 'Low';
    impactExplanation = 'Focused interventions can deliver incremental sustainability benefits appropriate to the project scale and objectives.';
  }
  
  return { impactLevel, impactExplanation };
}
