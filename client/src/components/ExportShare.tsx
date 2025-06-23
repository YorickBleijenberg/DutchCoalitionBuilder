import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, Calendar, Users, TrendingUp } from 'lucide-react';
import * as html2canvas from 'html-to-image';

export default function ExportShare() {
  const { parties, partySeats, selectedParties, coalitionSeats, hasMajority } = useApp();
  const predictionCardRef = useRef<HTMLDivElement>(null);
  const coalitionCardRef = useRef<HTMLDivElement>(null);

  const getDaysUntilElection = () => {
    const electionDate = new Date('2025-10-29');
    const today = new Date();
    const diffTime = electionDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const exportCard = async (cardRef: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await html2canvas.toPng(cardRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const shareCard = async (cardRef: React.RefObject<HTMLDivElement>, title: string) => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await html2canvas.toPng(cardRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `${title}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: title,
          text: `Check out my ${title.toLowerCase()} for the Dutch elections!`,
          files: [file]
        });
      } else {
        // Fallback: copy to clipboard
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Image copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const getTopParties = () => {
    return parties
      .filter(party => (partySeats[party.id] || 0) > 0)
      .sort((a, b) => (partySeats[b.id] || 0) - (partySeats[a.id] || 0))
      .slice(0, 8);
  };

  const getSelectedPartiesData = () => {
    return parties
      .filter(party => selectedParties.includes(party.id))
      .sort((a, b) => (partySeats[b.id] || 0) - (partySeats[a.id] || 0));
  };

  const daysUntilElection = getDaysUntilElection();
  const topParties = getTopParties();
  const selectedPartiesData = getSelectedPartiesData();

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Export & Share
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share your predictions and coalition analyses
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Election Prediction</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportCard(predictionCardRef, 'dutch-election-prediction.png')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareCard(predictionCardRef, 'Dutch Election Prediction')}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            
            {selectedParties.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Coalition Analysis</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportCard(coalitionCardRef, 'dutch-coalition-analysis.png')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareCard(coalitionCardRef, 'Dutch Coalition Analysis')}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Cards */}
      <div className="space-y-6">
        {/* Prediction Card */}
        <div 
          ref={predictionCardRef}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-xl border-2 border-blue-200 max-w-[600px] mx-auto"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Dutch Election Prediction 2025</h1>
            <div className="flex items-center justify-center gap-4 text-blue-700">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">{daysUntilElection} days until election</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Tweede Kamer</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {parties
              .filter(party => (partySeats[party.id] || 0) > 0)
              .sort((a, b) => (partySeats[b.id] || 0) - (partySeats[a.id] || 0))
              .map((party, index) => (
              <div key={party.id} className="flex items-center justify-between bg-white/70 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                  <span className="font-medium text-gray-900 text-sm truncate">{party.name}</span>
                </div>
                <span className="font-bold text-lg text-blue-900">{partySeats[party.id]}</span>
              </div>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-blue-300">
            <div className="text-sm text-blue-600 mb-1">Total Seats Predicted</div>
            <div className="text-2xl font-bold text-blue-900">
              {Object.values(partySeats).reduce((sum, seats) => sum + (seats || 0), 0)} / 150
            </div>
            <div className="text-xs text-blue-500 mt-2">
              Generated by Dutch Election Coalition Builder • {new Date().toLocaleDateString('nl-NL')}
            </div>
          </div>
        </div>

        {/* Coalition Card */}
        {selectedParties.length > 0 && (
          <div 
            ref={coalitionCardRef}
            className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl shadow-xl border-2 border-green-200 max-w-[600px] mx-auto"
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-green-900 mb-2">Coalition Analysis</h1>
              <div className="flex items-center justify-center gap-4 text-green-700">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{selectedPartiesData.length} parties</span>
                </div>
                <Badge variant={hasMajority ? "default" : "destructive"} className="px-3 py-1">
                  {hasMajority ? 'Majority Coalition' : 'No Majority'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {selectedPartiesData.map((party) => (
                <div key={party.id} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{party.name}</div>
                      <div className="text-xs text-gray-600 truncate max-w-[200px]">{party.fullName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-900">{partySeats[party.id] || 0}</div>
                    <div className="text-xs text-gray-500">seats</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-300">
              <div className="text-center">
                <div className="text-sm text-green-600">Coalition Seats</div>
                <div className="text-3xl font-bold text-green-900">{coalitionSeats}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-green-600">Majority Status</div>
                <div className={`text-lg font-bold ${hasMajority ? 'text-green-900' : 'text-red-600'}`}>
                  {hasMajority ? `+${coalitionSeats - 76}` : `${76 - coalitionSeats} needed`}
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <div className="text-xs text-green-500">
                Generated by Dutch Election Coalition Builder • {new Date().toLocaleDateString('nl-NL')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}