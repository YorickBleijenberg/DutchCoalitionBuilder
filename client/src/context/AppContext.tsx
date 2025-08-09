import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useLocalStorage from '../hooks/useLocalStorage';
import partiesData from '../assets/parties.json';

export interface Party {
  id: string;
  name: string;
  fullName: string;
  color: string;
  ideology: string;
  leader: string;
  currentSeats: number;
  currentSeatsEK: number;
}

export interface Coalition {
  parties: Party[];
  totalSeats: number;
  isViable: boolean;
}

interface AppContextType {
  parties: Party[];
  partySeats: Record<string, number>;
  setPartySeats: (seats: Record<string, number>) => void;
  selectedParties: string[];
  setSelectedParties: (parties: string[]) => void;
  excludedParties: string[];
  setExcludedParties: (parties: string[]) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  ideologyFilter: boolean;
  setIdeologyFilter: (filter: boolean) => void;
  totalSeats: number;
  coalitionSeats: number;
  hasMajority: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  loadCurrentSeats: () => void;
  loadPollData: (pollSource: 'current' | 'peilingwijzer' | 'peil' | '1v') => void;
  resetSeats: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initialize with current seats as default
  const getInitialSeats = () => {
    const currentSeats: Record<string, number> = {};
    partiesData.forEach(party => {
      currentSeats[party.id] = party.currentSeats;
    });
    return currentSeats;
  };

  const [partySeats, setPartySeats] = useLocalStorage<Record<string, number>>('coalition-party-seats', getInitialSeats());
  const [selectedParties, setSelectedParties] = useLocalStorage<string[]>('coalition-selected-parties', []);
  const [excludedParties, setExcludedParties] = useLocalStorage<string[]>('coalition-excluded-parties', []);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('coalition-dark-mode', false);
  const [ideologyFilter, setIdeologyFilter] = useLocalStorage<boolean>('coalition-ideology-filter', false);
  const [language, setLanguageState] = useLocalStorage<string>('coalition-language', 'nl');
  
  const { i18n } = useTranslation();

  const parties: Party[] = partiesData;

  const totalSeats = Object.values(partySeats).reduce((sum, seats) => sum + seats, 0);
  const coalitionSeats = selectedParties.reduce((sum, partyId) => sum + (partySeats[partyId] || 0), 0);
  const hasMajority = coalitionSeats >= 76;

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const loadCurrentSeats = () => {
    const currentSeats: Record<string, number> = {};
    parties.forEach(party => {
      currentSeats[party.id] = party.currentSeats;
    });
    setPartySeats(currentSeats);
  };

  const loadPollData = (pollSource: 'current' | 'peilingwijzer' | 'peil' | '1v') => {
    const pollData: Record<string, {data: Record<string, number>, date: string}> = {
      current: {
        data: {},
        date: '2023-11-22'
      },
      peilingwijzer: {
        data: {
          'vvd': 22,
          'd66': 11,
          'gl-pvda': 27,
          'pvv': 30,
          'cda': 23,
          'sp': 6,
          'fvd': 3,
          'pvdd': 5,
          'cu': 3,
          'volt': 3,
          'ja21': 7,
          'sgp': 3,
          'denk': 3,
          'bbb': 3,
          'nsc': 1
        },
        date: '2025-07-30'
      },
      peil: {
        data: {
          'vvd': 16,
          'd66': 11,
          'gl-pvda': 28,
          'pvv': 28,
          'cda': 24,
          'sp': 8,
          'fvd': 4,
          'pvdd': 4,
          'cu': 3,
          'volt': 3,
          'ja21': 7,
          'sgp': 4,
          'denk': 4,
          'bbb': 6,
          'nsc': 0
        },
        date: '2025-08-09'
      },
      '1v': {
        data: {
          'vvd': 23,
          'd66': 10,
          'gl-pvda': 29,
          'pvv': 30,
          'cda': 23,
          'sp': 7,
          'fvd': 4,
          'pvdd': 4,
          'cu': 3,
          'volt': 2,
          'ja21': 7,
          'sgp': 3,
          'denk': 2,
          'bbb': 2,
          'nsc': 1
        },
        date: '2025-07-29'
      }
    };

    if (pollSource === 'current') {
      loadCurrentSeats();
    } else {
      const pollSeats: Record<string, number> = {};
      parties.forEach(party => {
        pollSeats[party.id] = pollData[pollSource].data[party.id] || 0;
      });
      setPartySeats(pollSeats);
    }
  };

  const resetSeats = () => {
    setPartySeats({});
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Load latest polling data by default (Peil.nl has the latest date: 2025-07-07)
  useEffect(() => {
    loadPollData('peil');
  }, []);

  const value: AppContextType = {
    parties,
    partySeats,
    setPartySeats,
    selectedParties,
    setSelectedParties,
    excludedParties,
    setExcludedParties,
    darkMode,
    toggleDarkMode,
    ideologyFilter,
    setIdeologyFilter,
    totalSeats,
    coalitionSeats,
    hasMajority,
    language,
    setLanguage,
    loadCurrentSeats,
    loadPollData,
    resetSeats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
