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
  
  const buildingLabel = buildingTypeLabels[buildingType];
  const stageLabel = projectStageLabels[projectStage];
  const isLargeBuilding = floorArea >= 2000;
  const isNewConstruction = projectStage === 'new_construction';
  const isRenovation = projectStage !== 'new_construction';
  
  // Generate diagnostic paragraph
  const diagnosticParts: string[] = [];
  
  if (isNewConstruction) {
    diagnosticParts.push(
      `This ${stageLabel} project for a ${buildingLabel} in ${location} presents significant opportunities to integrate sustainability measures from the earliest design stages.`
    );
  } else {
    diagnosticParts.push(
      `This ${stageLabel} project for a ${buildingLabel} in ${location} offers valuable opportunities to enhance building performance through targeted interventions.`
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
  
  if (efficiencyLevel === 'high') {
    diagnosticParts.push(
      `The high efficiency target enables a systemic approach combining passive strategies, efficient systems, and integrated solutions.`
    );
  } else if (efficiencyLevel === 'medium') {
    diagnosticParts.push(
      `A medium efficiency target balances performance improvements with practical implementation considerations.`
    );
  } else {
    diagnosticParts.push(
      `The low efficiency target prioritizes feasible, cost-effective interventions with clear returns.`
    );
  }

  // Generate recommendations based on context
  const recommendations = generateRecommendations(input, isNewConstruction, isRenovation, isLargeBuilding);
  
  // Generate checklist linked to recommendations
  const checklist = generateChecklist(recommendations);
  
  // Determine impact level
  const { impactLevel, impactExplanation } = calculateImpact(input, isLargeBuilding, isNewConstruction);

  return {
    diagnostic: diagnosticParts.join(' '),
    recommendations,
    checklist,
    impactLevel,
    impactExplanation,
  };
}

function generateRecommendations(
  input: DiagnosticInput,
  isNewConstruction: boolean,
  isRenovation: boolean,
  isLargeBuilding: boolean
): string[] {
  const { buildingType, efficiencyLevel } = input;
  
  const recommendations: string[] = [];
  
  // Priority 1: Envelope (always highest priority for passive-first approach)
  if (isRenovation) {
    recommendations.push(
      'Evaluate thermal envelope performance and identify opportunities for insulation upgrades, window improvements, and air-tightness enhancements to reduce heating and cooling loads.'
    );
  } else {
    recommendations.push(
      'Prioritize high-performance building envelope design with optimized insulation levels, thermally broken assemblies, and appropriate glazing specifications for the local climate.'
    );
  }
  
  // Priority 2: Passive strategies
  if (isNewConstruction) {
    recommendations.push(
      'Integrate passive design strategies including building orientation, natural ventilation pathways, daylighting optimization, and external shading to minimize mechanical system dependence.'
    );
  } else {
    recommendations.push(
      'Assess opportunities for passive improvements such as enhanced natural ventilation, solar shading additions, and improved daylighting to reduce operational energy requirements.'
    );
  }
  
  // Priority 3: Systems (varies by efficiency level)
  if (efficiencyLevel === 'high') {
    if (buildingType === 'commercial' || buildingType === 'educational') {
      recommendations.push(
        'Specify high-efficiency HVAC systems with heat recovery, demand-controlled ventilation, and integrated building management for optimized operation.'
      );
    } else {
      recommendations.push(
        'Select high-efficiency heating and cooling systems with appropriate sizing, zoning capabilities, and smart controls for responsive operation.'
      );
    }
  } else if (efficiencyLevel === 'medium') {
    recommendations.push(
      'Evaluate mechanical system options prioritizing efficiency ratings, proper sizing, and basic automation to balance performance with cost-effectiveness.'
    );
  } else {
    recommendations.push(
      'Focus on right-sizing mechanical systems and ensuring proper installation practices to achieve baseline efficiency improvements.'
    );
  }
  
  // Priority 4: Water and resources
  if (isLargeBuilding || efficiencyLevel !== 'low') {
    recommendations.push(
      'Incorporate water efficiency measures including low-flow fixtures, efficient irrigation strategies, and consideration of rainwater harvesting based on local conditions.'
    );
  } else {
    recommendations.push(
      'Specify water-efficient fixtures and fittings as a straightforward measure to reduce water consumption and associated costs.'
    );
  }
  
  // Priority 5: Materials and lifecycle
  if (efficiencyLevel === 'high') {
    recommendations.push(
      'Consider material selection criteria including embodied carbon, durability, local sourcing, and end-of-life scenarios to address lifecycle environmental impacts.'
    );
  } else if (efficiencyLevel === 'medium') {
    recommendations.push(
      'Incorporate sustainable material considerations where feasible, prioritizing durable, low-maintenance options with reasonable environmental profiles.'
    );
  } else {
    recommendations.push(
      'Select durable, low-maintenance materials to extend building lifespan and reduce long-term replacement requirements.'
    );
  }
  
  return recommendations;
}

function generateChecklist(recommendations: string[]): string[] {
  const checklistItems = [
    'Conduct initial assessment of current or baseline building performance conditions',
    'Define measurable sustainability targets aligned with project objectives and budget',
    'Engage relevant consultants early to inform design decisions with technical input',
    'Establish criteria for material and system selection supporting sustainability goals',
    'Plan monitoring approach to verify performance outcomes during operation',
  ];
  
  return checklistItems;
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
