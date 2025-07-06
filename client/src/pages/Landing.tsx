import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, Download, Settings, Moon, Sun, Calendar, TrendingUp, Users, Share2, BarChart,BarChart3, Target, Zap, ChevronRight, Lightbulb, } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


export default function Landing() {
    const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { loadCurrentSeats, resetSeats, darkMode, toggleDarkMode, language, setLanguage, selectedParties } = useApp();
  const [activeTab, setActiveTab] = useState('coalitions');

  const [isDarkMode, setIsDarkMode] = useState(false);
  const themeClasses = {
    light: {
      bg: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
      header: 'bg-white/80 backdrop-blur-sm border-slate-200/50',
      card: 'bg-white/60 backdrop-blur-sm border-slate-200/30',
      cardHover: 'hover:bg-white/80 hover:border-slate-300/50',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-500',
      button: 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80',
      buttonPrimary: 'bg-blue-500/90 text-white hover:bg-blue-600/90'
    },
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950',
      header: 'bg-slate-900/40 backdrop-blur-xl border-blue-500/20',
      card: 'bg-slate-800/20 backdrop-blur-xl border-blue-500/20',
      cardHover: 'hover:bg-slate-800/30 hover:border-blue-400/30',
      text: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      button: 'bg-slate-700/50 text-slate-200 hover:bg-slate-600/60',
      buttonPrimary: 'bg-blue-600/80 text-white hover:bg-blue-500/90'
    }
  };
  const theme = isDarkMode ? themeClasses.dark : themeClasses.light;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-100">
                {(() => {
                  const electionDate = new Date('2025-10-29');
                  const today = new Date();
                  const diffTime = electionDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 ? `Dagen tot de verkiezingen: ${diffDays}` : 'Verkiezingen vandaag!';
                })()}
              </span>
            </div> 
             {/* <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-100
              hover:text-white"
            >
              {darkMode  ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>*/}
            
          </div>
        </div>
      </header>

  
      {/*  <!-- Hero Section: Full screen, centered content -->
      */}
      <main className="hero-bg min-h-screen flex flex-col relative">
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-slate-900 opacity-30"></div>

        {/* Content Container - Add centering classes here */}
        <div className="z-10 px-4 flex flex-col items-center justify-top min-h-screen text-center">
          {/* Small Title */}
          {/*<h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">Coalitieland.nl</h2>*/}

          {/* Main Headline */}
          <h1 className="font-serif-display text-5xl text-gray-100 md:text-7xl lg:text-8xl font-bold mb-4">
            <br/>Nederland,<br/>Coalitieland
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-100 md:text-xl max-w-2xl mb-12">
            Bouw en analyseer Nederlandse politieke coalities met realtime zetelvoorspellingen en parlementsvisualisaties.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <Button 
              size="lg" 
              className="bg-gold hover:bg-gold-dark text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300"
              onClick={() => setLocation('/advanced')}
            >
              Naar de coalitie zoeker
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>  

            <Button 
              size="lg" 
              className="bg-gold hover:bg-gold-dark text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300"
              onClick={() => setLocation('/Stemming')}
            >
              Stemming tool
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>  
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Een interactieve tool voor Nederlandse coalitie-analyse | TK2025</p>
          </div>
        </div>
      </footer>
    </div>
  
  );
}