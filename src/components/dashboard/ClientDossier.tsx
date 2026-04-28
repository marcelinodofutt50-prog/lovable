import React from "react";
import { motion } from "framer-motion";
import { 
  X, User, Shield, Calendar, CreditCard, 
  MapPin, Activity, Fingerprint, Globe, Terminal, 
  ShoppingBag, ClipboardList, Zap, FileText, Download
} from "lucide-react";
import { Client } from "@/types/client";

interface ClientDossierProps {
  client: Client;
  onClose: () => void;
}

export function ClientDossier({ client, onClose }: ClientDossierProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-4 overflow-y-auto" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#080808]/90 border border-white/5 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
        
        {/* Sidebar Profile Area */}
        <div className="w-full md:w-80 bg-white/[0.01] border-r border-white/5 p-10 flex flex-col items-center relative z-10">
          <div className="relative mb-8">
            <div className="w-40 h-40 rounded-xl border border-primary/20 bg-black p-1 box-glow-soft">
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-scanline-gradient animate-scanline opacity-[0.05]" />
                <User className="h-20 w-20 text-primary/40 group-hover:text-primary transition-all duration-700" />
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-primary/20 border border-primary/40 p-2.5 rounded-lg backdrop-blur-xl animate-pulse">
              <Fingerprint className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{client.name || "Anonymous_Node"}</h2>
            <div className="flex items-center justify-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               <span className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.4em]">{client.subscription_type || "Class_Undefined"}</span>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            <DossierStat label="Auth_Level" value={client.paid ? "Authorized" : "Awaiting"} active={client.paid} />
            <DossierStat label="Neural_Link" value={client.yaarsa_synced ? "Active" : "Offline"} active={client.yaarsa_synced} />
            <DossierStat label="Sector" value={client.server_info || "Isolated"} active={!!client.server_info} />
          </div>
          
          <div className="mt-auto w-full pt-10">
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
               <span className="text-[8px] font-mono text-white/10 uppercase tracking-[0.5em] block">Node_Fingerprint</span>
               <div className="text-[9px] font-mono text-white/30 break-all leading-tight italic truncate uppercase">0x{btoa(client.id || "0").slice(0, 48)}</div>
            </div>
          </div>
        </div>

        {/* Main Intelligence Content */}
        <div className="flex-1 p-10 overflow-y-auto max-h-[85vh] custom-scrollbar relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <FileText className="h-4 w-4 text-primary" />
                 <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Subject_Dossier</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.6em]">Classification: Restricted // Internal_Core_Log</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-lg border border-white/5 transition-all group">
              <X className="h-6 w-6 text-white/20 group-hover:text-white" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                 <Globe className="h-4 w-4 text-primary/40" />
                 <h3 className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em]">Identity_Matrix</h3>
              </div>
              <div className="space-y-4">
                <InfoRow label="Email_Node" value={client.email} />
                <InfoRow label="Contact_Zap" value={client.whatsapp || "Not_Assigned"} />
                <InfoRow label="Initialization" value={client.created_at ? new Date(client.created_at).toLocaleDateString() : "Pending"} />
                <InfoRow label="Expiration" value={client.due_date ? new Date(client.due_date).toLocaleDateString() : "Never"} />
                <InfoRow label="Physical_Origin" value={client.server_info || "Global_Uplink"} />
              </div>

            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                 <CreditCard className="h-4 w-4 text-primary/40" />
                 <h3 className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em]">Resource_Flow</h3>
              </div>
              <div className="space-y-4">
                <InfoRow label="Total_Ledger" value={`R$ ${Number(client.amount ?? 0).toFixed(2)}`} highlight />
                <InfoRow label="Subscription" value={client.subscription_type || "Standard"} />
                <InfoRow label="Protocol_State" value={client.paid ? "Full_Access" : "Restricted"} />
                <InfoRow label="Priority_Bit" value={Number(client.amount ?? 0) > 200 ? "Level_01" : "Level_02"} />
              </div>
            </section>
          </div>

          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                 <Terminal className="h-4 w-4 text-primary/40" />
                 <h3 className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em]">Encryption_Notes & Meta</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {client.notes ? (
                  <div className="p-6 rounded-lg bg-red-600/5 border border-red-600/20 relative group">
                    <span className="text-[9px] font-black text-red-500/60 uppercase tracking-[0.4em] block mb-3 italic">{">>"} Decrypted_Observer_Notes</span>
                    <p className="text-[11px] font-mono text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">"{client.notes}"</p>
                    <div className="absolute top-0 right-0 p-3 opacity-10"><Zap className="h-4 w-4" /></div>
                  </div>
               ) : (
                  <div className="p-6 rounded-lg border border-dashed border-white/5 text-center">
                    <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">No observer notes in cluster</span>
                  </div>
               )}
               {client.additional_info && (
                  <div className="p-6 rounded-lg bg-primary/5 border border-primary/10 group">
                    <span className="text-[9px] font-black text-primary/60 uppercase tracking-[0.4em] block mb-3 italic">{">>"} Telemetry_Stream</span>
                    <p className="text-[11px] font-mono text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">"{client.additional_info}"</p>
                  </div>
               )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-3 py-4 rounded-lg bg-primary text-black font-black uppercase tracking-[0.3em] text-[10px] hover:box-glow transition-all duration-500">
                <Download className="h-4 w-4" /> Generate_Intelligence_Report
             </button>
             <button onClick={onClose} className="py-4 rounded-lg border border-white/10 bg-white/[0.02] text-white/40 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white hover:bg-white/5 transition-all duration-500">
                Close_Interface
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DossierStat({ label, value, active }: any) {
  return (
    <div className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-black/40 border border-white/5 group hover:border-primary/20 transition-all duration-500">
      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest group-hover:text-white/40">{label}</span>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? "text-primary text-glow-soft" : "text-amber-500"}`}>{value}</span>
    </div>
  );
}

function InfoRow({ label, value, highlight = false }: any) {
  return (
    <div className="flex items-center justify-between group py-1">
      <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">{label}</span>
      <span className={`text-[11px] font-mono ${highlight ? 'text-primary font-black tracking-widest' : 'text-white/70'} group-hover:text-white transition-colors`}>{value || "Empty"}</span>
    </div>
  );
}
