import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import SeatTable from '../components/SeatTable';

import ComparisonBarChart from '../components/ComparisonBarChart';
import PartyBar from '../components/PartyBar';
import CoalitionSuggestions from '../components/CoalitionSuggestions';
import CoalitionBuilder from '../components/CoalitionBuilder';
import CoalitionPredictionBar from '../components/CoalitionPredictionBar';
import StabilityAnalysis from '../components/StabilityAnalysis';
import ScenarioManager from '../components/ScenarioManager';
import SwingAnalysis from '../components/SwingAnalysis';
import CoalitionTimeline from '../components/CoalitionTimeline';
import ExportShare from '../components/ExportShare';
import GuidedBuilder from '../components/GuidedBuilder';
import MediaSentiment from '../components/MediaSentiment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RotateCcw, Download, Settings, Moon, Sun, Calendar } from 'lucide-react';

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
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-200 dark:bg-gray-600 p-1 rounded-lg shadow-sm">
              <TabsTrigger 
                value="predictions" 
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <span className="hidden sm:inline">{t('tabs.predictions')}</span>
                <span className="sm:hidden">Zetels</span>
              </TabsTrigger>
              <TabsTrigger 
                value="coalitions" 
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <span className="hidden sm:inline">{t('tabs.coalitions')}</span>
                <span className="sm:hidden">Coalitie</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <span className="hidden sm:inline">{t('tabs.analytics')}</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="export" 
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <span className="hidden sm:inline">{t('tabs.export')}</span>
                <span className="sm:hidden">Export</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Election Countdown and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Election Countdown */}
              <div className="flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">
                  {(() => {
                    const electionDate = new Date('2025-10-29');
                    const today = new Date();
                    const diffTime = electionDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays > 0 ? `${diffDays} dagen tot verkiezing` : 'Verkiezing vandaag!';
                  })()}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <GuidedBuilder />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadCurrentSeats}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{t('tabs.loadCurrent')}</span>
                  <span className="sm:hidden">Current</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSeats}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{t('tabs.reset')}</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
                
                {/* Settings Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Instellingen</span>
                      <span className="sm:hidden">Menu</span>
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
          </div>

          {/* Seat Predictions Tab */}
          <TabsContent value="predictions" className="space-y-8 bg-blue-50/30 dark:bg-blue-900/10 rounded-lg p-6">
            <SeatTable />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ComparisonBarChart />
              <PartyBar />
            </div>
          </TabsContent>

          {/* Coalition Builder Tab */}
          <TabsContent value="coalitions" className="space-y-8 bg-green-50/30 dark:bg-green-900/10 rounded-lg p-6">
            <CoalitionPredictionBar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Coalition Builder and Scenario Manager */}
              <div className="lg:col-span-1 space-y-8">
                <CoalitionBuilder />
                <ScenarioManager />
              </div>
              
              {/* Right Column: Coalition Suggestions */}
              <div className="lg:col-span-2 space-y-8">
                <CoalitionSuggestions />
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8 bg-purple-50/30 dark:bg-purple-900/10 rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SwingAnalysis />
              <StabilityAnalysis />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CoalitionTimeline />
              <MediaSentiment />
            </div>
          </TabsContent>

          {/* Export & Share Tab */}
          <TabsContent value="export" className="space-y-8 bg-orange-50/30 dark:bg-orange-900/10 rounded-lg p-6">
            <ExportShare />
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
