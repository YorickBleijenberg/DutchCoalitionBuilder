import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PollsPlus() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Header */}
      <div className="bg-[#374c7a] dark:bg-[#374c7a] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="text-white hover:bg-blue-700 dark:hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar home
              </Button>
              <h1 className="text-2xl font-bold">Polls Plus</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm">
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

      <div className="max-w-7xl mx-auto p-6">
        {/* Poll Aggregator Section */}
        <Card className="mb-8 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardTitle className="text-2xl font-bold text-center">
              Nederlandse Polling Aggregator
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
              Realtime polling data van alle Nederlandse peilingbureaus
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {/* Embedded Poll Aggregator */}
            <div className="w-full" style={{ height: '800px' }}>
              <iframe
                src="https://yorick-online.nl"
                className="w-full h-full border-0"
                title="Nederlandse Poll Aggregator"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </CardContent>
        </Card>

        {/* External Link Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Bezoek de volledige site</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Voor meer uitgebreide polling data en analyses, bezoek yorick-online.nl
                </p>
              </div>
              <Button
                onClick={() => window.open('https://yorick-online.nl', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open externe site
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}