import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BarChart3, 
  Target, 
  Zap, 
  Settings,
  ChevronRight,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export default function Landing() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Coalitieland Nederland
              </h1>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200">
              TK2025 Ready
            </Badge>
          </div>
        </div>
      </header>

  
      {/*  <!-- Hero Section: Full screen, centered content -->
      */}
        <main class="hero-bg min-h-screen flex flex-col items-center justify-center relative">
          {/* <!-- Dark Overlay for better text readability -->*/}
            <div class="absolute inset-0 bg-slate-900 opacity-60"></div>

            {/*<!-- Content Container -->*/}
            <div class="z-10 text-center px-4">

              {/*  <!-- Small Title -->
                <h2 class="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">Coalitieland.nl</h2>*/}

              {/*  <!-- Main Headline -->*/}
                <h1 class="font-serif-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
                    Nederland, Coalitieland
                </h1>

             {/*   <!-- Subtitle -->*/}
                <p class="text-lg md:text-xl max-w-2xl mx-auto mb-12">
                    Inzichten en analyses over de Nederlandse politiek.
                </p>

              {/*  <!-- Action Buttons -->*/}
              <div class="flex justify-center items-center space-x-4">
                {/*<a href="/simpel" class="bg-gold hover:bg-gold-dark text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300">
                        Simpel
                    </a>
                    <a href="/uitgebreid" class="bg-gold hover:bg-gold-dark text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300">
                        Uitgebreid
                    </a>*/}
                  
                  <Button 
                    size="lg" 
                    className="bg-gold hover:bg-gold-dark text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300"
                    onClick={() => setLocation('/advanced')}
                  >
                    Begin Geavanceerd
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