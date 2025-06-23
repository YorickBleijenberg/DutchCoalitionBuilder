import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { calculateSeatDifference } from '../lib/coalition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import PartyRow from './PartyRow';

export default function SeatTable() {
  const { t } = useTranslation();
  const { parties, totalSeats, coalitionSeats, hasMajority } = useApp();

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
            <span className="font-medium">{t('seats.total')}</span>
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
              {seatStatus.message}
            </Badge>
          </div>
        </div>
        
        {/* Party List */}
        <div className="space-y-3">
          {parties.map((party) => (
            <PartyRow key={party.id} party={party} />
          ))}
        </div>
        
        {/* Coalition Summary */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-600/30">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('coalition.selected')}</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{coalitionSeats}</span>
          </div>
          <div className="mt-2">
            <Badge 
              variant={hasMajority ? "default" : "destructive"}
              className="inline-flex items-center"
            >
              {hasMajority ? (
                <CheckCircle className="mr-1 h-3 w-3" />
              ) : (
                <AlertTriangle className="mr-1 h-3 w-3" />
              )}
              {hasMajority ? t('coalition.majority') : t('coalition.noMajority')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
