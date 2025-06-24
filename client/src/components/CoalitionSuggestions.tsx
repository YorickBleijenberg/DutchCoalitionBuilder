import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { getTopCoalitions } from '../lib/coalition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Layers, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function CoalitionSuggestions() {
  const { t } = useTranslation();
  const { 
    parties, 
    partySeats, 
    excludedParties,
    setExcludedParties,
    selectedParties,
    setSelectedParties 
  } = useApp();

  const [includedParty, setIncludedParty] = useState<string | null>(null);

  let coalitionSuggestions = getTopCoalitions(parties, partySeats, 76, false, excludedParties);
  
  // Filter by included party if one is selected
  if (includedParty) {
    coalitionSuggestions = coalitionSuggestions.filter(coalition => 
      coalition.parties.some(party => party.id === includedParty)
    );
  }
  
  // Define ideological coalitions
  const getIdeologicalCoalitions = () => {
    const ideologyGroups = {
      purple: parties.filter(p => ['D66', 'VVD', 'PvdA'].includes(p.id) && (partySeats[p.id] || 0) > 0),
      centre: parties.filter(p => ['CDA', 'ChristenUnie', 'D66', 'VVD'].includes(p.id) && (partySeats[p.id] || 0) > 0),
      right: parties.filter(p => ['VVD', 'PVV', 'FVD', 'JA21', 'BBB'].includes(p.id) && (partySeats[p.id] || 0) > 0),
      left: parties.filter(p => ['PvdA', 'SP', 'GL', 'Volt', 'DENK', 'PvdD'].includes(p.id) && (partySeats[p.id] || 0) > 0)
    };

    return Object.entries(ideologyGroups).map(([ideology, parties]) => ({
      name: ideology,
      parties,
      totalSeats: parties.reduce((sum, p) => sum + (partySeats[p.id] || 0), 0),
      isViable: parties.reduce((sum, p) => sum + (partySeats[p.id] || 0), 0) >= 76
    })).filter(coalition => coalition.parties.length > 0);
  };

  const ideologicalCoalitions = getIdeologicalCoalitions();

  const handleSelectCoalition = (coalitionParties: string[]) => {
    setSelectedParties(coalitionParties);
  };

  const handleExcludeParty = (partyId: string) => {
    if (!excludedParties.includes(partyId)) {
      setExcludedParties([...excludedParties, partyId]);
    }
  };

  const handleRemoveExclusion = (partyId: string) => {
    setExcludedParties(excludedParties.filter(id => id !== partyId));
  };

  const handleIncludeParty = (partyId: string) => {
    // Remove from excluded if it was excluded
    if (excludedParties.includes(partyId)) {
      setExcludedParties(excludedParties.filter(id => id !== partyId));
    }
    // Set to show only coalitions that include this party
    setIncludedParty(partyId);
    
    // Also add this party to the current selection if not already selected
    if (!selectedParties.includes(partyId)) {
      setSelectedParties([...selectedParties, partyId]);
    }
  };

  const availableParties = parties.filter(party => 
    (partySeats[party.id] || 0) > 0 && !excludedParties.includes(party.id)
  );

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-inter font-semibold">{t('suggestions.title')}</CardTitle>
            <p className="text-sm coalition-neutral mt-1">{t('suggestions.subtitle')}</p>
          </div>
          
          {/* Party Include/Exclude Controls */}
          <div className="flex items-center space-x-2">
            <Select onValueChange={handleExcludeParty} value="">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Exclude" />
              </SelectTrigger>
              <SelectContent>
                {availableParties.map((party) => (
                  <SelectItem key={party.id} value={party.id}>
                    {party.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(partyId) => handleIncludeParty(partyId)} value="">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Include" />
              </SelectTrigger>
              <SelectContent>
                {parties.filter(party => (partySeats[party.id] || 0) > 0).map((party) => (
                  <SelectItem key={party.id} value={party.id}>
                    {party.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(excludedParties.length > 0 || includedParty) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {excludedParties.map((partyId) => {
              const party = parties.find(p => p.id === partyId);
              if (!party) return null;
              
              return (
                <Badge 
                  key={partyId} 
                  variant="secondary" 
                  className="inline-flex items-center space-x-1"
                >
                  <span>Excluded: {party.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExclusion(partyId)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
            {includedParty && (
              <Badge 
                variant="default" 
                className="inline-flex items-center space-x-1"
              >
                <span>Including: {parties.find(p => p.id === includedParty)?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIncludedParty(null)}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6">
        {coalitionSuggestions.length > 0 ? (
          <div className="space-y-4">
            {coalitionSuggestions.map((coalition, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium coalition-text">
                        {coalition.parties.map(p => p.name).join(' + ')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm coalition-neutral">
                      <span className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {coalition.totalSeats} seats
                      </span>
                      <span className="flex items-center">
                        <Layers className="mr-1 h-3 w-3" />
                        {coalition.partyCount} parties
                      </span>
                    </div>
                    
                    {/* Party color indicators */}
                    <div className="flex items-center space-x-1">
                      {coalition.parties.map((party) => (
                        <div
                          key={party.id}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: party.color }}
                          title={party.fullName}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Select button on the side for wider screens, underneath for mobile */}
                  <div className="hidden lg:block">
                    <Button
                      size="sm"
                      onClick={() => handleSelectCoalition(coalition.parties.map(p => p.id))}
                      className="coalition-primary"
                    >
                      {t('suggestions.select')}
                    </Button>
                  </div>
                </div>
                
                {/* Mobile select button */}
                <div className="lg:hidden mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleSelectCoalition(coalition.parties.map(p => p.id))}
                    className="coalition-primary w-full"
                  >
                    {t('suggestions.select')}
                  </Button>
                </div>
              </div>
            ))}

            {/* Ideological Coalitions */}
            {ideologicalCoalitions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <h3 className="font-medium mb-4 coalition-text">Ideological Coalitions</h3>
                <div className="space-y-3">
                  {ideologicalCoalitions.map((coalition) => (
                    <div 
                      key={coalition.name}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium coalition-text capitalize">
                              {coalition.name === 'purple' ? 'Purple Coalition' : 
                               coalition.name === 'centre' ? 'Centre Coalition' :
                               coalition.name === 'right' ? 'Right Coalition' :
                               'Left Coalition'}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({coalition.parties.map(p => p.name).join(' + ')})
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm coalition-neutral">
                            <span className="flex items-center">
                              <Users className="mr-1 h-3 w-3" />
                              {coalition.totalSeats} seats
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              coalition.isViable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {coalition.isViable ? 'Majority' : 'Minority'}
                            </span>
                          </div>
                          
                          {/* Party color indicators */}
                          <div className="flex items-center space-x-1">
                            {coalition.parties.map((party) => (
                              <div
                                key={party.id}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: party.color }}
                                title={party.name}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Desktop select button */}
                        <div className="hidden lg:block">
                          <Button
                            size="sm"
                            onClick={() => handleSelectCoalition(coalition.parties.map(p => p.id))}
                            className="coalition-primary"
                          >
                            {t('suggestions.select')}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Mobile select button */}
                      <div className="lg:hidden mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleSelectCoalition(coalition.parties.map(p => p.id))}
                          className="coalition-primary w-full"
                        >
                          {t('suggestions.select')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 coalition-neutral mb-4" />
            <h3 className="text-lg font-medium coalition-text mb-2">
              {t('suggestions.noViable')}
            </h3>
            <p className="coalition-neutral">
              {t('suggestions.noViableDesc')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
