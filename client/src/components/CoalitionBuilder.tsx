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

          </div>
          
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* All Parties - Mobile: 2 Columns, Desktop: 3 Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {parties.filter(party => (seatData[party.id] || 0) > 0).map((party) => {
            const isSelected = selectedParties.includes(party.id);
            return (
              <div 
                key={party.id} 
                onClick={() => handlePartyToggle(party.id, !isSelected)}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-400' 
                    : 'border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
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
                {isSelected && (
                  <CheckCircle className="hidden md:block h-4 w-4 text-green-600 dark:text-green-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {parties.filter(party => (seatData[party.id] || 0) > 0).length === 0 && (
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
