import React from "react";
import { 
  LayoutDashboard, Music, Settings, LogOut, Cpu, Shield, 
  Terminal, Globe, Activity, Database, Zap, Info, Bell, ShieldCheck, HelpCircle
} from "lucide-react";
import { NavItem } from "./NavItem";
import { useTheme } from "@/components/ThemeContext";
import { useNotifications } from "@/components/NotificationContext";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: "dashboard" | "logs" | "music" | "settings" | "info") => void;
  onLogout: () => void;
  version?: string;
  clients?: any[];
}


export function Sidebar({ activeTab, setActiveTab, onLogout, version = "1.0", clients = [] }: SidebarProps) {
  const { theme, setTheme, themes, categories, language, setLanguage, t } = useTheme();
  const { unreadCount } = useNotifications();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-[#080808]/90 backdrop-blur-2xl z-40 transition-all duration-500 ease-in-out">
      {/* Branding Section */}
      <div className="p-6 mb-2">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center box-glow-soft group-hover:bg-primary/20 transition-all duration-300">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-widest text-white uppercase italic">FSOCIETY</span>
            <span className="text-[8px] font-mono text-primary/60 tracking-[0.3em] uppercase">Security Core</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-2 mb-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Navigation</div>
          <SidebarLink 
            icon={<LayoutDashboard className="h-4 w-4" />} 
            label={t.dashboard} 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
          />
          <SidebarLink 
            icon={<Terminal className="h-4 w-4" />} 
            label={t.logs} 
            active={activeTab === "logs"} 
            onClick={() => setActiveTab("logs")} 
          />
          <SidebarLink 
            icon={<Globe className="h-4 w-4" />} 
            label={t.info} 
            active={activeTab === "info"} 
            onClick={() => setActiveTab("info")} 
          />
          <SidebarLink 
            icon={<Music className="h-4 w-4" />} 
            label={t.music} 
            active={activeTab === "music"} 
            onClick={() => setActiveTab("music")} 
          />
        </div>

        {/* System Stats Section */}
        <div className="space-y-4">
          <div className="px-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">System Status</div>
          <div className="px-2 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-white/40 uppercase">Processor Load</span>
                <span className="text-primary">42%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{width:0}} animate={{width: "42%"}} className="h-full bg-primary box-glow-soft" />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Categories */}
        <div className="space-y-4">
          <div className="px-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Themes</div>
          <div className="px-1 space-y-1">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="px-2 py-1 text-[8px] font-mono text-primary/40 uppercase tracking-widest">{t[cat.nameKey]}</div>
                <div className="flex flex-wrap gap-1 px-1">
                  {cat.themes.map((th) => (
                    <button
                      key={th}
                      onClick={() => setTheme(th)}
                      className={`w-6 h-6 rounded border transition-all ${theme === th ? 'border-primary scale-110 shadow-[0_0_8px_rgba(0,255,65,0.5)]' : 'border-white/10 hover:border-white/30'}`}
                      style={{ backgroundColor: getThemeColor(th) }}
                      title={th}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <div className="px-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Language</div>
          <div className="flex gap-2 px-2">
            {(["pt", "en", "es"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 text-[8px] font-mono rounded border transition-all ${language === lang ? 'bg-primary text-black border-primary font-bold' : 'text-white/40 border-white/10 hover:border-white/30'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
        <div className="flex items-center justify-between gap-2">
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center justify-center p-2.5 transition-all rounded-lg ${activeTab === "settings" ? "text-primary bg-primary/10" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            title={t.settings}
          >
            <Settings className="h-4 w-4" />
          </button>
          
          <button 
            onClick={onLogout} 
            className="flex items-center justify-center p-2.5 text-red-500/40 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg w-full gap-2 group"
            title={t.logout}
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t.logout}</span>
          </button>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <span className="text-[7px] font-mono text-white/10 tracking-[0.4em] uppercase">Build Secure v{version}</span>
        </div>
      </div>
    </aside>
  );
}

function getThemeColor(th: string) {
  if (th.includes("fsociety") || th.includes("robot") || th.includes("blood")) return "#ef4444";
  if (th.includes("matrix") || th.includes("system") || th.includes("kali")) return "#10b981";
  if (th.includes("cyber") || th.includes("cyan") || th.includes("osint")) return "#06b6d4";
  if (th.includes("white")) return "#ffffff";
  if (th.includes("joker") || th.includes("neon")) return "#8b5cf6";
  return "#333";
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative ${active ? 'text-primary' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
      <div className={`relative transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
        {active && <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md" />}
      </div>
      <span className="text-[11px] font-bold tracking-wider uppercase">{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(0,255,65,0.8)]"
        />
      )}
    </button>
  );
}

