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
    setSelectedParties 
  } = useApp();

  const coalitionSuggestions = getTopCoalitions(parties, partySeats, 76, false, excludedParties);

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
          
          {/* Party Exclusion Dropdown */}
          <div className="flex items-center space-x-2">
            <Select onValueChange={handleExcludeParty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Exclude party from suggestions" />
              </SelectTrigger>
              <SelectContent>
                {availableParties.map((party) => (
                  <SelectItem key={party.id} value={party.id}>
                    {party.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Excluded Parties Display */}
        {excludedParties.length > 0 && (
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
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 coalition-primary text-white text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <span className="font-medium coalition-text flex-1">
                      {coalition.parties.map(p => p.name).join(' + ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm coalition-neutral">
                    <span className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {coalition.totalSeats} seats
                    </span>
                    <span className="flex items-center">
                      <Layers className="mr-1 h-3 w-3" />
                      {coalition.partyCount} parties
                    </span>
                    <Badge 
                      variant={coalition.isViable ? "default" : "destructive"}
                      className="inline-flex items-center"
                    >
                      {coalition.isViable ? (
                        <CheckCircle className="mr-1 h-2 w-2" />
                      ) : (
                        <AlertCircle className="mr-1 h-2 w-2" />
                      )}
                      {coalition.isViable ? 'Majority' : 'No Majority'}
                    </Badge>
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
                  
                  {/* Select button underneath for mobile */}
                  <Button
                    size="sm"
                    onClick={() => handleSelectCoalition(coalition.parties.map(p => p.id))}
                    className="coalition-primary w-full sm:w-auto"
                  >
                    {t('suggestions.select')}
                  </Button>
                </div>
              </div>
            ))}
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
