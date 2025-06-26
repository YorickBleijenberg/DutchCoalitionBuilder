import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, AlertTriangle } from 'lucide-react';
import { getDifficultyColor } from '../lib/coalitionUtils';

interface HistoricalCoalition {
  year: number;
  parties: string[];
  formationDays: number;
  duration: number; // in years
  reason: string;
  difficulty: 'easy' | 'moderate' | 'difficult';
}

const historicalData: HistoricalCoalition[] = [
  {
    year: 2021,
    parties: ['vvd', 'cda', 'd66', 'cu'],
    formationDays: 271,
    duration: 2.5,
    reason: 'Complex negotiations over climate and migration policies',
    difficulty: 'difficult'
  },
  {
    year: 2017,
    parties: ['vvd', 'cda', 'd66', 'cu'],
    formationDays: 225,
    duration: 4,
    reason: 'Initial attempts with GL failed, required new approach',
    difficulty: 'difficult'
  },
  {
    year: 2012,
    parties: ['vvd', 'pvda'],
    formationDays: 54,
    duration: 5,
    reason: 'Clear ideological compromise between center-right and center-left',
    difficulty: 'moderate'
  },
  {
    year: 2010,
    parties: ['vvd', 'cda'],
    formationDays: 127,
    duration: 2,
    reason: 'Minority government with PVV support, unstable arrangement',
    difficulty: 'moderate'
  },
  {
    year: 2007,
    parties: ['cda', 'pvda', 'cu'],
    formationDays: 121,
    duration: 3,
    reason: 'Balkenende IV cabinet with progressive coalition',
    difficulty: 'moderate'
  },
  {
    year: 2003,
    parties: ['cda', 'vvd', 'd66'],
    formationDays: 88,
    duration: 4,
    reason: 'Traditional center-right coalition',
    difficulty: 'easy'
  }
];

export default function CoalitionTimeline() {
  const { parties, selectedParties, partySeats } = useApp();
  const [expandedReason, setExpandedReason] = useState<number | null>(null);

  const getCurrentCoalitionPrediction = () => {
    if (selectedParties.length === 0) return null;

    const selectedPartyIds = selectedParties.map(id => id.toLowerCase());
    
    // Find similar historical coalitions
    const similarCoalitions = historicalData.filter(coalition => {
      const coalitionParties = coalition.parties.map(p => p.toLowerCase());
      const intersection = selectedPartyIds.filter(p => coalitionParties.includes(p));
      return intersection.length >= Math.min(2, selectedPartyIds.length);
    });

    if (similarCoalitions.length === 0) {
      // Estimate based on coalition size and ideological spread
      const coalitionSize = selectedParties.length;
      const baseTime = coalitionSize <= 2 ? 60 : coalitionSize === 3 ? 120 : 180;
      
      // Check for ideological diversity
      const selectedPartiesData = parties.filter(p => selectedParties.includes(p.id));
      const ideologies = Array.from(new Set(selectedPartiesData.map(p => p.ideology)));
      const ideologyMultiplier = ideologies.length > 2 ? 1.5 : 1.2;
      
      return {
        estimatedDays: Math.round(baseTime * ideologyMultiplier),
        confidence: 'low',
        factors: [
          `${coalitionSize} parties require complex negotiations`,
          `${ideologies.length} different ideologies to align`,
          'No direct historical precedent'
        ],
        difficulty: coalitionSize > 3 ? 'difficult' : 'moderate'
      };
    }

    // Calculate average from similar coalitions
    const avgDays = Math.round(
      similarCoalitions.reduce((sum, c) => sum + c.formationDays, 0) / similarCoalitions.length
    );

    const mostSimilar = similarCoalitions[0];
    
    return {
      estimatedDays: avgDays,
      confidence: 'high',
      factors: [
        `Based on ${similarCoalitions.length} similar coalition(s)`,
        `Most recent: ${mostSimilar.year} (${mostSimilar.formationDays} days)`,
        `Historical range: ${Math.min(...similarCoalitions.map(c => c.formationDays))}-${Math.max(...similarCoalitions.map(c => c.formationDays))} days`
      ],
      difficulty: mostSimilar.difficulty,
      historicalExample: mostSimilar
    };
  };

  const prediction = getCurrentCoalitionPrediction();

  return (
    <Card className=" flex flex-wrap bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Coalitievorming Tijdlijn
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Historische vormingstijden en huidige coalitievoorspelling
        </p>
      </CardHeader>
      
      <CardContent 
        className="space-y-6"
        onClick={() => setExpandedReason(null)}
      >
        {/* Current Coalition Prediction */}
        {prediction && (
          <div className="flex flex-wrap p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="flex flex-wrap font-semibold text-blue-900 dark:text-blue-100">Huidige Coalitievoorspelling</h4>
              <Badge className={getDifficultyColor(prediction.difficulty)}>
                {prediction.difficulty}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-xl text-blue-900 dark:text-blue-100">
                    {prediction.estimatedDays} days
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Estimated formation time
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-blue-900 dark:text-blue-100">
                    {prediction.confidence} confidence
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Based on historical data
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Key Factors:</h5>
              <ul className="space-y-1">
                {prediction.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            {prediction.historicalExample && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
                <h5 className="font-medium mb-2">Most Similar Historical Coalition:</h5>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>{prediction.historicalExample.year}</strong> - {prediction.historicalExample.formationDays} days
                  <br />
                  {prediction.historicalExample.reason}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Historical Timeline */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Historical Formation Times
          </h4>
          
          <div className="space-y-3">
            {historicalData.map((coalition, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center">
                    <div className="font-bold text-lg">{coalition.year}</div>
                    <div className="text-xs text-gray-500">Year</div>
                  </div>
                  
                  <div className="flex gap-1">
                    {coalition.parties.map(partyId => {
                      const party = parties.find(p => p.id === partyId);
                      return party ? (
                        <div
                          key={partyId}
                          className="w-6 h-6 rounded-full border-2 border-white"
                          style={{ backgroundColor: party.color }}
                          title={party.name}
                        />
                      ) : null;
                    })}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{coalition.formationDays} days</div>
                    <div 
                      className={`text-sm text-gray-600 dark:text-gray-400 cursor-pointer transition-all duration-200 ${
                        expandedReason === index ? '' : 'line-clamp-1'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedReason(expandedReason === index ? null : index);
                      }}
                    >
                      {coalition.reason}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getDifficultyColor(coalition.difficulty)}>
                    {coalition.difficulty}
                  </Badge>
                  <div className="flex flex-wrap text-sm text-gray-500">
                    {coalition.duration}yr
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formation Insights */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Formation Insights</h5>
              <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                <li>• Average formation time: {Math.round(historicalData.reduce((sum, c) => sum + c.formationDays, 0) / historicalData.length)} days</li>
                <li>• Coalitions with 4+ parties typically take 150+ days</li>
                <li>• Ideological diversity significantly increases negotiation time</li>
                <li>• Most complex formation: 2021 (271 days) due to climate policy disagreements</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}