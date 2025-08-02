import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useStemming } from '../context/StemmingContext';

export default function StemmingBuilder() {
  const { parties, selectedParties, toggleParty } = useStemming();

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecteer Partijen
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* All Parties - 4 Columns Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {parties
            .sort((a, b) => b.currentSeats - a.currentSeats)
            .map((party) => {
            const isSelected = selectedParties.includes(party.id);
            return (
              <div 
                key={party.id} 
                onClick={() => toggleParty(party.id)}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                  isSelected 
                    ? 'text-white bg-green-500 bg-opacity-80 dark:bg-green-900 dark:bg-opacity-30 border-2 border-green-500 border-opacity-90 dark:border-green-400 dark:border-opacity-50' 
                    : 'dark:text-black border border-gray-200 border-opacity-80 dark:border-gray-600 dark:border-opacity-80 hover:bg-gray-50 hover:bg-opacity-80 dark:hover:bg-gray-700 dark:hover:bg-opacity-90'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                  <div>
                    <div className="font-medium text-sm">
                      {party.name} ({party.currentSeats}) ({party.currentSeatsEK})
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
