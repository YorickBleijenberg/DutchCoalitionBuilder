import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface SentimentData {
  coalitionKey: string;
  parties: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  articles: Array<{
    title: string;
    source: string;
    date: string;
    url: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    excerpt: string;
  }>;
  trends: {
    weeklyChange: number;
    monthlyChange: number;
  };
}

// Simulated media sentiment data based on historical Dutch coalition patterns
const mockSentimentData: SentimentData[] = [
  {
    coalitionKey: "vvd-cda-d66-cu",
    parties: ["vvd", "cda", "d66", "cu"],
    sentiment: "neutral",
    score: 0.1,
    articles: [
      {
        title: "VVD-CDA-D66-CU coalition talks showing progress on climate policy",
        source: "NOS",
        date: "2024-06-20",
        url: "#",
        sentiment: "positive",
        excerpt: "Sources close to negotiations indicate breakthrough on carbon pricing framework..."
      },
      {
        title: "Coalition parties struggle with migration policy alignment",
        source: "De Telegraaf",
        date: "2024-06-19",
        url: "#",
        sentiment: "negative",
        excerpt: "Fundamental disagreements emerge over asylum seeker distribution..."
      },
      {
        title: "Economic experts praise coalition's fiscal responsibility approach",
        source: "Het Financieele Dagblad",
        date: "2024-06-18",
        url: "#",
        sentiment: "positive",
        excerpt: "Coalition's proposed budget framework receives support from economists..."
      }
    ],
    trends: {
      weeklyChange: 0.05,
      monthlyChange: -0.02
    }
  },
  {
    coalitionKey: "vvd-pvda-d66",
    parties: ["vvd", "pvda", "d66"],
    sentiment: "positive",
    score: 0.35,
    articles: [
      {
        title: "Purple coalition revival gains momentum in latest polls",
        source: "De Volkskrant",
        date: "2024-06-21",
        url: "#",
        sentiment: "positive",
        excerpt: "Voters show renewed interest in center-left liberal cooperation..."
      },
      {
        title: "VVD and PvdA find common ground on housing crisis solutions",
        source: "NRC",
        date: "2024-06-20",
        url: "#",
        sentiment: "positive",
        excerpt: "Unprecedented agreement on social housing expansion plans..."
      }
    ],
    trends: {
      weeklyChange: 0.12,
      monthlyChange: 0.08
    }
  },
  {
    coalitionKey: "pvv-vvd-nsc",
    parties: ["pvv", "vvd", "nsc"],
    sentiment: "negative",
    score: -0.25,
    articles: [
      {
        title: "Right-wing coalition faces international criticism",
        source: "NOS",
        date: "2024-06-21",
        url: "#",
        sentiment: "negative",
        excerpt: "EU partners express concerns over proposed immigration policies..."
      },
      {
        title: "Business community warns against populist economic policies",
        source: "Het Financieele Dagblad",
        date: "2024-06-19",
        url: "#",
        sentiment: "negative",
        excerpt: "VNO-NCW calls for moderation in coalition talks..."
      }
    ],
    trends: {
      weeklyChange: -0.08,
      monthlyChange: -0.15
    }
  }
];

export default function MediaSentiment() {
  const { parties, selectedParties } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const getCurrentCoalitionSentiment = () => {
    if (selectedParties.length === 0) return null;
    
    const coalitionKey = selectedParties.sort().join('-');
    
    // Find exact match first
    let sentimentData = mockSentimentData.find(data => 
      data.coalitionKey === coalitionKey
    );
    
    // If no exact match, find partial match
    if (!sentimentData) {
      sentimentData = mockSentimentData.find(data => {
        const overlap = data.parties.filter(p => selectedParties.includes(p));
        return overlap.length >= Math.min(2, selectedParties.length);
      });
    }
    
    return sentimentData;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0.05) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < -0.05) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const currentSentiment = getCurrentCoalitionSentiment();

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            <CardTitle>Media Sentiment Analyse</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Vernieuwen
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monitor nieuwsverslaggeving en publiek sentiment over coalitie mogelijkheden
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {selectedParties.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Geen Coalitie Geselecteerd
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Selecteer partijen in de Coalitie Zoeker om media sentiment analyse te zien
            </p>
          </div>
        ) : currentSentiment ? (
          <div className="space-y-6">
            {/* Overall Sentiment */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Overall Sentiment</h4>
                <Badge className={getSentimentColor(currentSentiment.sentiment)}>
                  {getSentimentIcon(currentSentiment.sentiment)}
                  <span className="ml-1 capitalize">{currentSentiment.sentiment}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {(currentSentiment.score * 100).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sentiment Score</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getTrendIcon(currentSentiment.trends.weeklyChange)}
                    <span className="text-lg font-bold">
                      {(currentSentiment.trends.weeklyChange * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Change</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getTrendIcon(currentSentiment.trends.monthlyChange)}
                    <span className="text-lg font-bold">
                      {(currentSentiment.trends.monthlyChange * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Change</div>
                </div>
              </div>
            </div>

            {/* Recent Articles */}
            <div>
              <h4 className="font-semibold mb-3">Recent Coverage</h4>
              <div className="space-y-3">
                {currentSentiment.articles.map((article, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {article.title}
                        </h5>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{new Date(article.date).toLocaleDateString('nl-NL')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getSentimentColor(article.sentiment)}>
                          {getSentimentIcon(article.sentiment)}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {article.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coalition Analysis */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Analysis Summary</h5>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {currentSentiment.sentiment === 'positive' && "Media coverage suggests this coalition has strong public and institutional support. Key policy alignments are being highlighted positively."}
                {currentSentiment.sentiment === 'neutral' && "Coverage shows mixed reactions to this coalition possibility. Some policy areas show promise while others face criticism."}
                {currentSentiment.sentiment === 'negative' && "Media coverage highlights significant challenges for this coalition. International concerns and domestic opposition are frequently mentioned."}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Limited Coverage Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This coalition combination has limited recent media coverage. Try selecting more established party combinations.
            </p>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          Last updated: {lastUpdated.toLocaleString('nl-NL')}
          <br />
          Sources: NOS, De Telegraaf, De Volkskrant, NRC, Het Financieele Dagblad
        </div>
      </CardContent>
    </Card>
  );
}