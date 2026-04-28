import React, { useState, useEffect, useRef } from "react";
import { Terminal, Shield, Cpu, Activity, Database, Lock, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogEntry {
  id: string;
  msg: string;
  type: 'info' | 'warn' | 'success' | 'error' | 'security' | 'system';
  timestamp: string;
  detail?: string;
}

export function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messages = [
      { msg: "INITIALIZING_FSOCIETY_REMOTE_v1.3.ELITE", type: 'system', detail: "Kernel 6.1.0-secure-fs" },
      { msg: "ESTABLISHING_VPN_TUNNEL_MULTIHOP", type: 'info', detail: "Nodes: US -> IS -> CH -> RU" },
      { msg: "BYPASSING_INTRUSION_DETECTION_v4", type: 'security', detail: "Ghost Protocol Activated" },
      { msg: "UPLINK_STABLE_ENCRYPTED", type: 'success', detail: "Latency: 12ms // Bandwidth: Unlimited" },
      { msg: "SYNCING_CLIENT_DATABASE", type: 'info', detail: "Loading encrypted clusters..." },
      { msg: "ENCRYPTING_LOCAL_STORAGE", type: 'security', detail: "Cipher: Chacha20-Poly1305" },
      { msg: "SCANNING_FOR_TRACERS", type: 'system', detail: "0 tracers detected in subnet" },
      { msg: "HEARTBEAT_LOCKED", type: 'success', detail: "Core temp: 42°C // OK" },
      { msg: "BRUTE_FORCE_ATTEMPT_BLOCKED", type: 'warn', detail: "Origin: 103.21.244.0 (Cloudflare)" },
      { msg: "INJECTING_SHELLCODE", type: 'security', detail: "Memory address: 0x7ffd9b7f5000" },
      { msg: "UI_OVERLAY_SYNCHRONIZED", type: 'success', detail: "Refresh rate: 144Hz" },
    ];

    let i = 0;
    const addLog = () => {
      if (i < messages.length) {
        const log = messages[i];
        setLogs(prev => [
          ...prev, 
          { 
            id: Math.random().toString(36).substring(2, 9), 
            msg: log.msg, 
            type: log.type as any,
            timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            detail: log.detail
          }
        ].slice(-30));
        i++;
        setTimeout(addLog, 800 + Math.random() * 1500);
      }
    };

    const initialTimeout = setTimeout(addLog, 500);
    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyle = (type: string) => {
    switch(type) {
      case 'success': return { color: 'text-emerald-500', icon: <Activity className="h-3.5 w-3.5" />, bg: 'bg-emerald-500/10' };
      case 'warn': return { color: 'text-amber-500', icon: <Database className="h-3.5 w-3.5" />, bg: 'bg-amber-500/10' };
      case 'error': return { color: 'text-rose-600', icon: <Globe className="h-3.5 w-3.5" />, bg: 'bg-rose-500/10' };
      case 'security': return { color: 'text-primary', icon: <Shield className="h-3.5 w-3.5" />, bg: 'bg-primary/10' };
      case 'system': return { color: 'text-blue-500', icon: <Cpu className="h-3.5 w-3.5" />, bg: 'bg-blue-500/10' };
      default: return { color: 'text-white/40', icon: <Terminal className="h-3.5 w-3.5" />, bg: 'bg-white/5' };
    }
  };

  return (
    <div className="h-full flex flex-col rounded-xl bg-[#080808]/80 backdrop-blur-3xl border border-white/5 overflow-hidden shadow-2xl relative">
      {/* Background HUD pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Terminal className="h-4 w-4 text-primary" />
             <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">System_Telemetry</span>
            <span className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.4em]">Node_Alpha // fsociety</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Active_PID: 8122</span>
           </div>
           <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-rose-500/20" />
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           </div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-6 font-mono text-[11px] space-y-4 overflow-y-auto custom-scrollbar relative z-10"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => {
            const style = getLogStyle(log.type);
            return (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="group relative flex flex-col gap-1.5 border-l-2 border-white/5 hover:border-primary/40 pl-4 py-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/10 shrink-0 text-[9px] font-bold tracking-tighter">[{log.timestamp}]</span>
                  <div className={`flex items-center gap-2.5 px-3 py-1 rounded-md ${style.bg} border border-white/5 transition-colors group-hover:border-primary/20`}>
                    <div className={style.color}>{style.icon}</div>
                    <span className={`${style.color} font-black tracking-widest uppercase text-[10px]`}>
                      {log.msg}
                    </span>
                  </div>
                </div>
                {log.detail && (
                  <div className="flex items-center gap-2 pl-6">
                    <span className="text-primary/20 font-bold">└─</span>
                    <span className="text-white/30 italic text-[10px] tracking-wide">
                      {log.detail}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Dynamic CLI cursor */}
        <div className="flex items-center gap-3 pl-4 py-1 border-l-2 border-primary/20">
          <span className="text-white/10 text-[9px] font-bold tracking-tighter">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
          <div className="flex items-center gap-2">
            <span className="text-primary font-black animate-pulse">#_</span>
            <span className="text-white/5 text-[9px] uppercase tracking-[0.4em] font-mono italic animate-pulse">Waiting_Input...</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-white/5 bg-black/40 text-[9px] flex justify-between items-center text-white/20 font-mono relative z-10">
        <div className="flex gap-6 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
            <span>Buffer: <span className="text-white/40">12.4GB</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
            <span>Downlink: <span className="text-white/40">942.1 MBPS</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-3 w-3 opacity-20" />
          <span className="animate-pulse tracking-[0.3em]">SECURE_V3_ENCRYPTION_ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
