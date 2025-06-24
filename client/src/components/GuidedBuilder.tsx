import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Users, 
  Target, 
  TrendingUp, 
  Lightbulb,
  HelpCircle
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function GuidedBuilder({ iconOnly = false }: { iconOnly?: boolean }) {
  const { 
    parties, 
    partySeats, 
    setPartySeats, 
    selectedParties, 
    setSelectedParties, 
    coalitionSeats, 
    hasMajority 
  } = useApp();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const loadPreset = (preset: 'current' | 'balanced' | 'majority') => {
    const presets = {
      current: {
        vvd: 34, pvv: 37, nsc: 20, d66: 9, gl: 8, cda: 5, sp: 5, pvda: 9,
        fvd: 3, pvdd: 3, cu: 3, sgp: 3, denk: 3, volt: 3, ja21: 1, 
        bbvnl: 1, bij1: 1, bpp: 1, so: 1
      },
      balanced: {
        vvd: 28, pvv: 25, nsc: 18, d66: 12, gl: 10, pvda: 12, cda: 8,
        sp: 6, fvd: 5, cu: 4, sgp: 3, volt: 4, denk: 3, pvdd: 4,
        ja21: 2, bbvnl: 2, bij1: 2, bpp: 1, so: 1
      },
      majority: {
        vvd: 35, d66: 15, cda: 12, cu: 8, gl: 12, pvda: 15, sp: 8,
        pvv: 20, nsc: 10, fvd: 5, sgp: 3, volt: 4, denk: 2, pvdd: 1
      }
    };
    setPartySeats(presets[preset]);
  };

  const steps: Step[] = [
    {
      id: 0,
      title: "Welcome to Coalition Builder",
      description: "Learn how to predict elections and build coalitions",
      icon: <Users className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🇳🇱</div>
            <h3 className="text-xl font-bold mb-2">Dutch Election Coalition Builder</h3>
            <p className="text-gray-600 dark:text-gray-400">
              This tool helps you predict election outcomes and analyze viable coalition combinations 
              for the Dutch Tweede Kamer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium">Predict Seats</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adjust party seat predictions
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium">Build Coalitions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Form governing coalitions
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium">Analyze Stability</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Evaluate coalition viability
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Set Election Predictions",
      description: "Start with realistic seat predictions",
      icon: <TrendingUp className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Begin by setting realistic seat predictions for each party. You can start with a preset 
            or adjust manually in the "Zetel voorspellingen" tab.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => loadPreset('current')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="font-medium">Current 2023</span>
              <span className="text-xs text-gray-500">Actual results</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => loadPreset('balanced')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="font-medium">Balanced</span>
              <span className="text-xs text-gray-500">Moderate changes</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => loadPreset('majority')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="font-medium">Majority Ready</span>
              <span className="text-xs text-gray-500">Coalition-friendly</span>
            </Button>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-amber-900 dark:text-amber-100">Tip</h5>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  The total must equal 150 seats. Use the hold-to-increment buttons for quick adjustments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Understanding Dutch Politics",
      description: "Key parties and ideological spectrum",
      icon: <HelpCircle className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Understanding the Dutch political landscape helps build realistic coalitions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Major Parties</h4>
              <div className="space-y-2">
                {[
                  { id: 'vvd', name: 'VVD', desc: 'Liberal center-right' },
                  { id: 'pvv', name: 'PVV', desc: 'Right-wing populist' },
                  { id: 'nsc', name: 'NSC', desc: 'Center-right' },
                  { id: 'd66', name: 'D66', desc: 'Liberal democrats' },
                  { id: 'gl', name: 'GL', desc: 'Green left' },
                  { id: 'pvda', name: 'PvdA', desc: 'Social democrats' }
                ].map(party => {
                  const partyData = parties.find(p => p.id === party.id);
                  return partyData ? (
                    <div key={party.id} className="flex items-center gap-3 p-2 rounded">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: partyData.color }}
                      />
                      <div>
                        <span className="font-medium">{party.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{party.desc}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Coalition Patterns</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <strong>Purple Coalition:</strong> VVD + D66 + PvdA (liberal + social)
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                  <strong>Center Coalition:</strong> VVD + CDA + D66 (traditional center)
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <strong>Left Coalition:</strong> PvdA + GL + D66 + SP (progressive)
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Build Your Coalition",
      description: "Select parties to form a government",
      icon: <Users className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Select parties to form a coalition. You need at least 76 seats for a majority government.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {parties
              .filter(party => (partySeats[party.id] || 0) > 0)
              .sort((a, b) => (partySeats[b.id] || 0) - (partySeats[a.id] || 0))
              .slice(0, 12)
              .map(party => (
                <Button
                  key={party.id}
                  variant={selectedParties.includes(party.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (selectedParties.includes(party.id)) {
                      setSelectedParties(selectedParties.filter(id => id !== party.id));
                    } else {
                      setSelectedParties([...selectedParties, party.id]);
                    }
                  }}
                  className="flex items-center gap-2 justify-start p-3 h-auto"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                  <div className="text-left">
                    <div className="font-medium text-sm">{party.name}</div>
                    <div className="text-xs opacity-70">{partySeats[party.id] || 0} seats</div>
                  </div>
                </Button>
              ))}
          </div>
          
          {selectedParties.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium">Current Coalition</h5>
                <Badge variant={hasMajority ? "default" : "secondary"}>
                  {coalitionSeats} seats {hasMajority ? '(Majority)' : '(No Majority)'}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {hasMajority 
                  ? `✓ You have a majority! ${coalitionSeats - 76} seats above the required 76.`
                  : `You need ${76 - coalitionSeats} more seats for a majority.`
                }
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 4,
      title: "Analyze & Export",
      description: "Review stability and share your analysis",
      icon: <Target className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Once you have a coalition, you can analyze its stability and export your predictions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h5 className="font-medium mb-2">Available Features</h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Coalition stability scoring</li>
                <li>• Historical formation timeline</li>
                <li>• Alternative coalition suggestions</li>
                <li>• Export prediction cards</li>
                <li>• Share coalition analysis</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h5 className="font-medium mb-2">Next Steps</h5>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>1. Switch to "Coalitie bouwer" tab</p>
                <p>2. Review stability analysis</p>
                <p>3. Check alternative suggestions</p>
                <p>4. Export your analysis</p>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-4">
            <Button onClick={() => setIsOpen(false)} className="px-8">
              Start Building Coalitions
            </Button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Guided Tutorial
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          {/* Step Content */}
          <div className="min-h-[300px]">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {steps[currentStep].description}
            </p>
            {steps[currentStep].content}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}