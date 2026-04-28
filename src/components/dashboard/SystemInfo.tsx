import React from "react";
import { Info, Shield, Mail, History, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function SystemInfo() {
  const versionInfo = {
    version: "1.3.ELITE",
    codename: "FSOCIETY_REBORN",
    devStatus: "STABLE_BUILD",
    emails: ["suportekremlin@gmail.com", "developerkremlin@gmail.com"]
  };

  const changelog = [
    { v: "1.3.ELITE", date: "2026-04-28", fixes: ["Full UI Refactor: Neural Dashboard Template", "Enhanced Sidebar with live system telemetry", "Modernized StatCards with buffer metrics", "Redesigned SystemLogs with HUD elements", "WorldMap3D v5.0: Advanced Satellite Link", "CryptoModule v2: AES-GCM 256 Hardened", "Unified Professional OSINT design language"] },
    { v: "1.2", date: "2026-04-26", fixes: ["Nova aba de informações", "Emails de suporte adicionados", "Logs detalhados e animados", "Sistema de busca YouTube Pro", "Novo tema fsociety-dark com background Elliot"] },
    { v: "1.1", date: "2026-04-25", fixes: ["Speed Test integrado", "Correção de builds Electron", "Modo tela cheia", "Painel Hacker v1"] },
    { v: "1.0", date: "2026-04-24", fixes: ["Lançamento inicial", "Controle de clientes", "Integração Supabase"] }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Identity */}
        <div className="bg-[#080808]/80 backdrop-blur-3xl rounded-xl border border-white/5 p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
            <Shield className="h-40 w-40 text-primary" />
          </div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 box-glow-soft">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white/90 italic">Core_Identity</h2>
              <p className="text-[10px] text-primary/40 mt-1 font-mono uppercase tracking-[0.4em]">Build Manifest // Secure_Access</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <InfoItem label="Version_Tag" value={versionInfo.version} color="text-primary" />
            <InfoItem label="Codename" value={versionInfo.codename} />
            <InfoItem label="Dev_Status" value={versionInfo.devStatus} color="text-emerald-500" />
            <div className="pt-4 border-t border-white/5">
               <div className="flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-widest mb-2">
                  <span>Integrity_Check</span>
                  <span className="text-emerald-500">Verified</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{width:0}} animate={{width:"100%"}} className="h-full bg-emerald-500/40" />
               </div>
            </div>
          </div>
        </div>

        {/* Contact Nodes */}
        <div className="bg-[#080808]/80 backdrop-blur-3xl rounded-xl border border-white/5 p-8 relative shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 box-glow-soft">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white/90 italic">Contact_Nodes</h2>
              <p className="text-[10px] text-primary/40 mt-1 font-mono uppercase tracking-[0.4em]">Secure Uplink Channels</p>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            {versionInfo.emails.map((email, idx) => (
              <div key={idx} className="flex items-center gap-5 p-5 rounded-lg bg-white/[0.02] border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
                <div className="p-2.5 rounded bg-black/40 group-hover:bg-primary/20 transition-colors border border-white/5">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{idx === 0 ? "Priority_Support" : "Dev_Liaison"}</p>
                  <p className="text-xs font-black text-white/70 group-hover:text-white transition-colors tracking-wide">{email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Changelog */}
      <div className="bg-[#080808]/80 backdrop-blur-3xl rounded-xl border border-white/5 p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:15px_15px]" />
        <div className="flex items-center gap-4 mb-12 relative z-10">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 box-glow-soft">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white/90 italic">Revision_Logs</h2>
            <p className="text-[10px] text-primary/40 mt-1 font-mono uppercase tracking-[0.4em]">Historical_Patch_Records.dat</p>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          {changelog.map((entry, idx) => (
            <div key={idx} className="relative pl-10 border-l-2 border-white/5 space-y-4 pb-4 last:pb-0 group">
              <div className="absolute left-[-6px] top-0 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,255,65,0.8)] group-hover:scale-125 transition-transform" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-black text-white/90 uppercase tracking-widest border-b border-primary/40 pb-1">Version_{entry.v}</span>
                <span className="text-[10px] font-mono text-white/20 tracking-[0.2em] italic">{entry.date}</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                {entry.fixes.map((fix, i) => (
                  <li key={i} className="flex items-start gap-3 text-[10px] font-mono text-white/40 leading-relaxed hover:text-white/70 transition-colors">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary/40 mt-0.5 shrink-0" />
                    <span className="tracking-wide uppercase">{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, color = "text-white/80" }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex justify-between items-center p-4 rounded-lg bg-white/[0.01] border border-white/5 group hover:bg-white/[0.03] transition-all">
      <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] group-hover:text-white/40 transition-colors">{label}</span>
      <span className={`text-xs font-black tracking-widest ${color}`}>{value.toUpperCase()}</span>
    </div>
  );
}
