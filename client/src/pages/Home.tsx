import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import SeatTable from '../components/SeatTable';

import ComparisonBarChart from '../components/ComparisonBarChart';
import PartyBar from '../components/PartyBar';
import ParliamentChart from '../components/ParliamentChart';

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
import IdeologicalCoalitions from '../components/IdeologicalCoalitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RotateCcw, Download, Settings, Moon, Sun, Calendar } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const { loadCurrentSeats, resetSeats, darkMode, toggleDarkMode, language, setLanguage, selectedParties } = useApp();
  const [activeTab, setActiveTab] = useState('predictions');

  return (
    <div className="min-h-screen coalition-background coalition-text transition-colors duration-300">
      <Header />
      
      {/* Election Countdown Banner */}
      <div className="bg-blue-600 dark:bg-blue-800 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              Nederland Coalitieland
            </span>
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <span className="text-lg font-semibold">
                {(() => {
                  const electionDate = new Date('2025-10-29');
                  const today = new Date();
                  const diffTime = electionDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 ? `Dagen tot de verkiezingen: ${diffDays}` : 'Verkiezingen vandaag!';
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
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
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
              <GuidedBuilder />
              
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

          {/* Seat Predictions Tab */}
          <TabsContent value="predictions" className="space-y-8 bg-blue-50/30 dark:bg-blue-900/10 rounded-lg p-6">
            {selectedParties.length > 0 && <CoalitionPredictionBar />}
            <SeatTable />
            <div className="w-full">
              <ComparisonBarChart />
            </div>
          </TabsContent>

          {/* Coalition Builder Tab */}
          <TabsContent value="coalitions" className="space-y-8 bg-green-50/30 dark:bg-green-900/10 rounded-lg p-6">
            <CoalitionPredictionBar />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Coalition Builder */}
              <div className="space-y-8">
                <CoalitionBuilder />
                {/* Scenario Manager - visible on wide screens */}
                <div className="hidden lg:block">
                  <ScenarioManager />
                </div>
              </div>
              
              {/* Right Column: Coalition Suggestions */}
              <div className="space-y-8">
                <CoalitionSuggestions />
              </div>
            </div>
            
            {/* Scenario Manager - visible on narrow screens at bottom */}
            <div className="lg:hidden">
              <ScenarioManager />
            </div>
            
            {/* Ideological Coalitions - Separate Block */}
            <IdeologicalCoalitions />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8 bg-purple-50/30 dark:bg-purple-900/10 rounded-lg p-6">
            <CoalitionTimeline />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SwingAnalysis />
              <StabilityAnalysis />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MediaSentiment />
            </div>
            <div className="w-full">
              <ParliamentChart />
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
