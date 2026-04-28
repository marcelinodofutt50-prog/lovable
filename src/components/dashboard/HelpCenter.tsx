import React from "react";
import { Shield, Key, Lock, Globe, Terminal, Info, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function HelpCenter() {
  const guides = [
    {
      title: "Credential Management (AES-GCM)",
      icon: <Lock className="h-5 w-5 text-primary" />,
      content: "All credentials are encrypted locally using the AES-GCM 256-bit algorithm before storage. Your root key is unique to this browser instance.",
      status: "SECURE"
    },
    {
      title: "Theme Personalization",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      content: "Inject custom CSS and JS scripts into the dashboard core. Use the 'Switch Visual Core' button to cycle through 100+ generated variations.",
      status: "ACTIVE"
    },
    {
      title: "External Streaming",
      icon: <Globe className="h-5 w-5 text-blue-500" />,
      content: "Connect remote YouTube streams by pasting direct URLs. The system handles metadata extraction and local playlist caching automatically.",
      status: "CONNECTED"
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Info className="h-3 w-3 text-primary" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">FSOCIETY_HELP_CENTER</span>
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter text-white">System Documentation</h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">v1.3.Elite Infrastructure Overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {guides.map((guide, i) => (
          <motion.div
            key={guide.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="terminal-border group p-6 bg-black/40 backdrop-blur-xl border-white/5 hover:border-primary/20 transition-all cursor-help"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-primary/30 transition-all">
                  {guide.icon}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black italic text-white group-hover:text-primary transition-colors">{guide.title}</h3>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-[8px] font-black text-primary border border-primary/20">{guide.status}</span>
                  </div>
                  <p className="text-xs text-white/40 font-mono leading-relaxed max-w-xl">{guide.content}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
         <div className="flex items-center gap-3 mb-4">
            <Terminal className="h-5 w-5 text-primary" />
            <h4 className="text-sm font-black uppercase tracking-widest text-white">Advanced Cryptography Note</h4>
         </div>
         <p className="text-[11px] font-mono text-white/30 leading-relaxed italic">
            "We don't just store data; we bury it in a mathematical fortress. Your credentials never leave this environment in plaintext. 
            Even our database administrators cannot read your secrets. This is the fSociety standard."
         </p>
      </div>
    </div>
  );
}
