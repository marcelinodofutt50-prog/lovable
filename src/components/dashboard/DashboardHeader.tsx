import React, { useState, useEffect } from "react";
import { Plus, Search, Maximize2, Activity, Bell } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

interface DashboardHeaderProps {
  userEmail: string;
  onNewRecord: () => void;
  search: string;
  onSearchChange: (val: string) => void;
  version?: string;
}

export function DashboardHeader({ userEmail, onNewRecord, search, onSearchChange, version = "1.0" }: DashboardHeaderProps) {
  const { theme, t } = useTheme();
  const [profileImg, setProfileImg] = useState<string>("https://i.pinimg.com/736x/21/00/68/2100685936750058b292e0df72280d90.jpg");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("operator-profile-img");
      if (saved) setProfileImg(saved);
    }
  }, []);

  const isFsociety = theme.includes("fsociety") || theme === "mr-robot" || theme === "system-root";

  return (
    <header className="px-8 py-4 flex items-center justify-between bg-transparent relative z-30">
      <div className="flex items-center gap-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-mono text-primary/40 uppercase tracking-[0.3em] mb-1">
            <Activity className="h-3 w-3 animate-pulse" />
            Live_Uplink_Established // Node_Alpha
          </div>
          <h1 className={`text-3xl font-black tracking-tighter text-glow italic flex items-center gap-3 ${isFsociety ? "text-red-600" : "text-primary"}`}>
            <span className="glitch-text" data-text="FSOCIETY_REMOTE">
              {t.login_title}
            </span>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <span className="text-white/20 not-italic font-mono text-[10px] tracking-[0.5em] mt-1 hidden sm:block">CORE_v{version}</span>
          </h1>
        </div>

        <div className="hidden lg:flex relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SCAN_DATABASE_"
            className="bg-black/40 border border-white/5 backdrop-blur-md rounded-full py-2.5 pl-12 pr-6 text-[11px] font-mono text-white outline-none focus:border-primary/30 focus:bg-black/60 transition-all w-80 placeholder:text-white/10 tracking-widest"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Quick Actions Panel */}
        <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/5 rounded-lg p-1 mr-2">
           <HeaderAction icon={<Maximize2 className="h-4 w-4" />} title="Full_Display" onClick={() => {
             if (typeof document !== "undefined") {
               document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
             }
           }} />
           <HeaderAction icon={<Bell className="h-4 w-4" />} title="Alert_Logs" onClick={() => {}} />
        </div>

        <button
          onClick={onNewRecord}
          className="group relative flex items-center gap-3 rounded-md border border-primary/40 bg-primary/10 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-black hover:box-glow active:scale-95"
        >
          <Plus className="h-4 w-4" /> {t.new_record}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none opacity-20" />
        </button>

        <div className="flex items-center gap-4 ml-4 pl-6 border-l border-white/5">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-primary/40 uppercase tracking-widest">Operator_Key</span>
            <span className="text-xs font-bold text-white/80">{userEmail.split('@')[0].toUpperCase()}</span>
          </div>
          <div className="relative group cursor-pointer">
            <label className="cursor-pointer block">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        const base64 = ev.target.result as string;
                        setProfileImg(base64);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("operator-profile-img", base64);
                        }
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div className="h-11 w-11 rounded-lg border border-primary/20 p-0.5 group-hover:border-primary transition-all duration-500 overflow-hidden bg-black shadow-2xl relative">
                <img 
                  id="user-profile-img"
                  src={profileImg} 
                  alt="Operator"
                  className="w-full h-full object-cover rounded-[6px] group-hover:scale-110 transition-all duration-700 brightness-75 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </label>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-black animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderAction({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-md text-white/20 hover:text-primary hover:bg-white/5 transition-all group relative"
      title={title}
    >
      {icon}
      <div className="absolute -inset-1 bg-primary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
    </button>
  );
}

