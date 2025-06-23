import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { calculateStabilityScore, getTopStableCoalitions } from '../lib/stabilityScoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users,
  Target,
  Award
} from 'lucide-react';

export default function StabilityAnalysis() {
  const { t } = useTranslation();
  const { 
    parties, 
    partySeats, 
    selectedParties, 
    setSelectedParties,
    excludedParties 
  } = useApp();

  const selectedPartiesData = parties.filter(party => selectedParties.includes(party.id));
  const currentStability = selectedParties.length >= 2 
    ? calculateStabilityScore(selectedPartiesData, partySeats)
    : null;

  const topStableCoalitions = getTopStableCoalitions(parties, partySeats, 76, excludedParties);

  const getStabilityColor = (score: number) => {
    if (score >= 75) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStabilityVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 75) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  const getDurationIcon = (duration: string) => {
    switch (duration) {
      case 'Long-term': return <Shield className="h-4 w-4 text-green-600" />;
      case 'Medium-term': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <CardTitle className="text-lg font-inter font-semibold flex items-center">
          <Award className="mr-2 h-5 w-5" />
          Stability Analysis
        </CardTitle>
        <p className="text-sm coalition-neutral mt-1">
          Advanced coalition stability scoring and predictions
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Coalition</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-6">
            {currentStability ? (
              <div className="space-y-6">
                {/* Overall Stability Score */}
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getStabilityColor(currentStability.stability.overall)}`}>
                    {currentStability.stability.overall}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Overall Stability Score
                  </p>
                  <div className="flex items-center justify-center mt-2">
                    {getDurationIcon(currentStability.duration)}
                    <span className="ml-2 text-sm font-medium">
                      {currentStability.duration} Coalition
                    </span>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ideological Alignment</span>
                        <span>{currentStability.stability.ideological}%</span>
                      </div>
                      <Progress value={currentStability.stability.ideological} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Size Balance</span>
                        <span>{currentStability.stability.size}%</span>
                      </div>
                      <Progress value={currentStability.stability.size} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Leadership Experience</span>
                        <span>{currentStability.stability.experience}%</span>
                      </div>
                      <Progress value={currentStability.stability.experience} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Historical Precedent</span>
                        <span>{currentStability.stability.historical}%</span>
                      </div>
                      <Progress value={currentStability.stability.historical} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Confidence Level */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Analysis Confidence</span>
                    <Badge variant="outline">{currentStability.confidence}%</Badge>
                  </div>
                </div>

                {/* Strengths */}
                {currentStability.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 flex items-center">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {currentStability.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risks */}
                {currentStability.risks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 flex items-center">
                      <TrendingDown className="mr-1 h-4 w-4" />
                      Risk Factors
                    </h4>
                    <ul className="space-y-1">
                      {currentStability.risks.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Coalition Selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select at least 2 parties to analyze coalition stability
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            {topStableCoalitions.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Most stable coalition combinations based on advanced scoring algorithms:
                </div>
                
                {topStableCoalitions.slice(0, 5).map((coalition, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {coalition.parties.map(p => p.name).join(' + ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {coalition.totalSeats} seats
                          </span>
                          <span className="flex items-center">
                            {getDurationIcon(coalition.duration)}
                            <span className="ml-1">{coalition.duration}</span>
                          </span>
                          <Badge 
                            variant={getStabilityVariant(coalition.stability.overall)}
                            className="text-xs"
                          >
                            {coalition.stability.overall}% stable
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedParties(coalition.parties.map(p => p.id))}
                        className="ml-4"
                      >
                        Select
                      </Button>
                    </div>
                    
                    {/* Party color indicators */}
                    <div className="flex items-center space-x-1">
                      {coalition.parties.map((party) => (
                        <div
                          key={party.id}
                          className="w-3 h-3 rounded-full border border-white dark:border-gray-800"
                          style={{ backgroundColor: party.color }}
                          title={`${party.name}: ${partySeats[party.id] || 0} seats`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Stable Coalitions Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting seat predictions or removing party exclusions
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}