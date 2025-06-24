import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function SwingAnalysis() {
  const { parties, partySeats, setPartySeats } = useApp();
  const [swingParty, setSwingParty] = useState<string | null>(null);
  const [swingAmount, setSwingAmount] = useState([0]);

  const applySwing = () => {
    if (!swingParty) return;
    
    const currentSeats = partySeats[swingParty] || 0;
    const newSeats = Math.max(0, Math.min(150, currentSeats + swingAmount[0]));
    
    setPartySeats({
      ...partySeats,
      [swingParty]: newSeats
    });
    
    // Reset swing
    setSwingAmount([0]);
    setSwingParty(null);
  };

  const getCoalitionImpact = (partyId: string, seatChange: number) => {
    const currentSeats = partySeats[partyId] || 0;
    const newSeats = currentSeats + seatChange;
    
    interface CoalitionOption {
      name: string;
      seats: number;
      viable: boolean;
      impact: number;
      parties: Array<{ id: string; name: string; color: string; [key: string]: any }>;
    }
    
    const coalitionOptions: CoalitionOption[] = [];
    
    // Simulate common coalition patterns
    const patterns = [
      { name: "Center-Right", parties: ["vvd", "cda", "d66"] },
      { name: "Center-Left", parties: ["pvda", "d66", "gl"] },
      { name: "Right-Wing", parties: ["vvd", "pvv", "cda"] },
      { name: "Progressive", parties: ["d66", "gl", "pvda", "volt"] }
    ];
    
    patterns.forEach(pattern => {
      const totalSeats = pattern.parties.reduce((sum, id) => {
        const seats = id === partyId ? newSeats : (partySeats[id] || 0);
        return sum + seats;
      }, 0);
      
      const currentTotal = pattern.parties.reduce((sum, id) => sum + (partySeats[id] || 0), 0);
      const impact = totalSeats - currentTotal;
      
      if (totalSeats >= 76 || currentTotal >= 76 || Math.abs(impact) > 0) {
        const validParties = pattern.parties
          .map(id => parties.find(p => p.id === id))
          .filter((party): party is NonNullable<typeof party> => party !== undefined);
        
        coalitionOptions.push({
          name: pattern.name,
          seats: totalSeats,
          viable: totalSeats >= 76,
          impact: impact,
          parties: validParties
        });
      }
    });
    
    return coalitionOptions;
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Swing Analyse
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Bekijk hoe zetelverschuivingen coalitie mogelijkheden beïnvloeden
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Party Selection */}
        <div>
          <h4 className="font-medium mb-3">Selecteer partij om te analyseren:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {parties.filter(p => (partySeats[p.id] || 0) > 0).map(party => (
              <Button
                key={party.id}
                variant={swingParty === party.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSwingParty(party.id)}
                className="flex items-center gap-2 justify-start"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: party.color }}
                />
                <span className="truncate">{party.name}</span>
                <span className="text-xs">({partySeats[party.id] || 0})</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Swing Control */}
        {swingParty && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Zetelverandering:</h4>
                <div className="flex items-center gap-2">
                  {swingAmount[0] > 0 && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {swingAmount[0] < 0 && <TrendingDown className="h-4 w-4 text-red-600" />}
                  {swingAmount[0] === 0 && <Minus className="h-4 w-4 text-gray-400" />}
                  <span className="font-bold text-lg">
                    {swingAmount[0] > 0 ? '+' : ''}{swingAmount[0]}
                  </span>
                </div>
              </div>
              <Slider
                value={swingAmount}
                onValueChange={setSwingAmount}
                max={20}
                min={-20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-20</span>
                <span>0</span>
                <span>+20</span>
              </div>
            </div>

            {/* Coalition Impact Preview */}
            {swingAmount[0] !== 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Coalition Impact:</h4>
                <div className="space-y-2">
                  {getCoalitionImpact(swingParty, swingAmount[0]).map((coalition, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{coalition.name}</span>
                        <div className="flex gap-1">
                          {coalition.parties.map(party => (
                            <div
                              key={party.id}
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: party.color }}
                              title={party.name}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{coalition.seats} seats</span>
                        <Badge variant={coalition.viable ? "default" : "secondary"}>
                          {coalition.viable ? "Viable" : "No Majority"}
                        </Badge>
                        {coalition.impact !== 0 && (
                          <span className={`text-xs font-medium ${
                            coalition.impact > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {coalition.impact > 0 ? '+' : ''}{coalition.impact}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={applySwing} className="w-full">
              Apply Swing Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}