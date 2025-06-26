import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, TrendingUp, Users, Target, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import * as htmlToImage from 'html-to-image';

export default function PoliticalPredictor() {
  const { 
    parties, 
    partySeats,
    selectedParties,
    coalitionSeats,
    hasMajority 
  } = useApp();

  // Get predictions with insights - show all parties
  const getPredictionInsights = () => {
    const predictions = parties
      .map(p => ({ ...p, predictedSeats: partySeats[p.id] || 0 }))
      .sort((a, b) => b.predictedSeats - a.predictedSeats);

    const topParty = predictions[0];
    const gainers = predictions.filter(p => p.predictedSeats > p.currentSeats);
    const losers = predictions.filter(p => p.predictedSeats < p.currentSeats);
    
    const totalPredictedSeats = predictions.reduce((sum, p) => sum + p.predictedSeats, 0);
    const selectedCoalition = predictions.filter(p => selectedParties.includes(p.id));

    return {
      predictions,
      topParty,
      gainers: gainers.sort((a, b) => (b.predictedSeats - b.currentSeats) - (a.predictedSeats - a.currentSeats)),
      losers: losers.sort((a, b) => (a.currentSeats - a.predictedSeats) - (b.currentSeats - b.predictedSeats)),
      totalPredictedSeats,
      selectedCoalition,
      insights: generateInsights(predictions, gainers, losers, topParty, selectedCoalition)
    };
  };

  const generateInsights = (predictions: any[], gainers: any[], losers: any[], topParty: any, selectedCoalition: any[]) => {
    const insights = [];

    if (topParty) {
      insights.push(`${topParty.name} leads with ${topParty.predictedSeats} seats`);
    }

    if (gainers.length > 0) {
      const biggestGainer = gainers[0];
      const gain = biggestGainer.predictedSeats - biggestGainer.currentSeats;
      insights.push(`${biggestGainer.name} gains most: +${gain} seats`);
    }

    if (losers.length > 0) {
      const biggestLoser = losers[0];
      const loss = biggestLoser.currentSeats - biggestLoser.predictedSeats;
      insights.push(`${biggestLoser.name} loses most: -${loss} seats`);
    }

    if (selectedCoalition.length > 0) {
      const coalitionSeatsTotal = selectedCoalition.reduce((sum: number, p: any) => sum + p.predictedSeats, 0);
      insights.push(`Selected coalition: ${coalitionSeatsTotal} seats ${coalitionSeatsTotal >= 76 ? '(Majority)' : '(Minority)'}`);
    }

    return insights;
  };

  const predictionData = getPredictionInsights();

  const exportPrediction = async () => {
    const element = document.getElementById('political-predictor-card');
    if (!element) return;

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `political-prediction-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const shareData = {
    title: 'Mijn Nederlandse Verkiezingsvoorspelling',
    text: `Mijn voorspelling voor de Nederlandse verkiezingen: ${predictionData.topParty?.name} leidt met ${predictionData.topParty?.predictedSeats} zetels. ${predictionData.insights.join('. ')}.`,
    url: window.location.href
  };

  const handleShare = async () => {
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Show share options for desktop
      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`
      };
      
      // Create a temporary share menu
      const shareMenu = document.createElement('div');
      shareMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      shareMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Deel Voorspelling</h3>
          <div class="space-y-3">
            <button onclick="window.open('${shareUrls.twitter}', '_blank')" class="w-full flex items-center gap-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              Twitter
            </button>
            <button onclick="window.open('${shareUrls.facebook}', '_blank')" class="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
            <button onclick="window.open('${shareUrls.whatsapp}', '_blank')" class="w-full flex items-center gap-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
              WhatsApp
            </button>
            <button onclick="navigator.clipboard.writeText('${shareText.replace(/'/g, "\\'")}').then(() => alert('Gekopieerd naar klembord!'))" class="w-full flex items-center gap-3 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Kopieer Link
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="w-full p-3 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
              Annuleren
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(shareMenu);
      
      // Remove menu when clicking outside
      shareMenu.addEventListener('click', (e) => {
        if (e.target === shareMenu) {
          shareMenu.remove();
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Politieke Voorspeller
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Deel je verkiezingsvoorspellingen met persoonlijke inzichten
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={exportPrediction} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Exporteer Afbeelding</span>
              <span className="sm:hidden">Exporteren</span>
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Deel Voorspelling</span>
              <span className="sm:hidden">Delen</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shareable Prediction Card */}
      <div 
        id="political-predictor-card"
        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-800 p-4 sm:p-6 md:p-8 rounded-xl border-2 border-blue-200 dark:border-blue-700 space-y-4 sm:space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2 leading-tight">
            Mijn Nederlandse Verkiezingsvoorspelling
          </h2>
          <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300">
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: nl })}
          </p>
        </div>

        {/* All Party Predictions - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 sm:mb-6">
          {predictionData.predictions.map((party, index) => (
            <div key={party.id} className="flex items-center justify-between bg-white/70 dark:bg-gray-800/70 p-2 sm:p-3 rounded-lg border border-blue-200 dark:border-blue-600">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">#{index + 1}</span>
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: party.color }}
                />
                <span className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm truncate">{party.name}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <span className="font-bold text-sm sm:text-lg text-blue-900 dark:text-blue-100">{party.predictedSeats}</span>
                <span className={`text-xs font-medium px-1 py-0.5 rounded ${
                  party.predictedSeats > party.currentSeats 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : party.predictedSeats < party.currentSeats
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {party.predictedSeats > party.currentSeats ? '+' : party.predictedSeats < party.currentSeats ? '' : '-'}{party.predictedSeats - party.currentSeats || '0'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Coalition Summary */}
        {selectedParties.length > 0 && (
          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
            <div className="flex flex-wrap items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Mijn Coalitievoorspelling
              </h3>
              <Badge 
                variant={hasMajority ? "default" : "destructive"} 
                className="px-2 py-1 text-xs"
              >
                {hasMajority ? `+${coalitionSeats - 76} headroom` : `${76 - coalitionSeats} seats needed`}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {predictionData.selectedCoalition.map(party => (
                  <div key={party.id} className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                    <span className="text-xs font-medium text-blue-900 dark:text-blue-100">
                      {party.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {coalitionSeats} seats
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Belangrijkste Inzichten
          </h3>
          <div className="space-y-2">
            {predictionData.insights.map((insight, index) => (
              <div key={index} className="flex items-center text-sm text-blue-800 dark:text-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-blue-600 dark:text-blue-400 border-t border-blue-200 dark:border-blue-700 pt-4">
          Created with Nederland Coalitieland.nl •  {new Date().toLocaleDateString('nl-NL')}
        </div>
      </div>
    </div>
  );
}