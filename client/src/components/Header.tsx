import { useTranslation } from 'react-i18next';
import { Landmark } from 'lucide-react';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-center items-center h-16">
        <h1 className="text-xl font-inter font-bold coalition-primary text-white px-3 py-1 rounded-lg flex items-center">
          <Landmark className="mr-2 h-5 w-5" />
          {t('app.title')}
        </h1>
      </div>
    </header>
  );
}
