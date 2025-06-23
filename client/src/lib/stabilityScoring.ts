import { Party } from '../context/AppContext';

export interface StabilityScore {
  overall: number;
  ideological: number;
  size: number;
  experience: number;
  historical: number;
  factors: {
    ideologySpread: number;
    sizeBalance: number;
    leadershipExperience: number;
    historicalPrecedent: number;
    coalitionComplexity: number;
  };
}

export interface CoalitionStability {
  parties: Party[];
  totalSeats: number;
  stability: StabilityScore;
  risks: string[];
  strengths: string[];
  duration: 'Short-term' | 'Medium-term' | 'Long-term';
  confidence: number;
}

// Ideology mapping for Dutch political parties
const IDEOLOGY_POSITIONS: Record<string, { economic: number; social: number; environment: number }> = {
  'vvd': { economic: 8, social: 6, environment: 4 },
  'd66': { economic: 6, social: 8, environment: 7 },
  'gl-pvda': { economic: 3, social: 8, environment: 9 },
  'pvv': { economic: 5, social: 2, environment: 3 },
  'cda': { economic: 6, social: 4, environment: 5 },
  'sp': { economic: 2, social: 7, environment: 6 },
  'fvd': { economic: 7, social: 1, environment: 2 },
  'pvdd': { economic: 4, social: 7, environment: 10 },
  'cu': { economic: 5, social: 3, environment: 6 },
  'volt': { economic: 6, social: 8, environment: 8 },
  'ja21': { economic: 7, social: 3, environment: 3 },
  'sgp': { economic: 6, social: 1, environment: 4 },
  'denk': { economic: 4, social: 6, environment: 5 },
  'bbb': { economic: 5, social: 4, environment: 3 },
  'nsc': { economic: 6, social: 5, environment: 5 }
};

// Leadership experience data (years in major political roles)
const LEADERSHIP_EXPERIENCE: Record<string, number> = {
  'vvd': 12, 'd66': 8, 'gl-pvda': 15, 'pvv': 18, 'cda': 20,
  'sp': 10, 'fvd': 3, 'pvdd': 6, 'cu': 12, 'volt': 2,
  'ja21': 1, 'sgp': 25, 'denk': 4, 'bbb': 1, 'nsc': 2
};

// Historical coalition success patterns
const COALITION_HISTORY: Record<string, number> = {
  'vvd-cda': 0.8, 'vvd-d66': 0.7, 'cda-cu': 0.9, 'gl-pvda-d66': 0.6,
  'vvd-cda-cu': 0.8, 'vvd-cda-d66': 0.7, 'gl-pvda-sp': 0.5, 'pvv-fvd': 0.3
};

export function calculateStabilityScore(
  parties: Party[],
  partySeats: Record<string, number>
): CoalitionStability {
  const totalSeats = parties.reduce((sum, party) => sum + (partySeats[party.id] || 0), 0);
  
  // Calculate individual scoring factors
  const ideologySpread = calculateIdeologySpread(parties);
  const sizeBalance = calculateSizeBalance(parties, partySeats);
  const leadershipExperience = calculateLeadershipExperience(parties);
  const historicalPrecedent = calculateHistoricalPrecedent(parties);
  const coalitionComplexity = calculateCoalitionComplexity(parties);

  // Weighted scoring components
  const ideological = Math.max(0, (10 - ideologySpread) / 10 * 100);
  const size = sizeBalance * 100;
  const experience = leadershipExperience * 100;
  const historical = historicalPrecedent * 100;

  // Overall stability score (weighted average)
  const overall = (
    ideological * 0.3 +
    size * 0.2 +
    experience * 0.2 +
    historical * 0.2 +
    (100 - coalitionComplexity * 10) * 0.1
  );

  const stability: StabilityScore = {
    overall: Math.round(overall),
    ideological: Math.round(ideological),
    size: Math.round(size),
    experience: Math.round(experience),
    historical: Math.round(historical),
    factors: {
      ideologySpread,
      sizeBalance,
      leadershipExperience,
      historicalPrecedent,
      coalitionComplexity
    }
  };

  // Determine risks and strengths
  const risks = identifyRisks(stability, parties);
  const strengths = identifyStrengths(stability, parties);
  
  // Estimate coalition duration
  const duration = estimateDuration(overall);
  
  // Confidence level based on data quality
  const confidence = calculateConfidence(parties, stability);

  return {
    parties,
    totalSeats,
    stability,
    risks,
    strengths,
    duration,
    confidence
  };
}

function calculateIdeologySpread(parties: Party[]): number {
  if (parties.length < 2) return 0;
  
  const positions = parties.map(party => IDEOLOGY_POSITIONS[party.id] || { economic: 5, social: 5, environment: 5 });
  
  const economicSpread = Math.max(...positions.map(p => p.economic)) - Math.min(...positions.map(p => p.economic));
  const socialSpread = Math.max(...positions.map(p => p.social)) - Math.min(...positions.map(p => p.social));
  const environmentSpread = Math.max(...positions.map(p => p.environment)) - Math.min(...positions.map(p => p.environment));
  
  return (economicSpread + socialSpread + environmentSpread) / 3;
}

function calculateSizeBalance(parties: Party[], partySeats: Record<string, number>): number {
  if (parties.length < 2) return 1;
  
  const seats = parties.map(party => partySeats[party.id] || 0);
  const totalSeats = seats.reduce((sum, s) => sum + s, 0);
  
  if (totalSeats === 0) return 0;
  
  // Calculate Herfindahl-Hirschman Index for balance
  const shares = seats.map(s => s / totalSeats);
  const hhi = shares.reduce((sum, share) => sum + share * share, 0);
  
  // Convert to balance score (lower HHI = more balanced = higher score)
  const maxHHI = 1 / parties.length; // Most balanced scenario
  return Math.max(0, 1 - (hhi - maxHHI) / (1 - maxHHI));
}

