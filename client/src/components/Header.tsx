import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';

export default function Header() {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode, language, setLanguage } = useApp();
  const { toast } = useToast();

  const downloadSnapshot = async () => {
    try {
      const element = document.getElementById('results-panel');
      if (!element) {
        throw new Error('Results panel not found');
      }

      toast({
        title: t('export.downloading'),
        description: 'Generating PNG snapshot...',
      });

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `coalition-snapshot-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: t('export.success'),
        description: 'Your coalition snapshot has been downloaded.',
      });
    } catch (error) {
      console.error('Failed to download snapshot:', error);
      toast({
        title: t('export.error'),
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-inter font-bold coalition-primary text-white px-3 py-1 rounded-lg flex items-center">
              <Landmark className="mr-2 h-5 w-5" />
              {t('app.title')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLanguage('nl')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'nl'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                🇳🇱 NL
              </button>
            </div>
            
            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
              title={t('darkMode.toggle')}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {/* Export Button */}
            <Button
              onClick={downloadSnapshot}
              className="coalition-primary flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              {t('export.download')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
