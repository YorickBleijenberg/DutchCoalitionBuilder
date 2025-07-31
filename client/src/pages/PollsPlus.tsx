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

                    console.log('Starting to load CSV files...');
                    
                    // Load events data first
                    Papa.parse('/events.csv', {
                      download: true,
                      header: true,
                      dynamicTyping: true,
                      skipEmptyLines: true,
                      complete: res => {
                        console.log('Events CSV loaded successfully:', res);
                        eventsData = res.data
                          .filter(r => r.Datum && r.Gebeurtenis && r.Gebeurtenis.trim() !== '')
                          .map(r => ({
                            date: new Date(r.Datum),
                            event: r.Gebeurtenis,
                            description: r.Toelichting || ''
                          }))
                          .filter(r => r.date instanceof Date && !isNaN(r.date));
                        
                        console.log('Processed events data:', eventsData.length, eventsData);
                        
                        // Now load polls data
                        loadPolls();
                      },
                      error: function(error) {
                        console.error('Error loading events.csv:', error);
                        // Continue with polls loading even if events fail
                        loadPolls();
                      }
                    });

                    function loadPolls() {
                      console.log('Starting to load polls.csv...');
                      Papa.parse('/polls.csv', {
                        download: true,
                        header: true,
                        delimiter: ';',
                        dynamicTyping: true,
                        skipEmptyLines: true,
                        complete: res => {
                          console.log('Polls CSV loaded successfully:', res);
                          console.log('Raw CSV data sample:', res.data.slice(0, 3));
                          
                          const raw = res.data.map(r => ({ ...r, date: r.Datum ? new Date(r.Datum) : null }));
                          console.log('After date mapping:', raw.slice(0, 3));
                          
                          const data = raw.filter(r => r.date instanceof Date && !isNaN(r.date));
                          console.log('After date filtering:', data.length, 'valid entries');
                          
                          if (data.length === 0) {
                            console.error('No valid polling data found!');
                            document.getElementById('chart').innerHTML = '<div class="p-8 text-center text-red-600">No valid polling data found. Check date format in polls.csv.</div>';
                            return;
                          }
                          
                          const parties = Object.keys(data[0]).filter(c => !['Peilingsorganisatie','Datum','date'].includes(c));
                          console.log('Extracted parties:', parties);
                          
                          if (parties.length === 0) {
                            console.error('No parties found in data!');
                            document.getElementById('chart').innerHTML = '<div class="p-8 text-center text-red-600">No party data found in polls.csv.</div>';
                            return;
                          }
                          
                          console.log('Showing controls and building interface...');
                          document.getElementById('controls').classList.remove('hidden');
                          buildButtons(parties, data);
                          draw(parties, data);
                        },
                        error: function(error) {
                          console.error('Error loading polls.csv:', error);
                          document.getElementById('chart').innerHTML = '<div class="p-8 text-center text-red-600">Error loading polling data: ' + error.message + '</div>';
                        }
                      });
                    }

                    function buildButtons(parties, data) {
                      console.log('Building buttons for parties:', parties);
                      const ctr = document.getElementById('buttons'); 
                      if (!ctr) {
                        console.error('Could not find buttons container!');
                        return;
                      }
                      
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
                      console.log('Created', parties.length, 'party buttons');
                      
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
                      console.log('Drawing chart with parties:', parties, 'data entries:', data.length);
                      const sel = getSelected(parties);
                      console.log('Selected parties:', sel);
                      
                      const sigma = +document.getElementById('sigma').value;
                      const showEvents = document.getElementById('show-events').checked;
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
                          let num = 0, den = 0, vals = [];
                          sub.forEach(r => {
                            const w = (pollsterQuality[r.Peilingsorganisatie] || 0.75) * timeWeight(r.date, current);
                            num += r[p] * w;
                            den += w;
                            vals.push(r[p]);
                          });
                          const avg = den ? num/den : 0;
                          const variance = vals.reduce((a, v) => a + (v - avg)**2, 0) / vals.length;
                          rec[p] = avg;
                          rec[p+'_std'] = Math.sqrt(variance);
                        });
                        return rec;
                      }).filter(r => r);

                      const thresh = +document.getElementById('uncertainty-threshold').value;
                      const traces = [];
                      
                      sel.forEach((p, i) => {
                        const color = colorPalette[i % colorPalette.length];
                        traces.push({ 
                          x: agg.map(r => r.date), 
                          y: agg.map(r => r[p]), 
                          mode: 'lines', 
                          name: p, 
                          line: { color, width: 3 }, 
                          hovertemplate: p + ': %{y:.1f} zetels<br>%{x|%d-%m-%Y}<extra></extra>'
                        });
                        
                        if (sel.length <= thresh) {
                          const upper = agg.map(r => Math.max(0, r[p] + sigma * r[p+'_std']));
                          const lower = agg.map(r => Math.max(0, r[p] - sigma * r[p+'_std']));
                          traces.push({
                            x: agg.map(r => r.date).concat(agg.map(r => r.date).reverse()),
                            y: upper.concat(lower.reverse()),
                            fill: 'toself',
                            fillcolor: 'rgba(' + hex(color) + ',0.2)',
                            line: { width: 0 },
                            hoverinfo: 'skip',
                            showlegend: false
                          });
                        }
                        
                        if (sel.length <= 3) {
                          const dots = data.filter(r => r[p] != null);
                          traces.push({
                            x: dots.map(r => r.date),
                            y: dots.map(r => r[p]),
                            mode: 'markers',
                            name: p,
                            marker: { color, size: 6 },
                            showlegend: false,
                            text: dots.map(r => r[p].toFixed(0) + '<br>' + r.date.getDate().toString().padStart(2, '0') + '-' + (r.date.getMonth() + 1).toString().padStart(2, '0') + '<br>' + r.Peilingsorganisatie),
                            hovertemplate: '%{text}<extra></extra>'
                          });
                        }
                      });

                      // Add event markers if enabled
                      let layout;
                      if (showEvents && eventsData.length > 0) {
                        const eventDates = eventsData.filter(e => e.date >= minD && e.date <= maxD);
                        
                        const shapes = eventDates.map(event => ({
                          type: 'line',
                          x0: event.date,
                          x1: event.date,
                          y0: 0,
                          y1: 1,
                          yref: 'paper',
                          line: {
                            color: 'rgba(255, 0, 0, 0.6)',
                            width: 1,
                            dash: 'dash'
                          }
                        }));

                        const annotations = eventDates.map((event, i) => ({
                          x: event.date,
                          y: 1,
                          yref: 'paper',
                          text: event.event,
                          showarrow: true,
                          arrowhead: 2,
                          arrowcolor: 'red',
                          arrowwidth: 1,
                          arrowsize: 1,
                          ax: 0,
                          ay: -30 - (i % 3) * 20,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          bordercolor: 'red',
                          borderwidth: 1,
                          font: { size: 10 },
                          hovertext: event.description || event.event
                        }));

                        layout = { 
                          margin: { t: 80, b: 40, l: 50, r: 40 }, 
                          yaxis: { title: 'Zetels', range: [0, null] },
                          xaxis: { title: 'Datum' },
                          shapes: shapes,
                          annotations: annotations,
                          hovermode: 'closest',
                          showlegend: true
                        };
                      } else {
                        layout = { 
                          margin: { t: 40, b: 40, l: 50, r: 40 }, 
                          yaxis: { title: 'Zetels', range: [0, null] },
                          xaxis: { title: 'Datum' },
                          hovermode: 'closest',
                          showlegend: true
                        };
                      }

                      console.log('Creating Plotly chart with', traces.length, 'traces');
                      console.log('Traces:', traces);
                      console.log('Layout:', layout);
                      
                      const chartElement = document.getElementById('chart');
                      if (!chartElement) {
                        console.error('Chart element not found!');
                        return;
                      }
                      
                      Plotly.newPlot('chart', traces, layout, {responsive: true})
                        .then(() => {
                          console.log('Chart created successfully!');
                        })
                        .catch(error => {
                          console.error('Error creating chart:', error);
                        });
                      window._lastAgg = agg;
                    }
                    
                    function hex(hex) {
                      const c = hex.replace('#','');
                      const num = parseInt(c, 16);
                      const r = (num >> 16) & 255;
                      const g = (num >> 8) & 255;
                      const b = num & 255;
                      return r + ',' + g + ',' + b;
                    }

                    function exportCSV(parties) {
                      const agg = window._lastAgg;
                      if (!agg) return;
                      const hdr = ['date', ...parties, ...parties.map(p => 'std_'+p)];
                      const rows = agg.map(r => [r.date.toISOString().slice(0,10), ...parties.map(p => r[p].toFixed(2)), ...parties.map(p => r[p+'_std'].toFixed(2))]);
                      const csv = [hdr.join(',')].concat(rows.map(r => r.join(','))).join('\\n');
                      const blob = new Blob([csv],{type:'text/csv'});
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href = url; a.download = 'aggregated_polls.csv'; a.click();
                    }

                    function exportPNG() {
                      Plotly.toImage('chart', { format: 'png', height: 1080, width: 1920 }).then(url => {
                        const a = document.createElement('a'); a.href = url; a.download = 'chart.png'; a.click();
                      });
                    }

                    document.getElementById('toggle-dark').onclick = () => {
                      document.body.classList.toggle('bg-gray-100');
                      document.body.classList.toggle('bg-gray-900');
                      document.body.classList.toggle('text-gray-800');
                      document.body.classList.toggle('text-gray-100');
                      document.querySelectorAll('.bg-white').forEach(el => {
                        el.classList.toggle('bg-white');
                        el.classList.toggle('bg-gray-800');
                      });
                    };
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