function calculateLeadershipExperience(parties: Party[]): number {
  const experiences = parties.map(party => LEADERSHIP_EXPERIENCE[party.id] || 0);
  const avgExperience = experiences.reduce((sum, exp) => sum + exp, 0) / parties.length;
  
  // Normalize to 0-1 scale (25 years = max score)
  return Math.min(avgExperience / 25, 1);
}

function calculateHistoricalPrecedent(parties: Party[]): number {
  if (parties.length < 2) return 0.5; // Neutral score for single party
  
  // Check for known successful coalition patterns
  const partyIds = parties.map(p => p.id).sort();
  
  // Check exact matches first
  const coalitionKey = partyIds.join('-');
  if (COALITION_HISTORY[coalitionKey]) {
    return COALITION_HISTORY[coalitionKey];
  }
  
  // Check partial matches (subsets)
  let bestMatch = 0;
  for (const [key, score] of Object.entries(COALITION_HISTORY)) {
    const keyParties = key.split('-');
    const matchCount = keyParties.filter(id => partyIds.includes(id)).length;
    const matchRatio = matchCount / Math.max(keyParties.length, partyIds.length);
    
    if (matchRatio > 0.5) {
      bestMatch = Math.max(bestMatch, score * matchRatio);
    }
  }
  
  return bestMatch || 0.5; // Default neutral score
}

function calculateCoalitionComplexity(parties: Party[]): number {
  // More parties = higher complexity
  const partyComplexity = Math.min(parties.length / 5, 1);
  
  // Ideological diversity adds complexity
  const ideologyComplexity = calculateIdeologySpread(parties) / 10;
  
  return (partyComplexity + ideologyComplexity) / 2;
}

function identifyRisks(stability: StabilityScore, parties: Party[]): string[] {
  const risks: string[] = [];
  
  if (stability.ideological < 60) {
    risks.push('High ideological differences may cause internal conflicts');
  }
  
  if (stability.size < 50) {
    risks.push('Unbalanced party sizes could lead to dominance issues');
  }
  
  if (stability.experience < 40) {
    risks.push('Limited leadership experience in coalition management');
  }
  
  if (stability.historical < 30) {
    risks.push('No historical precedent for this party combination');
  }
  
  if (parties.length > 4) {
    risks.push('Large coalition may face coordination challenges');
  }
  
  if (stability.factors.coalitionComplexity > 0.7) {
    risks.push('High complexity may slow decision-making processes');
  }
  
  return risks;
}

function identifyStrengths(stability: StabilityScore, parties: Party[]): string[] {
  const strengths: string[] = [];
  
  if (stability.ideological > 70) {
    strengths.push('Strong ideological alignment supports policy coherence');
  }
  
  if (stability.size > 70) {
    strengths.push('Well-balanced party representation prevents dominance');
  }
  
  if (stability.experience > 70) {
    strengths.push('Experienced leadership enhances coalition management');
  }
  
  if (stability.historical > 70) {
    strengths.push('Strong historical precedent for successful cooperation');
  }
  
  if (parties.length === 2 && stability.overall > 60) {
    strengths.push('Two-party coalition enables efficient decision-making');
  }
  
  if (stability.factors.coalitionComplexity < 0.3) {
    strengths.push('Low complexity facilitates smooth governance');
  }
  
  return strengths;
}

function estimateDuration(overallScore: number): 'Short-term' | 'Medium-term' | 'Long-term' {
  if (overallScore >= 75) return 'Long-term';
  if (overallScore >= 50) return 'Medium-term';
  return 'Short-term';
}

function calculateConfidence(parties: Party[], stability: StabilityScore): number {
  // Higher confidence for well-known parties and coalition patterns
  const knownParties = parties.filter(p => IDEOLOGY_POSITIONS[p.id] && LEADERSHIP_EXPERIENCE[p.id]);
  const dataQuality = knownParties.length / parties.length;
  
  // Historical data availability
  const hasHistoricalData = stability.historical > 0.5 ? 1 : 0.7;
  
  return Math.round(dataQuality * hasHistoricalData * 100);
}

export function getTopStableCoalitions(
  parties: Party[],
  partySeats: Record<string, number>,
  minSeats: number = 76,
  excludedParties: string[] = []
): CoalitionStability[] {
  const availableParties = parties.filter(party => 
    (partySeats[party.id] || 0) > 0 && !excludedParties.includes(party.id)
  );
  
  const coalitions: CoalitionStability[] = [];
  
  // Generate coalitions of different sizes (2-5 parties)
  for (let size = 2; size <= Math.min(5, availableParties.length); size++) {
    const combinations = generateCombinations(availableParties, size);
    
    for (const combination of combinations) {
      const totalSeats = combination.reduce((sum, party) => sum + (partySeats[party.id] || 0), 0);
      
      if (totalSeats >= minSeats) {
        const stability = calculateStabilityScore(combination, partySeats);
        coalitions.push(stability);
      }
    }
  }
  
  // Sort by stability score and return top 10
  return coalitions
    .sort((a, b) => b.stability.overall - a.stability.overall)
    .slice(0, 10);
}

function generateCombinations<T>(array: T[], size: number): T[][] {
  if (size === 1) return array.map(item => [item]);
  if (size === array.length) return [array];
  if (size > array.length) return [];
  
  const combinations: T[][] = [];
  
  for (let i = 0; i <= array.length - size; i++) {
    const smallerCombinations = generateCombinations(array.slice(i + 1), size - 1);
    for (const smaller of smallerCombinations) {
      combinations.push([array[i], ...smaller]);
    }
  }
  
  return combinations;
}