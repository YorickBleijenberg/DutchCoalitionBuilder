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
            {/* Embedded Poll Aggregator - Direct HTML Content */}
            <div className="w-full bg-gray-100" style={{ minHeight: '800px' }}>
              <div dangerouslySetInnerHTML={{
                __html: `
                  <div class="container mx-auto p-4">
                    <h1 class="text-3xl font-bold mb-4">Tweede Kamer 2025 Poll Aggregator</h1>

                    <button id="toggle-dark" class="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded shadow">
                      Toggle Dark Mode
                    </button>

                    <div id="controls" class="bg-white p-4 rounded shadow mb-4 hidden">
                      <div class="flex flex-wrap items-center mb-3 gap-2">
                        <button id="enable-all" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Enable All</button>
                        <button id="disable-all" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Disable All</button>
                        <button id="export-csv" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-auto">Export CSV</button>
                        <button id="export-img" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Export PNG</button>
                        <button id="reset-weights" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Reset Weights</button>
                        <label class="flex items-center">
                          <input id="show-events" type="checkbox" checked class="mr-2" />
                          <span>Show Events</span>
                        </label>
                      </div>
                      <div id="buttons" class="flex flex-wrap gap-2 mb-4"></div>
                      <div class="flex flex-wrap items-center gap-4 mb-2">
                        <label class="flex items-center"><span class="mr-2">Half-life (days):</span><input id="half-life" type="number" value="30" min="1" class="border rounded px-2 py-1 w-20" /></label>
                        <label class="flex items-center"><span class="mr-2">Show uncertainty when ≤</span><input id="uncertainty-threshold" type="number" value="5" min="1" class="border rounded px-2 py-1 w-16" /><span class="ml-2">parties selected</span></label>
                        <label class="flex items-center"><span class="mr-2">Uncertainty level (σ):</span><select id="sigma" class="border rounded px-2 py-1"><option value="1">1σ</option><option value="2" selected>2σ</option></select></label>
                        <label class="flex items-center"><span class="mr-2">Verian weight:</span><input id="verian-weight" type="number" step="0.01" value="0.88" class="border rounded px-2 py-1 w-20" /></label>
                        <label class="flex items-center"><span class="mr-2">Peil.nl weight:</span><input id="peilnl-weight" type="number" step="0.01" value="0.90" class="border rounded px-2 py-1 w-20" /></label>
                        <label class="flex items-center"><span class="mr-2">Ipsos I&O weight:</span><input id="ipsos-weight" type="number" step="0.01" value="0.95" class="border rounded px-2 py-1 w-20" /></label>
                      </div>
                    </div>
                    <div id="chart" class="bg-white rounded shadow" style="width:100%;height:600px;"></div>
                  </div>

                  <script src="https://cdn.plot.ly/plotly-2.31.1.min.js"></script>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>
                  <script>
                    let defaultPollsterQuality = { 'Peilingwijzer':1,'Ipsos I&O':0.95,'Ipsos':0.95,'I&O Research':0.9,'TNS NIPO':0.85,'Peil.nl':0.9,'Verian':0.88 };
                    let pollsterQuality = JSON.parse(JSON.stringify(defaultPollsterQuality));
                    let halfLife = 30;
                    let decayLambda = Math.log(2)/halfLife;
                    let eventsData = [];
                    const colorPalette = ['#636efa','#EF553B','#00cc96','#ab63fa','#FFA15A','#19d3f3','#FF6692','#B6E880','#FF97FF','#FECB52'];
                    function timeWeight(d,c){return Math.exp(-decayLambda*((c-d)/(1000*60*60*24)));}

                    // Mock data since CSV files won't be available
                    const mockPolls = [
                      {Datum: '2024-12-01', Peilingsorganisatie: 'Peil.nl', VVD: 24, PVV: 37, CDA: 5, D66: 9, GL: 8, SP: 5, PvdA: 8, ChristenUnie: 3, Partij: 20, FVD: 3, DENK: 3, '50PLUS': 1, SGP: 3, VOLT: 2, JA21: 1, BBB: 7, NSC: 20, 'Piratenpartij': 0},
                      {Datum: '2024-11-15', Peilingsorganisatie: 'Ipsos I&O', VVD: 26, PVV: 35, CDA: 6, D66: 10, GL: 9, SP: 6, PvdA: 9, ChristenUnie: 4, Partij: 18, FVD: 4, DENK: 2, '50PLUS': 1, SGP: 3, VOLT: 3, JA21: 1, BBB: 8, NSC: 18, 'Piratenpartij': 0},
                      {Datum: '2024-11-01', Peilingsorganisatie: 'Verian', VVD: 25, PVV: 36, CDA: 5, D66: 8, GL: 7, SP: 5, PvdA: 7, ChristenUnie: 3, Partij: 19, FVD: 3, DENK: 3, '50PLUS': 2, SGP: 3, VOLT: 2, JA21: 1, BBB: 9, NSC: 19, 'Piratenpartij': 0}
                    ];

                    const data = mockPolls.map(r => ({ ...r, date: new Date(r.Datum) }));
                    const parties = Object.keys(data[0]).filter(c => !['Peilingsorganisatie','Datum','date'].includes(c));
                    
                    document.getElementById('controls').classList.remove('hidden');
                    buildButtons(parties, data);
                    draw(parties, data);

                    function buildButtons(parties, data) {
                      const ctr = document.getElementById('buttons'); 
                      ctr.innerHTML = '';
                      parties.forEach((p, i) => {
                        const btn = document.createElement('button');
                        btn.innerText = p;
                        btn.id = p;
                        btn.className = 'px-3 py-1 rounded bg-blue-500 text-white';
                        btn.dataset.on = 'true';
                        btn.onclick = () => {
                          btn.dataset.on = (btn.dataset.on === 'true' ? 'false' : 'true');
                          btn.classList.toggle('bg-blue-500');
                          btn.classList.toggle('bg-gray-200');
                          btn.classList.toggle('text-white');
                          draw(parties, data);
                        };
                        ctr.appendChild(btn);
                      });
                      
                      document.getElementById('enable-all').onclick = () => { parties.forEach(p => toggleButton(p, true)); draw(parties, data); };
                      document.getElementById('disable-all').onclick = () => { parties.forEach(p => toggleButton(p, false)); draw(parties, data); };
                      document.getElementById('half-life').onchange = e => { halfLife = +e.target.value; decayLambda = Math.log(2)/halfLife; draw(parties, data); };
                      document.getElementById('uncertainty-threshold').onchange = () => draw(parties, data);
                      document.getElementById('verian-weight').onchange = e => { pollsterQuality['Verian'] = +e.target.value; draw(parties, data); };
                      document.getElementById('peilnl-weight').onchange = e => { pollsterQuality['Peil.nl'] = +e.target.value; draw(parties, data); };
                      document.getElementById('ipsos-weight').onchange = e => { pollsterQuality['Ipsos I&O'] = +e.target.value; draw(parties, data); };
                      document.getElementById('sigma').onchange = () => draw(parties, data);
                      document.getElementById('show-events').onchange = () => draw(parties, data);
                      document.getElementById('reset-weights').onclick = () => {
                        pollsterQuality = JSON.parse(JSON.stringify(defaultPollsterQuality));
                        document.getElementById('verian-weight').value = defaultPollsterQuality['Verian'];
                        document.getElementById('peilnl-weight').value = defaultPollsterQuality['Peil.nl'];
                        document.getElementById('ipsos-weight').value = defaultPollsterQuality['Ipsos I&O'];
                        draw(parties, data);
                      }
                    }

                    function toggleButton(p, on) {
                      const btn = document.getElementById(p);
                      btn.dataset.on = on ? 'true' : 'false';
                      btn.classList.toggle('bg-blue-500', on);
                      btn.classList.toggle('bg-gray-200', !on);
                      btn.classList.toggle('text-white', on);
                    }

                    function getSelected(parties) {
                      return parties.filter(p => document.getElementById(p).dataset.on === 'true');
                    }

                    function draw(parties, data) {
                      const sel = getSelected(parties);
                      const dates = data.map(r => r.date);
                      const minD = new Date(Math.min(...dates));
                      const maxD = new Date();
                      const allDates = [];
                      for (let d = new Date(minD); d <= maxD; d.setDate(d.getDate() + 1)) allDates.push(new Date(d));

                      const agg = allDates.map(current => {
                        const sub = data.filter(r => r.date <= current);
                        if (!sub.length) return null;
                        const rec = { date: current };
                        sel.forEach(p => {
                          let num = 0, den = 0;
                          sub.forEach(r => {
                            const w = (pollsterQuality[r.Peilingsorganisatie] || 0.75) * timeWeight(r.date, current);
                            num += r[p] * w;
                            den += w;
                          });
                          rec[p] = den ? num/den : 0;
                        });
                        return rec;
                      }).filter(r => r);

                      const traces = sel.map((p, i) => ({
                        x: agg.map(r => r.date),
                        y: agg.map(r => r[p]),
                        mode: 'lines+markers',
                        name: p,
                        line: { color: colorPalette[i % colorPalette.length], width: 3 },
                        hovertemplate: p + ': %{y:.1f} zetels<br>%{x|%d-%m-%Y}<extra></extra>'
                      }));

                      const layout = {
                        margin: { t: 40, b: 40, l: 50, r: 40 },
                        yaxis: { title: 'Zetels', range: [0, null] },
                        xaxis: { title: 'Datum' },
                        hovermode: 'closest',
                        showlegend: true
                      };

                      Plotly.newPlot('chart', traces, layout, {responsive: true});
                    }
                  </script>
                `
              }} />
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