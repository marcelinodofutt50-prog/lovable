import React from "react";
import { Bell, Shield, Info, AlertTriangle, CheckCircle2, Trash2, Check } from "lucide-react";
import { useNotifications, NotificationType } from "@/components/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

export function Notifications() {
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "info": return <Info className="h-4 w-4 text-blue-400" />;
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "warn": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case "security": return <Shield className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="bg-[#080808]/80 backdrop-blur-3xl rounded-xl border border-white/5 overflow-hidden shadow-2xl relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Bell className="h-4 w-4 text-primary" />
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
             )}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">Alert_Stream</span>
            <span className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.4em]">{unreadCount} unread entries</span>
          </div>
        </div>
        <button 
          onClick={clearAll}
          className="p-2 rounded-md hover:bg-rose-500/10 text-white/20 hover:text-rose-500 transition-all duration-300"
          title="Clear Stream"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative overflow-hidden rounded-lg p-4 transition-all duration-300 border ${
                    n.read ? "bg-black/20 border-white/5 opacity-50" : "bg-white/[0.03] border-primary/20 shadow-lg shadow-primary/5"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 pt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${n.read ? "text-white/40" : "text-white"}`}>
                          {n.title}
                        </span>
                        <span className="text-[8px] font-mono text-white/10">{n.timestamp}</span>
                      </div>
                      <p className={`text-[10px] leading-relaxed ${n.read ? "text-white/20" : "text-white/60"} font-mono line-clamp-2 group-hover:line-clamp-none transition-all`}>
                        {n.message}
                      </p>
                    </div>
                    {!n.read && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="p-1.5 rounded bg-primary/10 text-primary/40 hover:text-primary transition-all self-start"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {!n.read && (
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-primary/40" />
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Shield className="h-8 w-8 text-white/5 mx-auto mb-4" />
              <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/20 italic">No inbound stream detected.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="px-6 py-2 bg-black/40 border-t border-white/5">
         <span className="text-[7px] font-mono text-white/10 uppercase tracking-[0.6em]">System_Feed_v1.3</span>
      </div>
    </div>
  );
}
