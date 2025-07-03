import React, { createContext, useContext, useState } from 'react';
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

interface StemmingContextType {
  parties: Party[];
  selectedParties: string[];
  setSelectedParties: (parties: string[]) => void;
  toggleParty: (partyId: string) => void;
  selectedTKSeats: number;
  selectedEKSeats: number;
}

const StemmingContext = createContext<StemmingContextType | undefined>(undefined);

export function StemmingProvider({ children }: { children: React.ReactNode }) {
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  
  const parties = partiesData as Party[];

  const toggleParty = (partyId: string) => {
    setSelectedParties(prev => 
      prev.includes(partyId) 
        ? prev.filter(id => id !== partyId)
        : [...prev, partyId]
    );
  };

  const selectedTKSeats = selectedParties.reduce((total, partyId) => {
    const party = parties.find(p => p.id === partyId);
    return total + (party?.currentSeats || 0);
  }, 0);

  const selectedEKSeats = selectedParties.reduce((total, partyId) => {
    const party = parties.find(p => p.id === partyId);
    return total + (party?.currentSeatsEK || 0);
  }, 0);

  const value: StemmingContextType = {
    parties,
    selectedParties,
    setSelectedParties,
    toggleParty,
    selectedTKSeats,
    selectedEKSeats
  };

  return (
    <StemmingContext.Provider value={value}>
      {children}
    </StemmingContext.Provider>
  );
}

export function useStemming() {
  const context = useContext(StemmingContext);
  if (context === undefined) {
    throw new Error('useStemming must be used within a StemmingProvider');
  }
  return context;
}