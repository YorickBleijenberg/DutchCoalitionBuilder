import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { getTopCoalitions } from '../lib/coalition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Users, Layers, CheckCircle, AlertCircle } from 'lucide-react';

export default function CoalitionSuggestions() {
  const { t } = useTranslation();
  const { 
    parties, 
    partySeats, 
    ideologyFilter, 
    setIdeologyFilter, 
    setSelectedParties 
  } = useApp();

  const coalitionSuggestions = getTopCoalitions(parties, partySeats, 76, ideologyFilter);

  const handleSelectCoalition = (coalitionParties: string[]) => {
    setSelectedParties(coalitionParties);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-inter font-semibold">{t('suggestions.title')}</CardTitle>
            <p className="text-sm coalition-neutral mt-1">{t('suggestions.subtitle')}</p>
          </div>
          
          {/* Ideology Filter Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={ideologyFilter}
              onCheckedChange={setIdeologyFilter}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-sm font-medium">{t('suggestions.ideologyLock')}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {coalitionSuggestions.length > 0 ? (
          <div className="space-y-4">
            {coalitionSuggestions.map((coalition, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 coalition-primary text-white text-xs font-bold rounded-full">
                        {index + 1}
                      </span>
                      <span className="font-medium coalition-text">
                        {coalition.parties.map(p => p.name).join(' + ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm coalition-neutral">
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
                    <div className="flex items-center space-x-1 mt-2">
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
                  
                  <Button
                    size="sm"
                    onClick={() => handleSelectCoalition(coalition.parties.map(p => p.id))}
                    className="coalition-primary"
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
