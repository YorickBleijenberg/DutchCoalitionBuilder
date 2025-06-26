import { Party } from '../context/AppContext';

// Common coalition utilities
export interface CoalitionOption {
  name: string;
  seats: number;
  viable: boolean;
  impact: number;
  parties: Party[];
}

export interface DifficultyConfig {
  easy: string;
  moderate: string; 
  difficult: string;
  default: string;
}

export const DIFFICULTY_COLORS: DifficultyConfig = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  difficult: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};

export const getDifficultyColor = (difficulty: string): string => {
  return DIFFICULTY_COLORS[difficulty as keyof DifficultyConfig] || DIFFICULTY_COLORS.default;
};

export const calculateCoalitionViability = (parties: Party[], partySeats: Record<string, number>): boolean => {
  const totalSeats = parties.reduce((sum, party) => sum + (partySeats[party.id] || 0), 0);
  return totalSeats >= 76;
};

export const formatSeatChange = (difference: number): string => {
  if (difference > 0) return `+${difference}`;
  if (difference < 0) return `${difference}`;
  return '0';
};

export const getSeatChangeColor = (difference: number): string => {
  if (difference > 0) return 'text-green-600';
  if (difference < 0) return 'text-red-600';
  return 'text-gray-500';
};

export const sortPartiesBySeats = (parties: Party[], partySeats: Record<string, number>, descending = true): Party[] => {
  return [...parties].sort((a, b) => {
    const seatsA = partySeats[a.id] || 0;
    const seatsB = partySeats[b.id] || 0;
    return descending ? seatsB - seatsA : seatsA - seatsB;
  });
};

export const getPartiesWithSeats = (parties: Party[], partySeats: Record<string, number>): Party[] => {
  return parties.filter(party => (partySeats[party.id] || 0) > 0);
};