import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PollsPlus() {
  const [, setLocation] = useLocation();
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Try different possible embed URLs for the poll aggregator
  const pollUrls = [
    'https://yorick-online.nl',
    'https://www.yorick-online.nl',
    // Backup alternative polling sites if main one doesn't work
    'https://peilingwijzer.tomlouwerse.nl',
  ];

  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

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
            {!iframeError ? (
              <>
                {/* Loading State */}
                {!iframeLoaded && (
                  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                      <p className="text-gray-600 dark:text-gray-400">Polling data wordt geladen...</p>
                    </div>
                  </div>
                )}
                
                {/* Embedded Poll Aggregator */}
                <div className="w-full" style={{ height: '800px' }}>
                  <iframe
                    src={pollUrls[currentUrlIndex]}
                    className="w-full h-full border-0"
                    title="Nederlandse Poll Aggregator"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    onError={() => {
                      console.error('Iframe loading error for URL:', pollUrls[currentUrlIndex]);
                      if (currentUrlIndex < pollUrls.length - 1) {
                        setCurrentUrlIndex(prev => prev + 1);
                      } else {
                        setIframeError(true);
                      }
                    }}
                    onLoad={() => {
                      console.log('Iframe loaded successfully');
                      setIframeLoaded(true);
                    }}
                  />
                </div>
              </>
            ) : (
              /* Error State - Show when iframe fails */
              <div className="p-12 text-center bg-gray-50 dark:bg-gray-700">
                <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-yellow-600" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Iframe Weergave Niet Beschikbaar
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  De polling websites kunnen niet direct in deze pagina worden weergegeven vanwege beveiligingsinstellingen (X-Frame-Options policy). 
                  Dit is een normale beveiliging die veel websites gebruiken om clickjacking aanvallen te voorkomen.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => window.open('https://yorick-online.nl', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white mr-3"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Yorick Online
                  </Button>
                  <Button
                    onClick={() => window.open('https://peilingwijzer.tomlouwerse.nl', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Peilingwijzer
                  </Button>
                </div>
              </div>
            )}
            
            {/* Info Message - Always Show */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Tip:</strong> Voor de beste ervaring en alle functies, open de polling sites in een nieuw tabblad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Nederlandse Polling Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold mb-2">Yorick Online</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Gedetailleerde polling aggregator met historische trends
                </p>
                <Button
                  onClick={() => window.open('https://yorick-online.nl', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bezoek Site
                </Button>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold mb-2">Peilingwijzer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Tom Louwerse's academische polling analyse
                </p>
                <Button
                  onClick={() => window.open('https://peilingwijzer.tomlouwerse.nl', '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bezoek Site
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Deze sites worden onderhouden door onafhankelijke polling experts en bieden de meest actuele Nederlandse verkiezingspeilingen.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}