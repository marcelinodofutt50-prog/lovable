import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

import { CyberBackground } from "@/components/CyberBackground";
import { useTheme } from "@/components/ThemeContext";
import { HackerScript } from "@/components/HackerScript";
import { YouTubePlayer } from "@/components/YouTubePlayer";

import { SpeedTest } from "@/components/dashboard/SpeedTest";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Eye, EyeOff, KeyRound, LogOut, Pencil, Search, Server,
  Trash2, Users, CheckCircle2, XCircle, DollarSign, Terminal, Loader2,
  Lock, Shield, ChevronRight, Filter, Download, Zap, Database, Maximize2, Minimize2, Info, Bell, ShieldCheck, HelpCircle,
  Settings, Globe
} from "lucide-react";

import { Client } from "@/types/client";

// New Dashboard Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { SystemLogs } from "@/components/dashboard/SystemLogs";
import { ClientModal } from "@/components/dashboard/ClientModal";
import { SystemInfo } from "@/components/dashboard/SystemInfo";
import { Notifications } from "@/components/dashboard/Notifications";
import { CryptoTools } from "@/components/dashboard/CryptoTools";
import { useNotifications } from "@/components/NotificationContext";
import { HelpCenter } from "@/components/dashboard/HelpCenter";
import { WorldMap3D } from "@/components/dashboard/WorldMap3D";
import { ClientDossier } from "@/components/dashboard/ClientDossier";
import { toast } from "sonner";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center // FSOCIETY REMOTE" },
      { name: "description", content: "Professional Hacker Dashboard v1.3.Elite" },
    ],
  }),
  component: Dashboard,
});

