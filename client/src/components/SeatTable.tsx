import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { calculateSeatDifference } from '../lib/coalition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Plus, Minus, RotateCcw } from 'lucide-react';
import { useRef, useCallback } from 'react';

export default function SeatTable() {
  const { t } = useTranslation();
  const { parties, partySeats, setPartySeats, totalSeats, loadPollData } = useApp();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const seatStatus = calculateSeatDifference(totalSeats);

  const updatePartySeats = (partyId: string, newSeats: number) => {
    const clampedSeats = Math.max(0, Math.min(150, newSeats));
    setPartySeats({
      ...partySeats,
      [partyId]: clampedSeats
    });
  };

  const resetPartySeats = (partyId: string) => {
    const party = parties.find(p => p.id === partyId);
    if (party) {
      setPartySeats({
        ...partySeats,
        [partyId]: party.currentSeats
      });
    }
  };

  const startIncrement = useCallback((partyId: string, direction: 'up' | 'down') => {
    const increment = () => {
      const currentSeats = partySeats[partyId] || 0;
      const newSeats = direction === 'up' ? currentSeats + 1 : currentSeats - 1;
      updatePartySeats(partyId, newSeats);
    };
    
    increment(); // Initial increment
    intervalRef.current = setInterval(increment, 150); // Continue incrementing every 150ms
  }, [partySeats]);

  const stopIncrement = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Sticky Header with Progress Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-2">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-blue-900 dark:text-blue-100">{t('seats.total')}: 150</span>
              <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalSeats}</span>
            </div>
            
            {/* Progress Bar with Party Segments */}
            <div className={`relative w-full bg-blue-200 dark:bg-blue-800 rounded-full h-8 overflow-hidden mb-2 border-2 transition-colors ${
              seatStatus.isComplete ? 'border-green-500' : 'border-transparent'
            }`}>
              {/* Party segments */}
              <div className="absolute inset-0 flex">
                {parties
                  .filter(party => (partySeats[party.id] || 0) > 0)
                  .sort((a, b) => (partySeats[b.id] || 0) - (partySeats[a.id] || 0))
                  .map((party) => {
                    const seats = partySeats[party.id] || 0;
                    const widthPercent = (seats / 150) * 100;
                    return (
                      <div
                        key={party.id}
                        className="h-full border-r border-white dark:border-gray-800 flex items-center justify-center relative"
                        style={{
                          backgroundColor: party.color,
                          width: `${widthPercent}%`,
                          opacity: totalSeats > 150 ? 0.7 : 0.9
                        }}
                        title={`${party.name}: ${seats} seats`}
                      >
                        {widthPercent > 8 && (
                          <div className="text-white text-xs font-bold text-center px-1">
                            <div className="leading-tight truncate">{party.name}</div>
                            <div className="text-xs">{seats}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              
              {/* Red overlay when over 150 seats */}
              {totalSeats > 150 && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
                  <span className="text-sm font-bold text-red-800 drop-shadow-md">
                    OVER LIMIT: {totalSeats}/150
                  </span>
                </div>
              )}
              
              {/* Center text when no parties or under limit */}
              {(totalSeats === 0 || (totalSeats <= 150 && parties.filter(party => (partySeats[party.id] || 0) > 0).length === 0)) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {totalSeats}/150 seats
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <Badge 
                variant={seatStatus.isComplete ? "default" : seatStatus.isUnder ? "secondary" : "destructive"}
                className="inline-flex items-center"
              >
                {seatStatus.isComplete ? (
                  <CheckCircle className="mr-1 h-3 w-3" />
                ) : (
                  <AlertTriangle className="mr-1 h-3 w-3" />
                )}
                {t(`seats.${seatStatus.isComplete ? 'complete' : seatStatus.isUnder ? 'unassigned' : 'overassigned'}`)} {seatStatus.isComplete ? '' : Math.abs(seatStatus.difference)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Poll Data Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadPollData('current')}
          className="text-xs"
        >
          Current Seats
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadPollData('peilingwijzer')}
          className="text-xs"
        >
          Poll Peilingwijzer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadPollData('peil')}
          className="text-xs"
        >
          Poll Peil.nl
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPartySeats({})}
          className="text-xs text-red-600 hover:text-red-700"
        >
          <RotateCcw className="mr-1 h-3 w-3" />
          Blank/Reset
        </Button>
      </div>

      {/* Party List */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-lg font-inter font-semibold">{t('seats.title')}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {parties.map((party) => {
              const currentSeats = party.currentSeats;
              const predictedSeats = partySeats[party.id] || 0;
              const difference = predictedSeats - currentSeats;
              
              return (
                <div key={party.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  {/* Mobile-first responsive layout */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Party Name - Full width on mobile */}
                    <div className="flex items-center gap-2 sm:min-w-0 sm:flex-1">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: party.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {party.name}
                      </span>
                    </div>
                    
                    {/* Numbers row - Horizontal on mobile, continues horizontal on desktop */}
                    <div className="flex justify-between sm:justify-end sm:gap-6">
                      {/* Current Seats */}
                      <div className="text-center">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Huidig</div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">{currentSeats}</div>
                      </div>
                      
                      {/* Gain/Loss */}
                      <div className="text-center">
                        <div className="text-xs text-gray-600 dark:text-gray-400">+/-</div>
                        <div className={`font-bold ${
                          difference > 0 ? 'text-green-600' : 
                          difference < 0 ? 'text-red-600' : 
                          'text-gray-500'
                        }`}>
                          {difference > 0 ? `+${difference}` : difference}
                        </div>
                      </div>
                      
                      {/* Predicted Seats */}
                      <div className="text-center">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Voorspelling</div>
                        <div className="font-bold text-blue-600">{predictedSeats}</div>
                      </div>
                    </div>
                    
                    {/* Controls - Center on mobile, right on desktop */}
                    <div className="flex items-center justify-center sm:justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onMouseDown={() => startIncrement(party.id, 'up')}
                        onMouseUp={stopIncrement}
                        onMouseLeave={stopIncrement}
                        onTouchStart={() => startIncrement(party.id, 'up')}
                        onTouchEnd={stopIncrement}
                        className="w-8 h-8 p-0 select-none"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onMouseDown={() => startIncrement(party.id, 'down')}
                        onMouseUp={stopIncrement}
                        onMouseLeave={stopIncrement}
                        onTouchStart={() => startIncrement(party.id, 'down')}
                        onTouchEnd={stopIncrement}
                        className="w-8 h-8 p-0 select-none"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetPartySeats(party.id)}
                        className="w-8 h-8 p-0"
                        title="Reset naar huidige zetels"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
