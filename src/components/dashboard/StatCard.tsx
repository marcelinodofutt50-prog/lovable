import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "primary" | "green" | "yellow" | "blue";
}

export function StatCard({ icon, label, value, accent = "primary" }: StatCardProps) {
  const getAccentColors = () => {
    switch (accent) {
      case "green": return { text: "text-emerald-500", border: "border-emerald-500/20", bg: "bg-emerald-500/5", glow: "rgba(16, 185, 129, 0.4)" };
      case "yellow": return { text: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/5", glow: "rgba(245, 158, 11, 0.4)" };
      case "blue": return { text: "text-blue-500", border: "border-blue-500/20", bg: "bg-blue-500/5", glow: "rgba(59, 130, 246, 0.4)" };
      default: return { text: "text-primary", border: "border-primary/20", bg: "bg-primary/5", glow: "rgba(0, 255, 65, 0.4)" };
    }
  };

  const colors = getAccentColors();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative group bg-[#0a0a0a]/40 backdrop-blur-xl border ${colors.border} p-6 rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl`}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
      
      {/* Animated corner accents */}
      <div className={`absolute top-0 left-0 w-8 h-[1px] ${accent === 'primary' ? 'bg-primary' : colors.text.replace('text-', 'bg-')} opacity-20 group-hover:opacity-100 group-hover:w-full transition-all duration-700`} />
      <div className={`absolute top-0 left-0 w-[1px] h-8 ${accent === 'primary' ? 'bg-primary' : colors.text.replace('text-', 'bg-')} opacity-20 group-hover:opacity-100 group-hover:h-full transition-all duration-700`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-2.5 rounded-lg ${colors.bg} border ${colors.border} box-glow-soft group-hover:scale-110 transition-transform duration-500`}>
            <div className={`${colors.text}`}>{icon}</div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-white/10 uppercase tracking-[0.4em] mb-1">Index_Trace</span>
            <div className={`w-8 h-1 ${accent === 'primary' ? 'bg-primary' : colors.text.replace('text-', 'bg-')} opacity-20 rounded-full group-hover:opacity-60 transition-opacity`} />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">{label}</span>
          <div className="flex items-baseline gap-2">
             <span className={`text-3xl font-black italic tracking-tighter ${colors.text} group-hover:text-glow transition-all duration-500`}>
               {value}
             </span>
             <span className="text-[10px] font-mono text-white/20 animate-pulse">●</span>
          </div>
        </div>

        <div className="mt-auto pt-6">
           <div className="flex justify-between items-end mb-2">
              <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">Buffer_Utilization</span>
              <span className={`text-[9px] font-mono ${colors.text} opacity-60`}>0x{Math.floor(Math.random()*100)}%</span>
           </div>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${40 + Math.random()*40}%` }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className={`h-full ${accent === 'primary' ? 'bg-primary' : colors.text.replace('text-', 'bg-')} shadow-[0_0_10px_${colors.glow}]`}
             />
           </div>
        </div>
      </div>
      
      {/* Glow effect on hover */}
      <div className={`absolute -inset-20 bg-[radial-gradient(circle_at_center,${colors.glow}_0%,transparent_70%)] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`} />
    </motion.div>
  );
}
