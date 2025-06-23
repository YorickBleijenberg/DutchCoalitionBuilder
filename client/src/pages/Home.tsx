import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import SeatTable from '../components/SeatTable';
import CoalitionBarChart from '../components/CoalitionBarChart';
import ComparisonBarChart from '../components/ComparisonBarChart';
import PartyBar from '../components/PartyBar';
import CoalitionSuggestions from '../components/CoalitionSuggestions';
import CoalitionBuilder from '../components/CoalitionBuilder';
import CoalitionPredictionBar from '../components/CoalitionPredictionBar';
import StabilityAnalysis from '../components/StabilityAnalysis';
import ScenarioManager from '../components/ScenarioManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RotateCcw, Download, Settings, Moon, Sun } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const { loadCurrentSeats, resetSeats, darkMode, toggleDarkMode, language, setLanguage } = useApp();
  const [activeTab, setActiveTab] = useState('predictions');

  return (
    <div className="min-h-screen coalition-background coalition-text transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="flex justify-between items-center mb-8">
            <TabsList className="grid w-auto grid-cols-2 bg-gray-100 dark:bg-gray-700">
              <TabsTrigger value="predictions" className="px-6 py-2">
                {t('tabs.predictions')}
              </TabsTrigger>
              <TabsTrigger value="coalitions" className="px-6 py-2">
                {t('tabs.coalitions')}
              </TabsTrigger>
            </TabsList>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={loadCurrentSeats}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('tabs.loadCurrent')}
              </Button>
              <Button
                variant="outline"
                onClick={resetSeats}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('tabs.reset')}
              </Button>
              
              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Instellingen
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={toggleDarkMode}>
                    {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    {darkMode ? 'Lichte modus' : 'Donkere modus'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLanguage('nl')} className={language === 'nl' ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                    🇳🇱 Nederlands
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Seat Predictions Tab */}
          <TabsContent value="predictions" className="space-y-8">
            <SeatTable />
            <CoalitionPredictionBar />
            <ComparisonBarChart />
          </TabsContent>

          {/* Coalition Builder Tab */}
          <TabsContent value="coalitions" className="space-y-8">
            <PartyBar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Coalition Builder and Scenario Manager */}
              <div className="lg:col-span-1 space-y-8">
                <CoalitionBuilder />
                <ScenarioManager />
              </div>
              
              {/* Right Column: Coalition Bar Chart, Suggestions, and Stability Analysis */}
              <div className="lg:col-span-2 space-y-8">
                <CoalitionBarChart />
                <CoalitionSuggestions />
                <StabilityAnalysis />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm coalition-neutral">
              {t('footer.description')}
            </div>
            <div className="text-sm coalition-neutral">
              {t('footer.update')} {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
