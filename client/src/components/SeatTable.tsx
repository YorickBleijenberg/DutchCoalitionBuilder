import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { calculateSeatDifference } from '../lib/coalition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import PartyRow from './PartyRow';

export default function SeatTable() {
  const { t } = useTranslation();
  const { parties, totalSeats } = useApp();

  const seatStatus = calculateSeatDifference(totalSeats);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <CardTitle className="text-lg font-inter font-semibold">{t('seats.title')}</CardTitle>
        <p className="text-sm coalition-neutral mt-1">{t('seats.subtitle')}</p>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Total Seats Indicator */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('seats.total')}: 150</span>
            <span className="text-xl font-bold">{totalSeats}</span>
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
        </div>
        
        {/* Party List */}
        <div className="space-y-3">
          {parties.map((party) => (
            <PartyRow key={party.id} party={party} mode="prediction" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
