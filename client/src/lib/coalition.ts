import { Party } from '../context/AppContext';

export interface CoalitionSuggestion {
  parties: Party[];
  totalSeats: number;
  isViable: boolean;
  partyCount: number;
}

export function getTopCoalitions(
  parties: Party[],
  partySeats: Record<string, number>,
  majority: number = 76,
  ideologyFilter: boolean = false,
  excludedParties: string[] = []
): CoalitionSuggestion[] {
  const partiesWithSeats = parties.filter(party => 
    (partySeats[party.id] || 0) > 0 && !excludedParties.includes(party.id)
  );
  
  if (partiesWithSeats.length === 0) {
    return [];
  }

  const combinations: CoalitionSuggestion[] = [];

  // Generate all possible combinations
  function generateCombinations(startIndex: number, currentCombination: Party[], currentSeats: number) {
    if (currentSeats >= majority) {
      const suggestion: CoalitionSuggestion = {
        parties: [...currentCombination],
        totalSeats: currentSeats,
        isViable: true,
        partyCount: currentCombination.length
      };

      // Check ideology filter
      if (ideologyFilter) {
        const ideologies = new Set(currentCombination.map(p => p.ideology));
        if (ideologies.size > 1) {
          return; // Skip this combination if ideologies don't match
        }
      }

      combinations.push(suggestion);
      return;
    }

    for (let i = startIndex; i < partiesWithSeats.length; i++) {
      const party = partiesWithSeats[i];
      const seats = partySeats[party.id] || 0;
      
      generateCombinations(
        i + 1,
        [...currentCombination, party],
        currentSeats + seats
      );
    }
  }

  generateCombinations(0, [], 0);

  // Sort by fewest parties first, then by highest seat total
  const sorted = combinations.sort((a, b) => {
    if (a.partyCount !== b.partyCount) {
      return a.partyCount - b.partyCount;
    }
    return b.totalSeats - a.totalSeats;
  });

  // Return top 5
  return sorted.slice(0, 5);
}

export function calculateSeatDifference(totalSeats: number, target: number = 150) {
  const difference = target - totalSeats;
  return {
    difference,
    isComplete: difference === 0,
    isUnder: difference > 0,
    isOver: difference < 0,
    message: difference === 0 
      ? 'Complete' 
      : difference > 0 
        ? `Unassigned ${difference}` 
        : `Over-assigned ${Math.abs(difference)}`
  };
}
