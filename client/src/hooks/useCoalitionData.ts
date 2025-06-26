import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { sortPartiesBySeats, calculateCoalitionViability } from '../lib/coalitionUtils';
import { SEAT_CONSTANTS } from '../lib/constants';

export function useCoalitionData() {
  const { parties, partySeats, selectedParties } = useApp();

  const sortedParties = useMemo(() => 
    sortPartiesBySeats(parties, partySeats), 
    [parties, partySeats]
  );

  const coalitionSeats = useMemo(() => 
    selectedParties.reduce((sum, partyId) => sum + (partySeats[partyId] || 0), 0),
    [selectedParties, partySeats]
  );

  const hasMajority = useMemo(() => 
    coalitionSeats >= SEAT_CONSTANTS.MAJORITY_THRESHOLD,
    [coalitionSeats]
  );

  const totalSeats = useMemo(() => 
    Object.values(partySeats).reduce((sum, seats) => sum + seats, 0),
    [partySeats]
  );

  const selectedCoalitionParties = useMemo(() => 
    parties.filter(party => selectedParties.includes(party.id)),
    [parties, selectedParties]
  );

  return {
    sortedParties,
    coalitionSeats,
    hasMajority,
    totalSeats,
    selectedCoalitionParties,
    isViable: calculateCoalitionViability(selectedCoalitionParties, partySeats)
  };
}