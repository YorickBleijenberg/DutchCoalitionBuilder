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
    title: 'My Dutch Election Prediction',
    text: `My prediction for the Dutch elections: ${predictionData.topParty?.name} leads with ${predictionData.topParty?.predictedSeats} seats. ${predictionData.insights.join('. ')}.`,
    url: window.location.href
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Political Predictor
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share your election predictions with personalized insights
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={exportPrediction} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Image
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share Prediction
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shareable Prediction Card */}
      <div 
        id="political-predictor-card"
        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-800 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-700 space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
            My Dutch Election Prediction
          </h2>
          <p className="text-blue-700 dark:text-blue-300">
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: nl })}
          </p>

        </div>

        {/* All Party Predictions - Compact Format */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {predictionData.predictions.map((party, index) => (
            <div key={party.id} className="flex items-center justify-between bg-white/70 dark:bg-gray-800/70 p-2 rounded-lg border border-blue-200 dark:border-blue-600">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">#{index + 1}</span>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: party.color }}
                />
                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{party.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-blue-900 dark:text-blue-100">{party.predictedSeats}</span>
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



        {/* Footer */}
        <div className="text-center text-xs text-blue-600 dark:text-blue-400 border-t border-blue-200 dark:border-blue-700 pt-4">
          Created with Nederland Coalitieland • Election: October 29, 2025
        </div>
      </div>
    </div>
  );
}