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
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Jouw voorspelling</span>
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Bar Chart */}
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4" style={{ minWidth: `${relevantParties.length * 120}px` }}>
              {relevantParties.map((party) => {
                const currentSeats = party.currentSeats;
                const predictedSeats = partySeats[party.id] || 0;
                const currentHeight = (currentSeats / maxSeats) * 200;
                const predictedHeight = (predictedSeats / maxSeats) * 200;
                
                return (
                  <div key={party.id} className="flex flex-col items-center w-28">
                    {/* Bars container */}
                    <div className="flex items-end gap-2 h-52 mb-2">
                      {/* Current seats bar */}
                      <div className="flex flex-col items-center">
                        <div
                          className="bg-gray-500 w-8 flex items-end justify-center pb-1 rounded-t"
                          style={{ height: `${Math.max(currentHeight, 20)}px` }}
                        >
                          <span className="text-white text-xs font-bold">
                            {currentSeats}
                          </span>
                        </div>
                      </div>
                      
                      {/* Predicted seats bar */}
                      <div className="flex flex-col items-center">
                        <div
                          className="bg-green-500 w-12 flex items-end justify-center pb-1 rounded-t"
                          style={{ height: `${Math.max(predictedHeight, predictedSeats > 0 ? 20 : 0)}px` }}
                        >
                          {predictedSeats > 0 && (
                            <span className="text-white text-xs font-bold">
                              {predictedSeats}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Party name */}
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100 uppercase text-center leading-tight">
                      {party.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      </CardContent>
    </Card>
  );
}