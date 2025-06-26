// Application constants
export const SEAT_CONSTANTS = {
  TOTAL_SEATS: 150,
  MAJORITY_THRESHOLD: 76,
  MIN_SEATS: 0,
  MAX_SEATS: 150,
} as const;

export const POLL_SOURCES = {
  CURRENT: 'current',
  PEILINGWIJZER: 'peilingwijzer', 
  PEIL: 'peil',
  ONE_VANDAAG: '1v',
} as const;

export const IDEOLOGICAL_COALITIONS = [
  {
    name: 'purple',
    displayName: 'Purple Coalition',
    parties: ['vvd', 'd66', 'pvda'],
    description: 'Liberal-Social Democratic Alliance'
  },
  {
    name: 'centre',
    displayName: 'Centre Coalition', 
    parties: ['vvd', 'd66', 'cda'],
    description: 'Centrist Alliance'
  },
  {
    name: 'right',
    displayName: 'Right Coalition',
    parties: ['vvd', 'pvv', 'fvd'],
    description: 'Conservative Alliance'
  },
  {
    name: 'left', 
    displayName: 'Left Coalition',
    parties: ['pvda', 'gl', 'sp'],
    description: 'Progressive Alliance'
  }
] as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MODERATE: 'moderate', 
  DIFFICULT: 'difficult',
} as const;

export const STABILITY_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60,
  LOW: 40,
} as const;