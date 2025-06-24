import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Save, Upload, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedScenario {
  id: string;
  name: string;
  description?: string;
  partySeats: Record<string, number>;
  selectedParties: string[];
  savedAt: string;
}

export default function ScenarioManager() {
  const { t } = useTranslation();
  const { partySeats, selectedParties, setPartySeats, setSelectedParties } = useApp();
  const { toast } = useToast();
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load scenarios from localStorage
  const savedScenarios: SavedScenario[] = JSON.parse(
    localStorage.getItem('coalition-scenarios') || '[]'
  );

  const saveScenario = () => {
    if (!scenarioName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a name for your scenario',
        variant: 'destructive',
      });
      return;
    }

    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      name: scenarioName.trim(),
      description: scenarioDescription.trim(),
      partySeats: { ...partySeats },
      selectedParties: [...selectedParties],
      savedAt: new Date().toISOString(),
    };

    const updatedScenarios = [...savedScenarios, newScenario];
    localStorage.setItem('coalition-scenarios', JSON.stringify(updatedScenarios));

    toast({
      title: 'Scenario Saved',
      description: `"${scenarioName}" has been saved successfully`,
    });

    setScenarioName('');
    setScenarioDescription('');
    setIsDialogOpen(false);
  };

  const loadScenario = (scenario: SavedScenario) => {
    setPartySeats(scenario.partySeats);
    setSelectedParties(scenario.selectedParties);

    toast({
      title: 'Scenario Loaded',
      description: `"${scenario.name}" has been loaded`,
    });
  };

  const deleteScenario = (scenarioId: string) => {
    const updatedScenarios = savedScenarios.filter(s => s.id !== scenarioId);
    localStorage.setItem('coalition-scenarios', JSON.stringify(updatedScenarios));

    toast({
      title: 'Scenario Deleted',
      description: 'The scenario has been removed',
    });
  };

  const totalSeats = Object.values(partySeats).reduce((sum, seats) => sum + seats, 0);
  const coalitionSeats = selectedParties.reduce((sum, partyId) => sum + (partySeats[partyId] || 0), 0);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-inter font-semibold">
              Scenario Manager
            </CardTitle>
            <p className="text-sm coalition-neutral mt-1">
              Save and load coalition scenarios
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="coalition-primary flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Save Coalition Scenario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Seats:</span> {totalSeats}
                  </div>
                  <div>
                    <span className="font-medium">Coalition:</span> {coalitionSeats}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scenario Name</label>
                  <Input
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder="e.g., Progressive Coalition"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Input
                    value={scenarioDescription}
                    onChange={(e) => setScenarioDescription(e.target.value)}
                    placeholder="Brief description of this scenario"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveScenario} className="coalition-primary">
                    Save Scenario
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {savedScenarios.length > 0 ? (
          <div className="space-y-3">
            {savedScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3 sm:space-y-0"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{scenario.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {Object.values(scenario.partySeats).reduce((sum, seats) => sum + seats, 0)} seats
                    </Badge>
                  </div>
                  {scenario.description && (
                    <p className="text-sm coalition-neutral mt-1">{scenario.description}</p>
                  )}
                  <div className="flex items-center text-xs coalition-neutral mt-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(scenario.savedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadScenario(scenario)}
                    className="flex items-center flex-1 sm:flex-none justify-center"
                  >
                    <Upload className="mr-1 h-3 w-3" />
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteScenario(scenario.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Save className="mx-auto h-12 w-12 coalition-neutral mb-4" />
            <h3 className="text-lg font-medium coalition-text mb-2">
              No Saved Scenarios
            </h3>
            <p className="coalition-neutral">
              Create your first coalition scenario and save it for later
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}