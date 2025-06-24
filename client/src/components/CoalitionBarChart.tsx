import { useApp } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

export default function CoalitionBarChart({ showLegend = true }: { showLegend?: boolean }) {
  const { parties, partySeats, selectedParties, coalitionSeats } = useApp();
  const { t } = useTranslation();

  // Get selected parties with their data
  const coalitionParties = parties
    .filter(party => selectedParties.includes(party.id))
    .map(party => ({
      ...party,
      predictedSeats: partySeats[party.id] || 0
    }))
    .sort((a, b) => b.predictedSeats - a.predictedSeats);

  const maxSeats = Math.max(40, ...coalitionParties.map(p => p.predictedSeats));
  const majoritySeats = 76;
  const hasMajority = coalitionSeats >= majoritySeats;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Zetelverdeling Coalitie
            </h3>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Coalitie zetels: <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{coalitionSeats}</span>
              </div>
              <div className={`text-sm font-medium ${hasMajority ? 'text-green-600' : 'text-red-600'}`}>
                {hasMajority ? 'Meerderheid' : `Nog ${majoritySeats - coalitionSeats} zetels nodig`}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="space-y-4">
            {coalitionParties.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg">Geen coalitie geselecteerd</p>
                <p className="text-sm">Selecteer partijen in de Coalitie Builder om de verdeling te zien</p>
              </div>
            ) : (
              coalitionParties.map((party) => {
                const widthPercentage = (party.predictedSeats / maxSeats) * 100;
                
                return (
                  <div key={party.id} className="space-y-2">
                    {/* Party label and seats */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: party.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {party.name}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {party.predictedSeats}
                      </span>
                    </div>
                    
                    {/* Bar */}
                    <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded">
                      <div
                        className="h-full rounded transition-all duration-500 ease-out flex items-center justify-end pr-2"
                        style={{
                          backgroundColor: party.color,
                          width: `${Math.max(widthPercentage, 8)}%`
                        }}
                      >
                        <span className="text-white text-xs font-bold">
                          {party.predictedSeats}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Legend - conditional */}
          {showLegend && coalitionParties.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
              {coalitionParties.map((party) => (
                <div key={party.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {party.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Majority indicator */}
          {coalitionParties.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Meerderheid vereist: {majoritySeats} zetels
                </span>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  hasMajority 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {hasMajority ? '✓ Meerderheid' : '✗ Geen meerderheid'}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}