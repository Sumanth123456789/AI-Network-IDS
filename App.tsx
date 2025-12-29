
import React, { useState, useEffect, useRef } from 'react';
import { StatCard } from './components/StatCard';
import { ThreatChart } from './components/ThreatChart';
import { NetworkPacket, Stats } from './types';
import { generateMockPacket, THREAT_COLORS, THREAT_BG_COLORS } from './constants';
import { analyzeThreats } from './services/geminiService';

const App: React.FC = () => {
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<NetworkPacket | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalScanned: 0,
    threatsDetected: 0,
    averageRisk: 0,
    lastUpdate: new Date().toLocaleTimeString()
  });

  const logEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [packets]);

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    
    // Batch generation
    const newPackets = Array.from({ length: 8 }, () => generateMockPacket());
    setPackets(prev => [...prev, ...newPackets].slice(-100));
    
    setIsAnalyzing(true);
    const analyzed = await analyzeThreats(newPackets);
    
    setPackets(prev => {
      const updated = [...prev];
      analyzed.forEach(ap => {
        const idx = updated.findIndex(p => p.id === ap.id);
        if (idx !== -1) updated[idx] = ap;
      });
      return updated;
    });

    // Stats calculation
    setStats(prev => {
      const allPackets = [...packets, ...analyzed];
      const threats = allPackets.filter(p => p.label !== 'normal').length;
      const totalRisk = allPackets.reduce((sum, p) => sum + p.risk_score, 0);
      
      return {
        totalScanned: allPackets.length,
        threatsDetected: threats,
        averageRisk: Math.round(totalRisk / (allPackets.length || 1)),
        lastUpdate: new Date().toLocaleTimeString()
      };
    });

    setIsAnalyzing(false);
    setIsScanning(false);
  };

  const exportToCSV = () => {
    const headers = "id,timestamp,duration,protocol_type,service,flag,src_bytes,dst_bytes,label,risk_score\n";
    const csvRows = packets.map(p => 
      `${p.id},${p.timestamp},${p.duration},${p.protocol_type},${p.service},${p.flag},${p.src_bytes},${p.dst_bytes},${p.label},${p.risk_score}`
    ).join("\n");
    
    const blob = new Blob([headers + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `ids_capture_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getSeverityBadge = (score: number) => {
    if (score > 70) return 'bg-red-500 text-white shadow-lg shadow-red-500/20';
    if (score > 40) return 'bg-orange-500 text-white shadow-lg shadow-orange-500/20';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg shadow-xl"><i className="fas fa-shield-halved"></i></span>
            AEGIS AI <span className="text-blue-500 font-extralight tracking-[0.2em]">INTEL</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">System Active: Monitoring Eth0</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all font-semibold flex items-center gap-2"
          >
            <i className="fas fa-download"></i> EXPORT CSV
          </button>
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-2xl ${
              isScanning 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' 
                : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95 shadow-blue-500/30'
            }`}
          >
            {isScanning ? (
              <><i className="fas fa-satellite-dish animate-spin"></i> INTERCEPTING...</>
            ) : (
              <><i className="fas fa-bolt-lightning"></i> SCAN NETWORK</>
            )}
          </button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Packets" value={stats.totalScanned} icon="fa-network-wired" trend="+12%" trendColor="text-green-400" />
        <StatCard label="Threats Blocked" value={stats.threatsDetected} icon="fa-user-secret" trend="+3%" trendColor="text-red-400" />
        <StatCard label="Avg Risk Score" value={`${stats.averageRisk}%`} icon="fa-bolt" />
        <StatCard label="System Trust" value="99.4%" icon="fa-fingerprint" trendColor="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Logs */}
        <div className="lg:col-span-2 flex flex-col h-[650px]">
          <div className="bg-[#0b1120] border border-slate-700/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col flex-grow relative">
             {/* Terminal Scanline effect */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_4px,3px_100%] z-10"></div>
             
            <div className="bg-slate-800/80 backdrop-blur-md p-4 border-b border-slate-700 flex justify-between items-center z-20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-400 tracking-tighter">/var/log/aegis_ids.log</span>
              </div>
              {isAnalyzing && (
                <span className="text-blue-400 text-xs animate-pulse flex items-center gap-2 font-mono">
                  <i className="fas fa-brain"></i> CORRELATING THREAT DATA...
                </span>
              )}
            </div>
            
            <div className="flex-grow p-0 overflow-y-auto terminal-scroll bg-black/40 z-0">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-sm text-slate-500 text-[10px] font-mono uppercase tracking-widest z-30">
                  <tr>
                    <th className="px-4 py-3 w-24">Timestamp</th>
                    <th className="px-4 py-3 w-20">Svc</th>
                    <th className="px-4 py-3">Vector Information</th>
                    <th className="px-4 py-3 w-16 text-center">Risk</th>
                    <th className="px-4 py-3 w-32">Classification</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[13px]">
                  {packets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-40 text-slate-600 font-mono tracking-widest animate-pulse uppercase">
                         Waiting for network interface traffic...
                      </td>
                    </tr>
                  ) : (
                    packets.map((p) => (
                      <tr 
                        key={p.id} 
                        onClick={() => setSelectedPacket(p)}
                        className={`border-b border-slate-800/30 hover:bg-blue-500/10 cursor-pointer transition-all group ${THREAT_BG_COLORS[p.label]}`}
                      >
                        <td className="px-4 py-3 text-slate-500 text-xs">{p.timestamp}</td>
                        <td className="px-4 py-3">
                           <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-blue-400 text-[9px] uppercase">{p.service}</span>
                        </td>
                        <td className="px-4 py-3 truncate text-slate-400 group-hover:text-slate-200">
                          {p.protocol_type.toUpperCase()} :: LEN:{p.src_bytes} -> DST:{p.dst_bytes} FLAG:{p.flag}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(p.risk_score)}`}>
                            {p.risk_score}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-bold ${THREAT_COLORS[p.label]}`}>
                          <div className="flex items-center gap-2">
                            {p.label.toUpperCase()}
                            {p.label !== 'normal' && <i className="fas fa-triangle-exclamation animate-pulse"></i>}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  <div ref={logEndRef} />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-2xl shadow-xl backdrop-blur-md">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <i className="fas fa-radar text-blue-400"></i>
              Intelligence Hub
            </h3>
            <div className="mb-6">
              <ThreatChart data={packets} />
            </div>
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
               <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Engaged Protocols</h4>
               <div className="flex gap-2 flex-wrap">
                 {['TCP', 'UDP', 'ICMP', 'HTTPS'].map(t => (
                   <span key={t} className="px-2 py-1 rounded-md bg-slate-800 text-[10px] text-slate-400 border border-slate-700">{t}</span>
                 ))}
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-microchip text-indigo-400"></i>
              Aegis Engine Status
            </h3>
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-500 uppercase">Core Model</span>
                <span className="text-indigo-400">Gemini-3-Flash</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-500 uppercase">Latency</span>
                <span className="text-green-400">42ms</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-500 uppercase">Confidence</span>
                <span className="text-blue-400">High (0.92)</span>
              </div>
              <p className="text-slate-500 italic mt-4 leading-relaxed">
                "Engine is currently performing behavioral heuristics on local subnet 10.0.0.*. Behavioral anomalies are cross-referenced with global CVE databases."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPacket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121926] border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
               <div>
                 <h2 className="text-xl font-black text-white">Forensic Investigation</h2>
                 <p className="text-xs text-slate-500 font-mono">Capture ID: {selectedPacket.id}</p>
               </div>
               <button onClick={() => setSelectedPacket(null)} className="text-slate-500 hover:text-white transition-colors">
                 <i className="fas fa-times text-xl"></i>
               </button>
            </div>
            <div className="p-8">
               <div className="grid grid-cols-2 gap-8 mb-8">
                 <div className="space-y-4">
                   <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Metadata</label>
                   <div className="grid grid-cols-1 gap-2 text-sm">
                     <div className="flex justify-between"><span className="text-slate-400">Protocol:</span> <span className="text-white font-mono">{selectedPacket.protocol_type}</span></div>
                     <div className="flex justify-between"><span className="text-slate-400">Service:</span> <span className="text-white font-mono">{selectedPacket.service}</span></div>
                     <div className="flex justify-between"><span className="text-slate-400">Duration:</span> <span className="text-white font-mono">{selectedPacket.duration}ms</span></div>
                     <div className="flex justify-between"><span className="text-slate-400">Flags:</span> <span className="text-white font-mono">{selectedPacket.flag}</span></div>
                   </div>
                 </div>
                 <div className="space-y-4">
                   <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Risk Assessment</label>
                   <div className={`p-4 rounded-2xl flex flex-col items-center justify-center ${THREAT_BG_COLORS[selectedPacket.label]}`}>
                      <span className={`text-3xl font-black ${THREAT_COLORS[selectedPacket.label]}`}>{selectedPacket.risk_score}%</span>
                      <span className="text-[10px] font-bold uppercase opacity-80">Probability Level</span>
                   </div>
                 </div>
               </div>

               <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                 <h4 className="text-blue-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                   <i className="fas fa-robot"></i> Gemini Behavioral Analysis
                 </h4>
                 <p className="text-slate-300 leading-relaxed italic">
                   "{selectedPacket.analysis || "Correlating historical attack patterns with current payload signature... analysis pending."}"
                 </p>
                 {selectedPacket.label !== 'normal' && (
                   <div className="mt-4 flex gap-4">
                     <button className="flex-1 py-3 rounded-xl bg-red-600/20 text-red-400 border border-red-600/30 font-bold hover:bg-red-600/30 transition-all">
                       BLACKLIST IP
                     </button>
                     <button className="flex-1 py-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-600/30 font-bold hover:bg-blue-600/30 transition-all">
                       FALSE POSITIVE
                     </button>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer Disclaimer */}
      <footer className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-600 text-[10px] uppercase tracking-[0.3em] font-mono">
        <p>&copy; 2024 AEGIS CYBERSECURITY SYSTEMS // CLEARANCE LEVEL: ADMIN // AI_ENABLED</p>
      </footer>
    </div>
  );
};

export default App;
