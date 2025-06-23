import Header from '../components/Header';
import SeatTable from '../components/SeatTable';
import ParliamentChart from '../components/ParliamentChart';
import CoalitionSuggestions from '../components/CoalitionSuggestions';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen coalition-background coalition-text transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Seat Prediction Panel */}
          <div className="lg:col-span-1">
            <SeatTable />
          </div>
          
          {/* Right Column: Visualization and Coalition Suggestions */}
          <div className="lg:col-span-2 space-y-8">
            <ParliamentChart />
            <CoalitionSuggestions />
          </div>
          
        </div>
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
