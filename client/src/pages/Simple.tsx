import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CoalitionBuilder from '../components/CoalitionBuilder';
import CoalitionPredictionBar from '../components/CoalitionPredictionBar';
import CoalitionSuggestions from '../components/CoalitionSuggestions';
import IdeologicalCoalitions from '../components/IdeologicalCoalitions';
import { Moon, Sun } from 'lucide-react';


export default function Simple() {
  const { loadPollData, darkMode, toggleDarkMode, } = useApp();

  return (
    /* page background */
    <div 
      className="min-h-screen bg-gray-100 dark:bg-gray-800"
      style={{
        backgroundImage: "url('http://coalitieland.nl/BinnenhofLight2.jpg?v=1')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Header */}
      <div className="bg-[#374c7a] dark:bg-[#374c7a] text-white py-1.5">
        
        <div className="max-w-none mx-auto px-0.5 sm:px-4 lg:px-6">
          
          <div className="flex items-center justify-between">
            
            <a 
              href="/" 
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold 
                         py-1.5 px-3 text-xs
                         sm:py-2 sm:px-4 sm:text-sm
                         md:py-3 md:px-8 md:text-base
                         rounded-lg shadow-lg transition-colors duration-300"
            >
              Nederland Coalitieland
            </a>

              

            <div className="flex items-center gap-3">
              <span className="text-xs">
                {(() => {
                  const electionDate = new Date('2025-10-29');
                  const today = new Date();
                  const diffTime = electionDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 ? `Dagen tot de verkiezingen: ${diffDays}` : 'Verkiezingen vandaag!';
                })()}
              </span>

              <Button
                variant="ghost"

                onClick={toggleDarkMode}
                className="p-2 rounded-lg 
                text-gray-400 dark:text-yellow-300
                hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode  ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-6xl mx-auto">

          
          {/* Poll Selection */}
          <Card className="mb-6 bg-gray-50/80 dark:bg-gray-700/80 border-gray-200/50 dark:border-gray-600/20 py-2">
            
            
          
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-lg font-inter font-semibold">Selecteer Peiling Data</CardTitle>
                <div className="flex flex-wrap gap-2 ">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPollData('current')}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 hover:border-blue-400 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-800 dark:hover:border-blue-600"
                  >
                    TK2023
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPollData('peilingwijzer')}
                    className="text-xs bg-green-100 hover:bg-green-200 text-green-800 border-green-300 hover:border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-700 dark:hover:bg-green-800 dark:hover:border-green-600"
                  >
                    Peilingwijzer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPollData('peil')}
                    className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300 hover:border-purple-400 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700 dark:hover:bg-purple-800 dark:hover:border-purple-600"
                  >
                    Peil.nl
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPollData('1v')}
                    className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300 hover:border-orange-400 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700 dark:hover:bg-orange-800 dark:hover:border-orange-600"
                  >
                    1V
                  </Button>
                </div>
              </div> 
            
          </Card>

          {/* Coalition Prediction Bar */}
          <div className="backdrop-blur-md bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg shadow-lg">
            <CoalitionPredictionBar />
          </div>

          {/* Coalition Builder */}
          <div className="mt-6">
            <CoalitionBuilder />
          </div>

          {/* Coalition Suggestions */}
          <div className="mt-6">
            <CoalitionSuggestions />
          </div>

          {/* Ideological Coalitions */}
          <div className="mt-6">
            <IdeologicalCoalitions />
          </div>
        </div>
      </div>
    </div>
  );
}