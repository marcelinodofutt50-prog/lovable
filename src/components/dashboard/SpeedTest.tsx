import { useState, useEffect } from "react";
import { Activity, Zap, Globe, ArrowDown, ArrowUp, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export function SpeedTest() {
  const [ping, setPing] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);
  const [progress, setTestingProgress] = useState(0);

  const runTest = () => {
    setTesting(true);
    setTestingProgress(0);
    setPing(null);
    setDownload(null);
    setUpload(null);

    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setTestingProgress(p);
      
      if (p === 20) setPing(Math.floor(Math.random() * 50) + 5);
      if (p === 60) setDownload(parseFloat((Math.random() * 500 + 100).toFixed(2)));
      if (p === 90) setUpload(parseFloat((Math.random() * 100 + 20).toFixed(2)));

      if (p >= 100) {
        clearInterval(interval);
        setTesting(false);
      }
    }, 80);
  };

  return (
    <div className="bg-[#080808]/80 backdrop-blur-3xl rounded-xl border border-white/5 overflow-hidden shadow-2xl relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Activity className="h-4 w-4 text-primary" />
             <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">Uplink_Diagnostic</span>
            <span className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.4em]">Node_Alpha // fsociety</span>
          </div>
        </div>
        <button 
          onClick={runTest}
          disabled={testing}
          className="flex items-center gap-2.5 px-5 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-black hover:box-glow transition-all duration-300 disabled:opacity-20"
        >
          {testing ? <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
          {testing ? "Scanning..." : "Audit_Signal"}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <MetricCard 
          icon={<Globe className="h-4 w-4" />} 
          label="Latency" 
          value={ping ? `${ping}ms` : "---"} 
          active={testing && progress < 30}
        />
        <MetricCard 
          icon={<ArrowDown className="h-4 w-4" />} 
          label="Downlink" 
          value={download ? `${download}Mb` : "---"} 
          active={testing && progress >= 30 && progress < 70}
          color="text-emerald-500"
        />
        <MetricCard 
          icon={<ArrowUp className="h-4 w-4" />} 
          label="Uplink" 
          value={upload ? `${upload}Mb` : "---"} 
          active={testing && progress >= 70}
          color="text-amber-500"
        />
      </div>

      {testing && (
        <div className="px-6 pb-6 pt-0 relative z-10">
          <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,65,0.8)]"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
             />
          </div>
        </div>
      )}
      
      <div className="px-6 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center">
         <span className="text-[7px] font-mono text-white/10 uppercase tracking-[0.6em]">Telemetry_Service_Online</span>
         <div className="flex gap-1">
            {[1,2,3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${testing ? 'bg-primary animate-pulse' : 'bg-white/10'}`} style={{animationDelay: `${i*0.2}s`}} />)}
         </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, active, color = "text-primary" }: any) {
  return (
    <div className={`relative group p-4 rounded-lg bg-white/[0.02] border transition-all duration-500 ${active ? 'border-primary/40 bg-primary/5 shadow-2xl' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-1.5 rounded bg-black/40 border border-white/5 ${color} shadow-lg transition-transform duration-500 group-hover:scale-110`}>{icon}</div>
        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-xl font-black font-mono italic tracking-tight ${color} group-hover:text-glow transition-all duration-500`}>{value}</div>
    </div>
  );
}
