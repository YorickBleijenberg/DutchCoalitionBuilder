import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StemmingProvider } from '../context/StemmingContext';
import StemmingBuilder from '../components/StemmingBuilder';
import StemmingTK from '../components/StemmingTK';
import StemmingEK from '../components/StemmingEK';

export default function Stemming() {
  const { t } = useTranslation();

  return (
    <StemmingProvider>
      <div className="min-h-screen p-4" style={{ backgroundColor: '#faf9f5' }}>
        <div className="max-w-4xl mx-auto">
          
          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-[#374c7a] dark:bg-[#374c7a] text-white py-1.5">
              <div className="max-w-none mx-auto px-0.5 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between">
                    <a 
                      href="/" 
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold 
                                 w-fit
                                 py-1.5 px-2 text-xs
                                 sm:py-2 sm:px-4 sm:text-sm
                                 md:py-3 md:px-8 md:text-base
                                 rounded-lg shadow-lg transition-colors duration-300"
                    >
                      <span className="sm:hidden">NL Coalitieland</span>
                      <span className="hidden sm:inline">Nederland Coalitieland</span>
                    </a>

                  

                  <div className="flex items-center gap-3 ">
                    <span className="text-xs">
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
          
          
          
            <CardHeader style={{ backgroundColor: '#faf9f5' }}>
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Stemming Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="py-12 style={{ backgroundColor: '#faf9f5' }}">
              <div>
                <StemmingTK />
              </div>
              
              <div>
                <StemmingEK />
              </div>
              
              <div>
                <StemmingBuilder />
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </StemmingProvider>
  );
}