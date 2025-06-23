import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Users, CheckCircle, AlertTriangle } from 'lucide-react';


export default function CoalitionBuilder() {
  const { t } = useTranslation();
  const { 
    parties, 
    partySeats: seatData, 
    selectedParties, 
    setSelectedParties, 
    coalitionSeats, 
    hasMajority 
  } = useApp();

  const handlePartyToggle = (partyId: string, checked: boolean) => {
    if (checked) {
      setSelectedParties([...selectedParties, partyId]);
    } else {
      setSelectedParties(selectedParties.filter(id => id !== partyId));
    }
  };

  const clearCoalition = () => {
    setSelectedParties([]);
  };

  const selectedPartiesData = parties.filter(party => selectedParties.includes(party.id));
  const availableParties = parties.filter(party => 
    !selectedParties.includes(party.id) && (seatData[party.id] || 0) > 0
  );

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-inter font-semibold">
              {t('coalition.builder')}
            </CardTitle>
            <p className="text-sm coalition-neutral mt-1">
              Select parties to form a coalition
            </p>
          </div>
          {selectedParties.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCoalition}
              className="text-red-600 hover:text-red-700"
            >
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Selected Parties */}
        {selectedParties.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3 coalition-text">Selected Parties</h3>
            <div className="space-y-2">
              {selectedPartiesData.map((party) => (
                <div 
                  key={party.id}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-600/30"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: party.color }}
                    />
                    <div>
                      <div className="font-medium text-sm">{party.name}</div>
                      <div className="text-xs coalition-neutral">
                        {seatData[party.id] || 0} seats
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePartyToggle(party.id, false)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Parties */}
        {availableParties.length > 0 && (
          <div>
            <h3 className="font-medium mb-3 coalition-text">Available Parties</h3>
            <div className="space-y-2">
              {availableParties.map((party) => (
                <div 
                  key={party.id} 
                  onClick={() => handlePartyToggle(party.id, true)}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                    <div>
                      <div className="font-medium text-sm">{party.name}</div>
                      <div className="text-xs coalition-neutral">
                        {seatData[party.id] || 0} seats
                      </div>
                    </div>
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Click to add
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {availableParties.length === 0 && selectedParties.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 coalition-neutral mb-4" />
            <h3 className="text-lg font-medium coalition-text mb-2">
              No Parties Available
            </h3>
            <p className="coalition-neutral">
              Assign seats to parties to start building coalitions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
