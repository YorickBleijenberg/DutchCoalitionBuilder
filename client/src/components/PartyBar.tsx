import { useApp } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';

export default function PartyBar() {
  const { parties, partySeats, totalSeats } = useApp();
  const { t } = useTranslation();

  // Sort parties by predicted seats (descending)
  const sortedParties = parties
    .map(party => ({
      ...party,
      predictedSeats: partySeats[party.id] || 0
    }))
    .filter(party => party.predictedSeats > 0)
    .sort((a, b) => b.predictedSeats - a.predictedSeats);

  const majoritySeats = 76;
  const hasMajority = totalSeats >= majoritySeats;

  return null;
}