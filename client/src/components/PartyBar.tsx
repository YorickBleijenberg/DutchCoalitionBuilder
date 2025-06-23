import { useApp } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';

export default function PartyBar() {
  const { parties, partySeats, totalSeats } = useApp();
  const { t } = useTranslation();

  // Sort parties by predicted seats (descending)
  const sortedParties = parties
    .map(party => ({
      ...party,
      predictedSeats: partySeats[party.id] || 0
    }))
    .filter(party => party.predictedSeats > 0)
    .sort((a, b) => b.predictedSeats - a.predictedSeats);

  const majoritySeats = 76;
  const hasMajority = totalSeats >= majoritySeats;

  return (
    <div className="space-y-4">
      {/* Header with totals */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium text-lg text-gray-900 dark:text-gray-100">
          {t('currentPrediction')}
        </span>
        <div className="flex items-center gap-4">
          <span>
            {t('totalSeats')}: <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{totalSeats}</span>
          </span>
          <span className="text-gray-400">|</span>
          <span>
            {t('majority')}: <span className={`font-bold text-lg ${hasMajority ? 'text-green-600' : 'text-red-600'}`}>{majoritySeats}</span>
          </span>
        </div>
      </div>

      {/* Party bar visualization */}
      <div className="space-y-3">
        {/* Bar container */}
        <div className="relative h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {sortedParties.map((party, index) => {
            const widthPercentage = (party.predictedSeats / 150) * 100;
            const leftOffset = sortedParties
              .slice(0, index)
              .reduce((sum, p) => sum + ((p.predictedSeats / 150) * 100), 0);

            return (
              <div
                key={party.id}
                className="absolute top-0 h-full flex items-center justify-center text-white text-sm font-medium"
                style={{
                  backgroundColor: party.color,
                  width: `${widthPercentage}%`,
                  left: `${leftOffset}%`
                }}
              >
                {party.predictedSeats >= 5 && (
                  <span className="text-xs font-bold">
                    {party.name} {party.predictedSeats}
                  </span>
                )}
              </div>
            );
          })}
          
          {/* Majority line */}
          <div 
            className="absolute top-0 h-full w-0.5 bg-black dark:bg-white z-10"
            style={{ left: `${(majoritySeats / 150) * 100}%` }}
          />
        </div>

        {/* Scale markers */}
        <div className="relative h-4">
          <div className="absolute left-0 text-xs text-gray-500">0</div>
          <div 
            className="absolute text-xs text-gray-700 dark:text-gray-300 font-medium"
            style={{ left: `${(majoritySeats / 150) * 100}%`, transform: 'translateX(-50%)' }}
          >
            {majoritySeats}
          </div>
          <div className="absolute right-0 text-xs text-gray-500">150</div>
        </div>

        {/* Party legend */}
        <div className="flex flex-wrap gap-2 mt-3">
          {sortedParties.map(party => (
            <div key={party.id} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: party.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {party.name} ({party.predictedSeats})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}