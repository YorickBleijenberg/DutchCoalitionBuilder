import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { calculateSeatDifference } from '../lib/coalition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { useCallback } from 'react';
import SeatCounter from './common/SeatCounter';
import { SEAT_CONSTANTS } from '../lib/constants';
import { formatSeatChange, getSeatChangeColor } from '../lib/formatters';

export default function SeatTable() {
  const { t } = useTranslation();
  const { parties, partySeats, setPartySeats, totalSeats, loadPollData, selectedParties } = useApp();

  const seatStatus = calculateSeatDifference(totalSeats);

  const updatePartySeats = useCallback((partyId: string, newSeats: number) => {
    const clampedSeats = Math.max(SEAT_CONSTANTS.MIN_SEATS, Math.min(SEAT_CONSTANTS.MAX_SEATS, newSeats));
    setPartySeats({
      ...partySeats,
      [partyId]: clampedSeats
    });
  }, [partySeats, setPartySeats]);

  const resetPartySeats = (partyId: string) => {
    const party = parties.find(p => p.id === partyId);
    if (party) {
      setPartySeats({
        ...partySeats,
        [partyId]: party.currentSeats
      });
    }
  };

  const handleIncrement = useCallback((partyId: string, direction: 'up' | 'down') => {
    const currentSeats = partySeats[partyId] || 0;
    const newSeats = direction === 'up' ? currentSeats + 1 : currentSeats - 1;
    updatePartySeats(partyId, newSeats);
  }, [partySeats, updatePartySeats]);

  return (
    <div className="space-y-2">
      {/* Sticky Header with Progress Bar */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pb-2">
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('seats.total')}
              </h3>
              <Badge
                variant={
                  seatStatus.type === 'complete' ? 'default' :
                  seatStatus.type === 'unassigned' ? 'secondary' :
                  'destructive'
                }
                className="flex items-center space-x-1"
              >
                {seatStatus.type === 'complete' && <CheckCircle className="w-3 h-3" />}
                {seatStatus.type === 'overassigned' && <AlertTriangle className="w-3 h-3" />}
                <span>
                  {seatStatus.type === 'complete' && t('seats.complete')}
                  {seatStatus.type === 'unassigned' && `${seatStatus.difference} ${t('seats.unassigned')}`}
                  {seatStatus.type === 'overassigned' && `${seatStatus.difference} ${t('seats.overassigned')}`}
                </span>
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <div className="absolute inset-0 flex">
                {parties
                  .filter(party => (partySeats[party.id] || 0) > 0)
                  .sort((a, b) => (partySeats[b.id] || 0) - (partySeats[a.id] || 0))
                  .map((party) => {
                    const seats = partySeats[party.id] || 0;
                    const widthPercent = (seats / SEAT_CONSTANTS.TOTAL_SEATS) * 100;
                    
                    return (
                      <div
                        key={party.id}
                        className="h-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: party.color,
                          width: `${widthPercent}%`,
                          opacity: totalSeats > SEAT_CONSTANTS.TOTAL_SEATS ? 0.7 : 0.9
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
              
              {/* Red overlay when over limit */}
              {totalSeats > SEAT_CONSTANTS.TOTAL_SEATS && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
                  <span className="text-sm font-bold text-red-800 drop-shadow-md">
                    OVER LIMIT: {totalSeats}/{SEAT_CONSTANTS.TOTAL_SEATS}
                  </span>
                </div>
              )}
              
              {/* Center text when no parties or under limit */}
              {(totalSeats === 0 || (totalSeats <= SEAT_CONSTANTS.TOTAL_SEATS && parties.filter(party => (partySeats[party.id] || 0) > 0).length === 0)) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {totalSeats}/{SEAT_CONSTANTS.TOTAL_SEATS} seats
                  </span>
                </div>
              )}
            </div>
            

          </CardContent>
        </Card>
      </div>


      {/* Party List */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="text-lg font-inter font-semibold">{t('seats.title')}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadPollData('current')}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 hover:border-blue-400 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-800 dark:hover:border-blue-600"
              >
                TK2023
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadPollData('peilingwijzer')}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-800 border-green-300 hover:border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-700 dark:hover:bg-green-800 dark:hover:border-green-600"
              >
                Peilingwijzer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadPollData('peil')}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300 hover:border-purple-400 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700 dark:hover:bg-purple-800 dark:hover:border-purple-600"
              >
                Peil.nl
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadPollData('1v')}
                className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300 hover:border-orange-400 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700 dark:hover:bg-orange-800 dark:hover:border-orange-600"
              >
                1V
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPartySeats({});
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 hover:border-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-500"
              >
                Reset
              </Button>
            </div>
          </div> 
        </CardHeader>

        {/* Party List Zetel Voorspellingen*/}
        <CardContent className="p-0">
          <div className="space-y-0">
            {parties.map((party) => {
              const currentSeats = party.currentSeats;
              const predictedSeats = partySeats[party.id] || 0;
              const difference = predictedSeats - currentSeats;

              return (
                <div key={party.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750">
                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-3">
                    {/* First Row: Party Name with Current and Difference */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: party.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {party.name}
                        </span>
                      </div>
                    </div>
                    
                    {/* Second Row: Input Stepper */}
                    <div className="flex items-center justify-center space-x-3">
                      <SeatCounter
                        value={partySeats[party.id] || 0}
                        onIncrement={() => handleIncrement(party.id, 'up')}
                        onDecrement={() => handleIncrement(party.id, 'down')}
                        onChange={(value) => updatePartySeats(party.id, value)}
                        min={SEAT_CONSTANTS.MIN_SEATS}
                        max={SEAT_CONSTANTS.MAX_SEATS}
                      />
                      
                      
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:items-center gap-3">
                    {/* Party Name */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: party.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {party.name}
                      </span>
                    </div>
                    
                    {/* Numbers and Controls */}
                    <div className="flex justify-end gap-6">
                      {/* Current Seats */}
                      
                      
                      <SeatCounter
                        value={partySeats[party.id] || 0}
                        onIncrement={() => handleIncrement(party.id, 'up')}
                        onDecrement={() => handleIncrement(party.id, 'down')}
                        onChange={(value) => updatePartySeats(party.id, value)}
                        min={SEAT_CONSTANTS.MIN_SEATS}
                        max={SEAT_CONSTANTS.MAX_SEATS}
                      />
                      
                      
                    </div>
                    
                  </div>

                  
                  <div className="flex items-left justify-left gap-2 text-xs">
                    <span className="dutch-neutral">
                      Huidig: {party.currentSeats}  | Verschil: {party.pollingSeats} 
                    </span>
                    
                    <span className={`font-bold ${getSeatChangeColor(difference)}`}>
                      {formatSeatChange(difference)}
                    </span>
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