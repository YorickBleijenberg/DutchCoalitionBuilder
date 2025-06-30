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
    // Ultra-compact version
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Ultra-compact header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Zetelverdeling
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Nu</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Voorsp.</span>
              </div>
            </div>
          </div>

          {/* Ultra-compact chart */}
          <div className="overflow-x-auto">
            <div className="flex gap-1 pb-1" style={{ minWidth: `${relevantParties.length * 50}px` }}>
              {relevantParties.map((party) => {
                const currentSeats = party.currentSeats;
                const predictedSeats = partySeats[party.id] || 0;
                const currentHeight = (currentSeats / maxSeats) * 140;
                const predictedHeight = (predictedSeats / maxSeats) * 140;

                return (
                  <div key={party.id} className="flex flex-col items-center w-14">
                    <div className="flex items-end gap-0.5 h-36 mb-1">
                      <div
                        className="bg-gray-500 w-4 flex items-end justify-center text-white text-xs font-bold rounded-t"
                        style={{ height: `${Math.max(currentHeight, 16)}px` }}
                      >
                        {currentSeats}
                      </div>
                      <div
                        className="bg-green-500 w-5 flex items-end justify-center text-white text-xs font-bold rounded-t"
                        style={{ height: `${Math.max(predictedHeight, predictedSeats > 0 ? 16 : 0)}px` }}
                      >
                        {predictedSeats || ''}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100 text-center leading-tight">
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