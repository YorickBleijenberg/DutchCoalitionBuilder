import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStemming } from '../context/StemmingContext';

export default function StemmingEK() {
  const { 
    parties, 
    selectedParties, 
    selectedEKSeats 
  } = useStemming();

  const selectedPartiesData = parties
    .filter(party => selectedParties.includes(party.id))
    .sort((a, b) => b.currentSeatsEK - a.currentSeatsEK);

  const hasMajority = selectedEKSeats >= 38;

  return (
    <Card className={`mb-6 ${hasMajority ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600'} shadow-md`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Eerste Kamer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-left">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Geselecteerde zetels: <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{selectedEKSeats}</span>
            </div>
          </div>

          {/* Majority Status Badge */}
          <div className="flex flex-1 items-center justify-center">
            <div
              className={`text-sm font-medium px-2 py-1 rounded ${
                hasMajority 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {hasMajority
                ? `Meerderheid (+${selectedEKSeats - 38})`
                : `nog ${38 - selectedEKSeats} zetels nodig`}
            </div>
          </div>
          
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-12 overflow-hidden">
          {/* Majority threshold line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 dark:bg-red-400 z-10"
            style={{ left: '50.67%' }} /* 38/75 = 50.67% */
          />
          
          {/* Coalition seats progress */}
          <div 
            className={`h-full transition-all duration-500 ${
              hasMajority 
                ? 'bg-green-500 dark:bg-green-400' 
                : 'bg-blue-500 dark:bg-blue-400'
            }`}
            style={{ width: `${Math.min((selectedEKSeats / 75) * 100, 100)}%` }}
          />
          
          {/* Selected parties color indicators with labels */}
          {selectedParties.length > 0 && (
            <div className="absolute inset-0 flex">
              {selectedPartiesData.map((party) => {
                const seats = party.currentSeatsEK;
                const widthPercent = (seats / 75) * 100;
                return (
                  <div
                    key={party.id}
                    className="h-full border-r border-white dark:border-gray-800 flex items-center justify-center relative"
                    style={{
                      backgroundColor: party.color,
                      width: `${widthPercent}%`,
                      opacity: 0.9
                    }}
                    title={`${party.name}: ${seats} seats`}
                  >
                    {widthPercent > 8 && (
                      <div className="text-white text-xs font-bold text-center px-1">
                        <div className="leading-tight">{party.name} {seats}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Fallback seat count overlay for empty state */}
          {selectedParties.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Selecteer partijen hieronder
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}