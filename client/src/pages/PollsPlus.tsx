import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    Papa: any;
    Plotly: any;
  }
}

export default function PollsPlus() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollData, setPollData] = useState<any[]>([]);
  const [parties, setParties] = useState<string[]>([]);
  const [selectedParties, setSelectedParties] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load external scripts first
    const loadScripts = () => {
      return new Promise<void>((resolve) => {
        let plotlyLoaded = false;
        let papaLoaded = false;

        const checkComplete = () => {
          if (plotlyLoaded && papaLoaded) {
            resolve();
          }
        };

        // Load Plotly
        if (!window.Plotly) {
          const plotlyScript = document.createElement('script');
          plotlyScript.src = 'https://cdn.plot.ly/plotly-2.31.1.min.js';
          plotlyScript.onload = () => {
            plotlyLoaded = true;
            checkComplete();
          };
          document.head.appendChild(plotlyScript);
        } else {
          plotlyLoaded = true;
        }

        // Load Papa Parse
        if (!window.Papa) {
          const papaScript = document.createElement('script');
          papaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js';
          papaScript.onload = () => {
            papaLoaded = true;
            checkComplete();
          };
          document.head.appendChild(papaScript);
        } else {
          papaLoaded = true;
        }

        if (plotlyLoaded && papaLoaded) {
          resolve();
        }
      });
    };

    loadScripts().then(() => {
      loadCSVData();
    });
  }, []);

  const loadCSVData = async () => {
    console.log('Starting CSV data load...');
    setIsLoading(true);
    setError(null);

    try {
      // Check if Papa Parse is available
      if (!window.Papa) {
        throw new Error('Papa Parse library not loaded');
      }

      // Load polls.csv
      const response = await fetch('/polls.csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch polls.csv: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      console.log('CSV text loaded:', csvText.substring(0, 200) + '...');
      
      window.Papa.parse(csvText, {
        header: true,
        delimiter: ';',
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          console.log('Papa Parse results:', results);
          
          if (results.errors.length > 0) {
            console.error('Parse errors:', results.errors);
          }

          const rawData = results.data.map((r: any) => ({
            ...r,
            date: r.Datum ? new Date(r.Datum) : null
          }));
          
          const validData = rawData.filter((r: any) => r.date instanceof Date && !isNaN(r.date.getTime()));
          console.log('Valid data entries:', validData.length);
          console.log('Sample data:', validData.slice(0, 3));

          if (validData.length === 0) {
            throw new Error('No valid polling data found');
          }

          const extractedParties = Object.keys(validData[0]).filter(
            c => !['Peilingsorganisatie', 'Datum', 'date'].includes(c)
          );
          
          console.log('Extracted parties:', extractedParties);
          
          setPollData(validData);
          setParties(extractedParties);
          setSelectedParties(new Set(extractedParties.slice(0, 5))); // Select first 5 parties by default
          setIsLoading(false);
        },
        error: (error: any) => {
          console.error('Papa Parse error:', error);
          throw new Error(`CSV parsing failed: ${error.message}`);
        }
      });
    } catch (err: any) {
      console.error('Error loading CSV data:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pollData.length > 0 && parties.length > 0 && !isLoading && selectedParties.size > 0) {
      createChart();
    }
  }, [pollData, parties, selectedParties, isLoading]);

  const createChart = () => {
    console.log('Creating chart with selected parties:', Array.from(selectedParties));
    
    if (!window.Plotly) {
      console.error('Plotly not loaded');
      return;
    }

    const selectedPartiesArray = Array.from(selectedParties);
    if (selectedPartiesArray.length === 0) return;

    // Create time-weighted aggregation
    const dates = pollData.map(r => r.date);
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date();
    
    const allDates = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d));
    }

    const pollsterQuality = { 
      'Peilingwijzer': 1, 
      'Ipsos I&O': 0.95, 
      'Peil.nl': 0.9, 
      'Verian': 0.88 
    };
    const halfLife = 30;
    const decayLambda = Math.log(2) / halfLife;
    const timeWeight = (d: Date, c: Date) => Math.exp(-decayLambda * ((c.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));

    const aggregatedData = allDates.map(currentDate => {
      const relevantPolls = pollData.filter(r => r.date <= currentDate);
      if (relevantPolls.length === 0) return null;

      const result: any = { date: currentDate };
      selectedPartiesArray.forEach(party => {
        let weightedSum = 0;
        let totalWeight = 0;
        
        relevantPolls.forEach(poll => {
          const weight = (pollsterQuality[poll.Peilingsorganisatie as keyof typeof pollsterQuality] || 0.75) * 
                        timeWeight(poll.date, currentDate);
          weightedSum += poll[party] * weight;
          totalWeight += weight;
        });
        
        result[party] = totalWeight > 0 ? weightedSum / totalWeight : 0;
      });
      
      return result;
    }).filter(r => r !== null);

    // Create traces for Plotly
    const colorPalette = ['#636efa','#EF553B','#00cc96','#ab63fa','#FFA15A','#19d3f3','#FF6692','#B6E880','#FF97FF','#FECB52'];
    
    const traces = selectedPartiesArray.map((party, i) => ({
      x: aggregatedData.map(d => d.date),
      y: aggregatedData.map(d => d[party]),
      mode: 'lines+markers',
      name: party,
      line: { color: colorPalette[i % colorPalette.length], width: 3 },
      hovertemplate: `${party}: %{y:.1f} zetels<br>%{x|%d-%m-%Y}<extra></extra>`
    }));

    const layout = {
      margin: { t: 40, b: 40, l: 50, r: 40 },
      yaxis: { title: 'Zetels', range: [0, null] },
      xaxis: { title: 'Datum' },
      hovermode: 'closest',
      showlegend: true,
      plot_bgcolor: 'white'
    };

    window.Plotly.newPlot('poll-chart', traces, layout, { responsive: true })
      .then(() => {
        console.log('Chart created successfully');
      })
      .catch((error: any) => {
        console.error('Error creating chart:', error);
        setError(`Chart creation failed: ${error.message}`);
      });
  };

  const toggleParty = (party: string) => {
    const newSelected = new Set(selectedParties);
    if (newSelected.has(party)) {
      newSelected.delete(party);
    } else {
      newSelected.add(party);
    }
    setSelectedParties(newSelected);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Polls Plus
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Realtime Nederlandse polling data aggregator
              </p>
            </div>
          </div>
        </div>

        {/* Main Poll Aggregator Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-center">Nederlandse Poll Aggregator</CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
              Realtime polling data van alle Nederlandse peilingbureaus
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600 dark:text-gray-400">Polling data wordt geladen...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-12 text-center bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-red-600" />
                <h3 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-100">
                  Error Loading Data
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-6">{error}</p>
                <Button onClick={loadCSVData} className="bg-red-600 hover:bg-red-700 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <div className="w-full">
                {/* Party Selection Controls */}
                <div className="p-4 bg-white dark:bg-gray-800 border-b">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      onClick={() => setSelectedParties(new Set(parties))}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      size="sm"
                    >
                      Select All
                    </Button>
                    <Button
                      onClick={() => setSelectedParties(new Set())}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      size="sm"
                    >
                      Clear All
                    </Button>
                    <div className="flex-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 self-center">
                      {selectedParties.size} van {parties.length} partijen geselecteerd
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {parties.map(party => (
                      <button
                        key={party}
                        onClick={() => toggleParty(party)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          selectedParties.has(party)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {party}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart Container */}
                <div 
                  id="poll-chart" 
                  className="bg-white dark:bg-gray-800" 
                  style={{ width: '100%', height: '600px' }}
                />
              </div>
            )}
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