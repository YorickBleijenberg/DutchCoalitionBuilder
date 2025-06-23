import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function CoalitionPredictionBar() {
  const { t } = useTranslation();
  const { 
    parties, 
    partySeats, 
    selectedParties, 
    coalitionSeats, 
    hasMajority 
  } = useApp();

  const selectedPartiesData = parties
    .filter(party => selectedParties.includes(party.id))
    .sort((a, b) => (partySeats[b.id] || 0) - (partySeats[a.id] || 0));

  return (
    <Card className="sticky top-4 z-20 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-gray-900 dark:text-gray-100">Current Prediction</span>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Coalitie zetels: <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{coalitionSeats}</span>
            </div>
            <div className={`text-sm font-medium ${hasMajority ? 'text-green-600' : 'text-red-600'}`}>
              {hasMajority ? 'Meerderheid' : `Nog ${76 - coalitionSeats} zetels nodig`}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
          {/* Majority threshold line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 dark:bg-red-400 z-10"
            style={{ left: '50.67%' }} /* 76/150 = 50.67% */
          />
          
          {/* Coalition seats progress */}
          <div 
            className={`h-full transition-all duration-500 ${
              hasMajority 
                ? 'bg-green-500 dark:bg-green-400' 
                : 'bg-blue-500 dark:bg-blue-400'
            }`}
            style={{ width: `${Math.min((coalitionSeats / 150) * 100, 100)}%` }}
          />
          
          {/* Selected parties color indicators with labels */}
          {selectedParties.length > 0 && (
            <div className="absolute inset-0 flex">
              {selectedPartiesData.map((party) => {
                const seats = partySeats[party.id] || 0;
                const widthPercent = (seats / 150) * 100;
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
                        <div className="leading-tight">{party.name}</div>
                        <div className="text-xs">{seats}</div>
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
                Select parties to start
              </span>
            </div>
          )}
        </div>
        
        {/* Majority threshold indicator */}
        <div className="flex justify-center mt-1">
          <span className="text-xs text-red-600 dark:text-red-400">
            ↑ Majority (76 seats)
          </span>
        </div>

        {/* Majority status indicator */}
        {selectedParties.length > 0 && (
          <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400">
              Meerderheid vereist: 76 zetels
            </span>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasMajority 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {hasMajority ? '✓ Meerderheid' : '✗ Geen meerderheid'}
            </div>
          </div>
        )}
        
        {/* Legend for selected parties */}
        {selectedParties.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Coalition Parties:
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedPartiesData.map((party) => (
                <div key={party.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {party.name}: {partySeats[party.id] || 0} seats
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}