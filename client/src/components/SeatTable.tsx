import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { calculateSeatDifference } from '../lib/coalition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Plus, Minus, RotateCcw } from 'lucide-react';

export default function SeatTable() {
  const { t } = useTranslation();
  const { parties, partySeats, setPartySeats, totalSeats } = useApp();

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

  return (
    <div className="space-y-6">
      {/* Pinned Total Seats Indicator */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-900 dark:text-blue-100">{t('seats.total')}: 150</span>
            <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalSeats}</span>
          </div>
          <div className="mt-2">
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

      {/* Party List */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-lg font-inter font-semibold">{t('seats.title')}</CardTitle>
          <p className="text-sm coalition-neutral mt-1">{t('seats.subtitle')}</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-3">
            {parties.map((party) => {
              const currentSeats = party.currentSeats;
              const predictedSeats = partySeats[party.id] || 0;
              const difference = predictedSeats - currentSeats;
              
              return (
                <div key={party.id} className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {/* Party Name */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: party.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {party.name}
                    </span>
                  </div>
                  
                  {/* Current Seats */}
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Huidig</div>
                    <div className="font-bold text-gray-900 dark:text-gray-100">{currentSeats}</div>
                  </div>
                  
                  {/* Gain/Loss */}
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm text-gray-600 dark:text-gray-400">+/-</div>
                    <div className={`font-bold ${
                      difference > 0 ? 'text-green-600' : 
                      difference < 0 ? 'text-red-600' : 
                      'text-gray-500'
                    }`}>
                      {difference > 0 ? `+${difference}` : difference}
                    </div>
                  </div>
                  
                  {/* Predicted Seats */}
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Voorspelling</div>
                    <div className="font-bold text-blue-600">{predictedSeats}</div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePartySeats(party.id, predictedSeats + 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePartySeats(party.id, predictedSeats - 1)}
                      className="w-8 h-8 p-0"
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
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
