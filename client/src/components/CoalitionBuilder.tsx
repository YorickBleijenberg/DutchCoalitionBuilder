import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Users, CheckCircle, AlertTriangle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function CoalitionBuilder() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { 
    parties, 
    partySeats: seatData, 
    selectedParties, 
    setSelectedParties, 
    coalitionSeats, 
    hasMajority 
  } = useApp();

  const handlePartyToggle = (partyId: string, checked: boolean) => {
    if (checked) {
      setSelectedParties([...selectedParties, partyId]);
    } else {
      setSelectedParties(selectedParties.filter(id => id !== partyId));
    }
  };

  const clearCoalition = () => {
    setSelectedParties([]);
  };

  const handleSaveScenario = () => {
    if (selectedParties.length === 0) {
      toast({
        title: "No coalition selected",
        description: "Please select parties before saving.",
        variant: "destructive"
      });
      return;
    }

    const coalitionName = selectedParties
      .map(id => parties.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(' + ');

    const scenario = {
      id: Date.now().toString(),
      name: coalitionName,
      description: `Coalition: ${coalitionSeats} seats ${hasMajority ? '(Majority)' : '(Minority)'}`,
      partySeats: { ...seatData },
      selectedParties: [...selectedParties],
      savedAt: new Date().toISOString()
    };

    // Save to localStorage
    const savedScenarios = JSON.parse(localStorage.getItem('coalition-scenarios') || '[]');
    savedScenarios.push(scenario);
    localStorage.setItem('coalition-scenarios', JSON.stringify(savedScenarios));

    toast({
      title: "Coalition saved",
      description: `"${coalitionName}" has been saved to scenarios.`,
    });
  };

  const selectedPartiesData = parties.filter(party => selectedParties.includes(party.id));
  const availableParties = parties.filter(party => 
    !selectedParties.includes(party.id) && (seatData[party.id] || 0) > 0
  );

  return (
    <Card className="backdrop-blur-md bg-white/20 dark:bg-gray-800/70 shadow-lg border border-gray-200/20 dark:border-gray-700/20">
      
      
      <CardContent className="p-6">
        {/* All Parties - 4 Columns Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 ">
          {parties
            .filter(party => (seatData[party.id] || 0) > 0)
            .sort((a, b) => (seatData[b.id] || 0) - (seatData[a.id] || 0))
            .map((party) => {
            const isSelected = selectedParties.includes(party.id);
            return (
              <div 
                key={party.id} 
                onClick={() => handlePartyToggle(party.id, !isSelected)}
                className={`flex items-center justify-between p-3 rounded-lg bg-white/80 transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-green-100/80 dark:bg-green-900/30 border-2 border-green-500/90 dark:border-green-400/50' 
                    : 'border border-gray-200/80 dark:border-gray-600/80 hover:bg-gray-50/80 dark:hover:bg-gray-700/90'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                  <div>
                    <div className="font-medium text-sm">{party.name} ({seatData[party.id] || 0})</div>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle className="hidden md:block h-3 w-3 text-green-600 dark:text-green-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {parties.filter(party => (seatData[party.id] || 0) > 0).length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 coalition-neutral mb-4" />
            <h3 className="text-lg font-medium coalition-text mb-2">
              No Parties Available
            </h3>
            <p className="coalition-neutral">
              Assign seats to parties to start building coalitions
            </p>
          </div>
        )}
      </CardContent>
      <CardHeader className="bg-gray-50/20 dark:bg-gray-700/80 border-b border-gray-200/50 dark:border-gray-600/20 py-2">
        <div className="flex justify-between items-center">          
          <Button
            onClick={handleSaveScenario}
            size="sm"
            className="ml-auto bg-blue-500 hover:bg-blue-700 text-white"
          >
            Bewaar coalitie
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
