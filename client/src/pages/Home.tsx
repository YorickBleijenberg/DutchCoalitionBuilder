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
import CoalitionPredictionBarSimple from '../components/CoalitionPredictionBarSimple';
import StabilityAnalysis from '../components/StabilityAnalysis';
import ScenarioManager from '../components/ScenarioManager';
import SwingAnalysis from '../components/SwingAnalysis';
import CoalitionTimeline from '../components/CoalitionTimeline';
import ExportShare from '../components/ExportShare';
import GuidedBuilder from '../components/GuidedBuilder';
import MediaSentiment from '../components/MediaSentiment';
import IdeologicalCoalitions from '../components/IdeologicalCoalitions';
import PoliticalPredictor from '../components/PoliticalPredictor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RotateCcw, Download, Settings, Moon, Sun, Calendar, TrendingUp, Users, Share2, BarChart } from 'lucide-react';

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
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {(() => {
                  const electionDate = new Date('2025-10-29');
                  const today = new Date();
                  const diffTime = electionDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 ? `Dagen tot de verkiezingen: ${diffDays}` : 'Verkiezingen vandaag!';
                })()}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-blue-700 dark:hover:bg-blue-700">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <GuidedBuilder menuItem />
                  <DropdownMenuSeparator />
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
      </div>
      
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tab Navigation - Hidden on Mobile, Sticky on Desktop */}
          <div className="hidden md:flex flex-row justify-between items-center mb-8 sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 py-4">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
              <TabsTrigger 
                value="predictions" 
                className="text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                <TrendingUp className="mr-1 h-4 w-4" />
                Voorspelling uitslag
              </TabsTrigger>
              <TabsTrigger 
                value="coalitions" 
                className="text-sm font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:text-green-700 dark:data-[state=inactive]:text-green-300 hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
              >
                <Users className="mr-1 h-4 w-4" />
                Coalitie zoeker
              </TabsTrigger>
              <TabsTrigger 
                value="export" 
                className="text-sm font-medium data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=inactive]:text-orange-700 dark:data-[state=inactive]:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
              >
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="text-sm font-medium data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=inactive]:text-purple-700 dark:data-[state=inactive]:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
              >
                <BarChart className="mr-1 h-4 w-4" />
                Analyses
              </TabsTrigger>
            </TabsList>
            

          </div>
          
          

          {/* Seat Predictions Tab */}
          <TabsContent value="predictions" className="space-y-8 bg-blue-50/30 dark:bg-blue-900/10 rounded-lg p-6">
            {selectedParties.length > 0 && <CoalitionPredictionBarSimple />}
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

          {/* Export & Share Tab */}
          <TabsContent value="export" className="space-y-8 bg-orange-50/30 dark:bg-orange-900/10 rounded-lg p-6">
            <PoliticalPredictor />
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
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
            <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-16">
              <TabsTrigger 
                value="predictions" 
                className="flex flex-col items-center justify-center h-full text-xs font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-0 rounded-none"
              >
                <TrendingUp className="h-5 w-5 mb-1" />
                <span>Voorspelling</span>
              </TabsTrigger>
              <TabsTrigger 
                value="coalitions" 
                className="flex flex-col items-center justify-center h-full text-xs font-medium data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-0 rounded-none"
              >
                <Users className="h-5 w-5 mb-1" />
                <span>Coalitie</span>
              </TabsTrigger>
              <TabsTrigger 
                value="export" 
                className="flex flex-col items-center justify-center h-full text-xs font-medium data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 dark:data-[state=active]:bg-orange-900/30 dark:data-[state=active]:text-orange-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors border-0 rounded-none"
              >
                <Share2 className="h-5 w-5 mb-1" />
                <span>Share</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex flex-col items-center justify-center h-full text-xs font-medium data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-0 rounded-none"
              >
                <BarChart className="h-5 w-5 mb-1" />
                <span>Analyses</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
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
