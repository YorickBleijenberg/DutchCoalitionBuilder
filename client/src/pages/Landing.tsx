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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Bouw je Ideale
                <span className="block bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Nederlandse Coalitie
                </span>
              </h1>
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-orange-200 dark:bg-orange-800 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full opacity-40 animate-pulse delay-300"></div>
            </div>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ontdek realistische coalitie-opties voor de Tweede Kamer verkiezingen 2025. 
              Analyseer zetelverdelingen, stabiliteit en politieke haalbaarheid met geavanceerde tools.
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Badge variant="secondary" className="flex items-center space-x-1 px-3 py-1">
                <BarChart3 className="h-3 w-3" />
                <span>Realtime Zeteldata</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1 px-3 py-1">
                <Target className="h-3 w-3" />
                <span>Stabiliteitsanalyse</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1 px-3 py-1">
                <TrendingUp className="h-3 w-3" />
                <span>Polling Integratie</span>
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Simple Mode Card */}
              <Card className="relative overflow-hidden border-2 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:shadow-lg group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 dark:bg-green-800 rounded-bl-3xl opacity-50"></div>
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Simpel</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Gemakkelijk beginnen</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-left">
                    Perfect voor een snelle coalitie-exploratie. Kies partijen, zie direct of je een meerderheid hebt, 
                    en ontdek de meest waarschijnlijke coalitie-combinaties.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 text-left">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Snelle coalitie-selectie</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Automatische suggesties</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Intuïtieve interface</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:scale-105 transition-transform"
                    onClick={() => setLocation('/simple')}
                  >
                    Begin Simpel
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Advanced Mode Card */}
              <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 dark:bg-blue-800 rounded-bl-3xl opacity-50"></div>
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Geavanceerd</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Volledige controle</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-left">
                    Complete toolkit voor politieke analisten. Pas zetelverdelingen aan, analyseer stabiliteit, 
                    bekijk historische trends en exporteer professionele rapporten.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 text-left">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Zetelverdeling aanpassen</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Stabiliteitsanalyse</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Export & rapportage</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-transform"
                    onClick={() => setLocation('/advanced')}
                  >
                    Begin Geavanceerd
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="pt-12 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">150</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tweede Kamer Zetels</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">76</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Benodigde Meerderheid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">15+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Politieke Partijen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2025</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Verkiezingsjaar</div>
                </div>
              </div>
            </div>
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