const VERSION = "1.3.Elite";

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme, setTheme, themes, isAuthenticating: contextAuthenticating } = useTheme();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<"dashboard" | "logs" | "music" | "settings" | "info">("dashboard");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [modal, setModal] = useState<null | { mode: "create" } | { mode: "edit"; c: Client }>(null);
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [commandOpen, setCommandOpen] = useState(false);
  const [dossier, setDossier] = useState<Client | null>(null);
  const [easterEggName, setEasterEggName] = useState("FSOCIETY_REMOTE");
  const [ipInfo, setIpInfo] = useState<{ip:string, city:string, country:string, org?: string} | null>(null);
  const [hasBypass, setHasBypass] = useState(false);

  useEffect(() => {
    setHasBypass(localStorage.getItem("fsociety_bypass") === "true");
  }, []);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setIpInfo({ ip: data.ip, city: data.city, country: data.country_name, org: data.org });
      } catch (e) {
        setIpInfo({ ip: "127.0.0.1", city: "Localhost", country: "VPN_TUNNEL" });
      }
    };
    fetchIp();
  }, []);

  useEffect(() => {
    const names = ["FSOCIETY_REMOTE", "MR_ROBOT", "CONTROL_ILLUSION", "ELLIOT_ALDRICH", "DARK_ARMY", "WHITE_ROSE"];
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setEasterEggName(names[Math.floor(Math.random() * names.length)]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
      if (e.key === "/") {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          setCommandOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    // Session Guard: Always verify Supabase session AND current route
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isBypass = localStorage.getItem("fsociety_bypass") === "true";
      
      // If we are still in the middle of authentication animation, don't kick out
      if (contextAuthenticating) return;

      if (!authLoading && !session && !isBypass) {
        navigate({ to: "/login", replace: true });
      }
    };
    
    checkSession();
  }, [authLoading, user, navigate, contextAuthenticating, hasBypass]);


  const fetchClients = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setClients(data as Client[]);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchClients(); }, [user]);

  const stats = useMemo(() => {
    const total = clients.length;
    const paid = clients.filter((c) => c.paid).length;
    const pending = total - paid;
    const revenue = clients.filter((c) => c.paid).reduce((s, c) => s + Number(c.amount ?? 0), 0);
    return { total, paid, pending, revenue };
  }, [clients]);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter((c) => {
      if (filter === "paid" && !c.paid) return false;
      if (filter === "pending" && c.paid) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) ||
             (c.server_info ?? "").toLowerCase().includes(q);
    });
  }, [clients, search, filter]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  const togglePaid = async (c: Client) => {
    const next = !c.paid;
    const { error } = await supabase.from("clients").update({ paid: next }).eq("id", c.id);
    if (!error) {
      setClients((cs) => cs.map((x) => (x.id === c.id ? { ...x, paid: next } : x)));
      addNotification(
        next ? "PAGAMENTO_AUTORIZADO" : "PAGAMENTO_REVERTIDO",
        `Status de ${c.name} alterado para ${next ? 'AUTHORIZED' : 'PENDING'}.`,
        next ? "success" : "warn"
      );
    }
  };

  const handleDelete = async (c: Client) => {
    if (!confirm(`Confirm entity termination: "${c.name}"?`)) return;
    const { error } = await supabase.from("clients").delete().eq("id", c.id);
    if (!error) {
      setClients((cs) => cs.filter((x) => x.id !== c.id));
      addNotification("ENTIDADE_TERMINADA", `O registro de ${c.name} foi removido do banco de dados.`, "security");
    }
  };

  // Optimized loading: if we have bypass or user, show UI immediately
  const isLoading = authLoading && !user && !hasBypass;
  
  if (isLoading || contextAuthenticating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black overflow-hidden relative">
        <CyberBackground type={theme} loadingProgress={isLoading ? 50 : 100} />
        <div className="relative w-80 h-80 z-10 group">
          <div className="absolute -inset-12 bg-gradient-to-r from-red-600 via-primary to-blue-600 rounded-full opacity-40 blur-3xl animate-[spin_6s_linear_infinite]" />
          
          <div className="relative w-full h-full rounded-full border-4 border-white/10 overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] bg-black/90 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-full h-full"
            >
              <img 
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzZmMzR4aTBja2xiZ2wwMGhmYjRlZGRka3EybG53anc0b2Vlemw0YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohs4CacylzFaHjMM8/giphy.gif"
                alt="Loading..."
                className="w-full h-full object-cover grayscale brightness-50 mix-blend-screen"
              />
            </motion.div>
            <div className="absolute inset-0 bg-scanline-gradient animate-scanline opacity-20 pointer-events-none" />
          </div>
          
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 text-center">
            <div className="text-[10px] font-mono text-primary animate-pulse uppercase tracking-[0.5em] mb-2">
              Stabilizing_Quantum_Link...
            </div>
            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 className="h-full bg-primary shadow-[0_0_10px_#00ff41]" 
               />
            </div>
          </div>
        </div>
      </div>
    );
  }



  console.log("Dashboard: Rendering UI principal", { activeTab, theme });

  return (
    <div 
      className="relative min-h-screen flex bg-[#050505] text-white selection:bg-primary selection:text-black overflow-hidden"
    >
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 grayscale transition-opacity duration-1000"
        style={{ backgroundImage: "url('https://i.pinimg.com/originals/c8/55/96/c85596395b08492f15325605d8f76a51.jpg')" }}
      />
      
      
      {/* Joker / Mascote Background Layer */}
      <div className="joker-mask-bg" />

      {/* Dynamic Backgrounds */}
      <AnimatePresence mode="wait">
        <CyberBackground key={theme} type={theme} />
      </AnimatePresence>

      <Sidebar 
        activeTab={activeTab as any} 
        setActiveTab={setActiveTab as any} 
        onLogout={handleLogout} 
        version={VERSION}
        clients={clients}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-50">
        <div className="absolute inset-0 bg-[#050505]/40 backdrop-blur-md" />
        <div className="absolute inset-0 pointer-events-none z-[100] border-[15px] border-white/[0.02]" />
        <div className="absolute inset-0 pointer-events-none z-[100] bg-scanline-gradient animate-scanline opacity-[0.015]" />
        
        {/* Floating Easter Egg References */}
        <motion.div 
          animate={{ opacity: [0.03, 0.08, 0.03], x: [0, 15, 0], y: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-1/4 right-10 pointer-events-none text-[80px] font-serif select-none -rotate-12 z-0 tracking-[0.2em]"
        >
          {easterEggName}
        </motion.div>
        <motion.div 
          animate={{ opacity: 0, scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 left-10 pointer-events-none text-[60px] font-mono select-none rotate-6 z-0"
        >
          10.10.10.1
        </motion.div>
        <div className="absolute bottom-10 right-1/4 pointer-events-none opacity-[0.05] text-[18px] font-mono select-none z-0 hover:opacity-80 transition-opacity cursor-default">
          "The world is a dangerous place, Elliot, not because of those who do evil, but because of those who look on and do nothing."
        </div>

        <DashboardHeader 
          userEmail={user?.email || ""} 
          onNewRecord={() => setModal({ mode: "create" })} 
          search={search}
          onSearchChange={setSearch}
          version={VERSION}
        />

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
            {/* Professional Top Globe */}
            <div className="w-full mb-8">
               <div className="h-[250px] w-full rounded-xl overflow-hidden border border-white/5 bg-black/40 backdrop-blur-xl relative">
                  <WorldMap3D />
                  {ipInfo && (
                    <div className="absolute top-4 right-4 z-20 font-mono text-[9px] text-primary/60 bg-black/80 p-2 border border-primary/20 rounded-lg backdrop-blur-md">
                      <div>IP: {ipInfo.ip}</div>
                      <div>LOC: {ipInfo.city}, {ipInfo.country}</div>
                      <div>ISP: {ipInfo.org}</div>
                    </div>
                  )}
               </div>
            </div>

            <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${activeTab === 'music' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <YouTubePlayer />
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "logs" && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-[calc(100vh-450px)]"
                >
                   <SystemLogs />
                </motion.div>
              )}

              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="grid grid-cols-1 xl:grid-cols-4 gap-6 relative z-10"
                >
                  <div className="xl:col-span-4 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon={<Users className="h-4 w-4" />} label="Total Entidades" value={stats.total.toString()} />
                      <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Status Pago" value={stats.paid.toString()} accent="green" />
                      <StatCard icon={<XCircle className="h-4 w-4" />} label="Pendentes" value={stats.pending.toString()} accent="yellow" />
                      <StatCard icon={<DollarSign className="h-4 w-4" />} label="Receita Bruta" value={`R$ ${stats.revenue.toFixed(2)}`} accent="primary" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#0a0a0a]/60 p-6 rounded-xl border border-white/5 backdrop-blur-3xl relative overflow-hidden group/header shadow-2xl">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/header:opacity-100 transition-opacity pointer-events-none duration-700" />
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md">
                          <Filter className="h-4 w-4 text-primary" />
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Query_Filter:</span>
                          <div className="flex gap-2">
                            {(["all", "paid", "pending"] as const).map((f) => (
                              <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filter === f ? "bg-primary text-black shadow-[0_0_15px_rgba(0,255,65,0.6)]" : "text-white/20 hover:text-white/60 hover:bg-white/5"}`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 relative z-10">
                         <div className="text-[9px] font-mono text-white/10 uppercase tracking-[0.4em] mr-4 hidden md:block">Active_Buffer: {visible.length} Clusters</div>
                         <button className="flex items-center gap-3 px-6 py-2.5 rounded-lg border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-500 group/btn">
                           <Download className="h-4 w-4 group-hover/btn:animate-bounce" /> Export_Ledger
                         </button>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl bg-[#080808]/80 backdrop-blur-3xl border border-white/5 group/table shadow-2xl">
                      {/* Scanline and pattern effects */}
                      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
                      <div className="absolute inset-0 bg-scanline-gradient animate-scanline opacity-[0.02] pointer-events-none" />
                      
                      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.01] relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                             <Database className="h-4 w-4 text-primary" />
                             <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full animate-pulse" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">Client_Ledger_v1.3</span>
                            <span className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.4em]">Sector: encrypted // clusters: {visible.length}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                             <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest">System_Synchronized</span>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                          <thead className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 bg-white/[0.01]">
                            <tr>
                              <th className="px-8 py-5">Entity_Identifier</th>
                              <th className="px-8 py-5">Network_Node</th>
                              <th className="px-8 py-5">Uplink_Status</th>
                              <th className="px-8 py-5">Secure_Key</th>
                              <th className="px-8 py-5 text-right">Ledger_Value</th>
                              <th className="px-8 py-5 text-center">Dossier</th>
                              <th className="px-8 py-5 text-center">Control</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                              <tr>
                                <td colSpan={7} className="px-6 py-20 text-center">
                                  <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">Querying Data...</span>
                                  </div>
                                </td>
                              </tr>
                            ) : visible.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="px-6 py-20 text-center">
                                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">[!] NO_RECORDS_FOUND_IN_NAMESPACE</span>
                                </td>
                              </tr>
                            ) : (
                              visible.map((c) => (
                                <tr key={c.id} className="group/row hover:bg-white/[0.02] transition-all duration-300">
                                  <td className="px-8 py-5">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-sm font-black text-white/80 group-hover/row:text-primary transition-all tracking-tight">{c.name || "Anonymous_Node"}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-primary/40" />
                                        <span className="text-[9px] font-mono text-white/20 group-hover/row:text-white/40 uppercase tracking-widest">{c.email}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                      <div className="p-1.5 rounded bg-white/5 border border-white/5">
                                        <Server className="h-3.5 w-3.5 text-white/20 group-hover/row:text-primary transition-colors" />
                                      </div>
                                      <span className="text-[10px] font-mono text-white/40 tracking-[0.1em]">{c.server_info || "ISOLATED_NODE"}</span>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <button
                                      onClick={() => togglePaid(c)}
                                      className={`flex items-center gap-2.5 px-4 py-1.5 rounded-md border text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                                        c.paid 
                                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:bg-emerald-500 hover:text-black" 
                                          : "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black"
                                      }`}
                                    >
                                      <div className={`h-1.5 w-1.5 rounded-full ${c.paid ? 'bg-emerald-500 group-hover/row:bg-black' : 'bg-amber-500 group-hover/row:bg-black'} animate-pulse`} />
                                      {c.paid ? "Authorized" : "Awaiting"}
                                    </button>
                                  </td>
                                  <td className="px-8 py-5 font-mono text-xs">
                                    <div className="flex items-center gap-3 text-white/20 group/pass bg-white/[0.02] px-3 py-1.5 rounded-md border border-white/5 w-fit">
                                      <Lock className="h-3 w-3 opacity-40 group-hover/pass:text-primary transition-colors" />
                                      <span className="blur-[4px] group-hover/pass:blur-0 transition-all duration-500 cursor-help tracking-widest">{c.password || "********"}</span>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5 text-right font-mono text-xs font-black">
                                    <span className="text-primary tracking-widest drop-shadow-[0_0_8px_rgba(0,255,65,0.3)]">R$ {Number(c.amount ?? 0).toFixed(2)}</span>
                                  </td>
                                  <td className="px-8 py-5 text-center">
                                    <button 
                                      onClick={() => setDossier(c)}
                                      className="p-2.5 rounded-lg border border-white/5 hover:border-primary/40 text-white/20 hover:text-primary transition-all duration-300 hover:bg-primary/10"
                                      title="Open Dossier"
                                    >
                                      <Eye className="h-4.5 w-4.5" />
                                    </button>
                                  </td>
                                  <td className="px-8 py-5 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                      <button 
                                        onClick={() => setModal({ mode: "edit", c })}
                                        className="p-2.5 rounded-lg border border-white/5 hover:border-blue-500/40 text-white/20 hover:text-blue-500 transition-all duration-300 hover:bg-blue-500/10"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(c)}
                                        className="p-2.5 rounded-lg border border-white/5 hover:border-red-500/40 text-white/20 hover:text-red-500 transition-all duration-300 hover:bg-red-500/10"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Notifications />
                    <CryptoTools />
                    <SpeedTest />
                    <WorldMap3D />
                  </div>
                </motion.div>
              )}

              {/* Tabs for logs removed from here as they were moved to top of AnimatePresence */}

              {activeTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-5xl mx-auto relative z-10"
                >
                  <SystemInfo />
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="max-w-4xl mx-auto relative z-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl terminal-border">
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-primary italic uppercase tracking-[0.2em] flex items-center gap-3">
                        <Settings className="h-5 w-5" /> Node_Configuration
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Visual_Protocol (Theme)</label>
                          <select 
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as any)}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 focus:border-primary outline-none transition-all appearance-none"
                          >
                            {themes.map(t => <option key={t} value={t}>{t.replace(/-/g, ' ').toUpperCase()}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-primary italic uppercase tracking-[0.2em] flex items-center gap-3">
                        <Globe className="h-5 w-5" /> Language_Overlay
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {["English (US)", "Português (BR)", "Español", "Русский", "中文", "日本語", "Deutsch", "Français"].map(lang => (
                          <button
                            key={lang}
                            onClick={() => toast.info(`Language protocol updated to: ${lang}`)}
                            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all text-left flex justify-between items-center"
                          >
                            {lang}
                            {lang.includes("BR") && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00ff41]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          
          {/* Integrated CMD/Network sidebar */}
          <HackerScript />
        </div>
        
        <footer className="px-8 py-3 border-t border-white/5 bg-black/80 backdrop-blur-md flex items-center justify-between text-[9px] font-mono font-black uppercase tracking-[0.4em] text-white/20">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> SESSION_ENCRYPTED</span>
            <span className="flex items-center gap-2 group/footer"><div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> NODE_STABLE <span className="hidden group-hover/footer:inline text-[7px] ml-2 text-primary/40 opacity-0 group-hover/footer:opacity-100 transition-opacity">0x4F53494E54</span></span>
          </div>
          <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-help group/ver">
            <ChevronRight className="h-3 w-3 group-hover/ver:translate-x-1 transition-transform" /> FSOCIETY_SYSTEM_v{VERSION}
          </div>
        </footer>
      </div>


      <AnimatePresence>
        {modal && (
          <ClientModal
            ownerId={user?.id || ""}
            initial={modal.mode === "edit" ? modal.c : null}
            onClose={() => setModal(null)}
            onSaved={(c, isNew) => {
              setClients((cs) => isNew ? [c, ...cs] : cs.map((x) => (x.id === c.id ? c : x)));
              addNotification(
                isNew ? "ENTIDADE_CRIADA" : "ENTIDADE_ATUALIZADA",
                `O registro de ${c.name} foi ${isNew ? 'inicializado' : 'atualizado'} com sucesso.`,
                "success"
              );
              setModal(null);
            }}
          />
        )}
      </AnimatePresence>

      <CommandMenu isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
      
      <AnimatePresence>
        {dossier && (
          <ClientDossier client={dossier} onClose={() => setDossier(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CommandMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [cmd, setCmd] = useState("");
  const { setTheme, themes } = useTheme();

  if (!isOpen) return null;

  const handleCmd = (e: React.FormEvent) => {
    e.preventDefault();
    const c = cmd.toLowerCase().trim();
    if (c.startsWith("theme ")) {
      const t = c.split(" ")[1];
      if (themes.includes(t as any)) setTheme(t as any);
    } else if (c === "exit" || c === "quit") {
      onClose();
    }
    setCmd("");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[#0a0a0a] border border-primary/20 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleCmd} className="flex items-center p-4 gap-4">
          <Terminal className="h-5 w-5 text-primary" />
          <input 
            autoFocus
            value={cmd}
            onChange={e => setCmd(e.target.value)}
            placeholder="Comando... (theme [name], exit)"
            className="flex-1 bg-transparent border-none outline-none text-primary font-mono text-sm placeholder:text-primary/20"
          />
          <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white/20 font-mono">ESC</kbd>
        </form>
      </motion.div>
    </div>
  );
}
