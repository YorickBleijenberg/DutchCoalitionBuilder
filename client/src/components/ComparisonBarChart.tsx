import { useApp } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

export default function ComparisonBarChart() {
  const { parties, partySeats } = useApp();
  const { t } = useTranslation();

  // Filter parties that have either current seats or predicted seats
  const relevantParties = parties
    .filter(party => party.currentSeats > 0 || (partySeats[party.id] || 0) > 0)
    .sort((a, b) => {
      const aPredicted = partySeats[a.id] || 0;
      const bPredicted = partySeats[b.id] || 0;
      return Math.max(b.currentSeats, bPredicted) - Math.max(a.currentSeats, aPredicted);
    });

  const maxSeats = Math.max(
    ...relevantParties.map(party => Math.max(party.currentSeats, partySeats[party.id] || 0)),
    40
  );

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Zetelverdeling Tweede Kamer
            </h3>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Huidige zetels (2023)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Voorspelling</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="space-y-4">
            {relevantParties.map((party) => {
              const currentSeats = party.currentSeats;
              const predictedSeats = partySeats[party.id] || 0;
              const currentWidth = (currentSeats / maxSeats) * 100;
              const predictedWidth = (predictedSeats / maxSeats) * 100;
              
              return (
                <div key={party.id} className="space-y-1">
                  {/* Party name */}
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase">
                    {party.name}
                  </div>
                  
                  {/* Bars container */}
                  <div className="relative h-16 space-y-1">
                    {/* Current seats bar */}
                    <div className="relative h-7">
                      <div
                        className="h-full bg-gray-500 flex items-center justify-end pr-2 rounded-sm"
                        style={{ width: `${Math.max(currentWidth, 8)}%` }}
                      >
                        <span className="text-white text-xs font-bold">
                          {currentSeats}
                        </span>
                      </div>
                    </div>
                    
                    {/* Predicted seats bar */}
                    <div className="relative h-7">
                      <div
                        className="h-full bg-red-500 flex items-center justify-end pr-2 rounded-sm"
                        style={{ width: `${Math.max(predictedWidth, predictedSeats > 0 ? 8 : 0)}%` }}
                      >
                        {predictedSeats > 0 && (
                          <span className="text-white text-xs font-bold">
                            {predictedSeats}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {parties.reduce((sum, party) => sum + party.currentSeats, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Huidige zetels
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {parties.reduce((sum, party) => sum + (partySeats[party.id] || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Voorspelde zetels
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}