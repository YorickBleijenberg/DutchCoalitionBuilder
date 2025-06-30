import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Simple() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Simpele Coalitie Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <span className="text-3xl">🚧</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Binnenkort Beschikbaar
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                De simpele versie van de coalitie builder komt binnenkort beschikbaar. 
                Voor nu kun je de geavanceerde versie gebruiken.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}