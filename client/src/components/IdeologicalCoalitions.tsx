import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function IdeologicalCoalitions() {
  const { t } = useTranslation();
  const { 
    parties, 
    partySeats,
    setSelectedParties 
  } = useApp();

  // Define ideological coalitions - always show all coalitions
  const getIdeologicalCoalitions = () => {
    const ideologyGroups = {
      purple: parties.filter(p => ['d66', 'vvd', 'gl-pvda'].includes(p.id)),
      centre: parties.filter(p => ['cda', 'cu', 'd66', 'vvd', 'nsc'].includes(p.id)),
      right: parties.filter(p => ['vvd', 'pvv', 'fvd', 'ja21', 'bbb'].includes(p.id)),
      left: parties.filter(p => ['gl-pvda', 'sp', 'volt', 'denk', 'pvdd'].includes(p.id))
    };

    return Object.entries(ideologyGroups).map(([ideology, coalitionParties]) => ({
      name: ideology,
      parties: coalitionParties,
      totalSeats: coalitionParties.reduce((sum, p) => sum + (partySeats[p.id] || 0), 0),
      isViable: coalitionParties.reduce((sum, p) => sum + (partySeats[p.id] || 0), 0) >= 76
    }));
  };

  const ideologicalCoalitions = getIdeologicalCoalitions();

  const handleSelectCoalition = (coalitionParties: string[]) => {
    // Filter only parties that have seats > 0
    const validParties = coalitionParties.filter(partyId => (partySeats[partyId] || 0) > 0);
    setSelectedParties(validParties);
  };

  // Always show the component, even if no coalitions are viable

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <CardTitle className="text-lg font-inter font-semibold">
          Ideological Coalitions
        </CardTitle>
        <p className="text-sm coalition-neutral mt-1">
          Traditional political alignment options
        </p>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ideologicalCoalitions.map((coalition) => (
            <div 
              key={coalition.name}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium coalition-text text-sm capitalize">
                    {coalition.name === 'purple' ? 'Purple' : 
                     coalition.name === 'centre' ? 'Centre' :
                     coalition.name === 'right' ? 'Right' :
                     'Left'}
                  </h4>
                  <span className={`text-xs px-1 py-0.5 rounded ${
                    coalition.isViable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {coalition.totalSeats}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    {coalition.parties.map((party) => (
                      <div
                        key={party.id}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: party.color }}
                        title={party.name}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${coalition.isViable ? 'text-green-600' : 'text-red-600'}`}>
                    {coalition.isViable ? 'Viable' : 'Minority'}
                  </span>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleSelectCoalition(coalition.parties.map(p => p.id))}
                  className="coalition-primary w-full text-xs h-7"
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}