import React from "react";
import { motion } from "framer-motion";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

export function NavItem({ icon, label, active = false, onClick, collapsed = true }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex items-center transition-all duration-300 ${collapsed ? 'justify-center w-12 h-12' : 'w-full px-4 h-12'} rounded-xl ${
        active 
          ? "bg-primary text-primary-foreground box-glow" 
          : "text-primary/40 hover:text-primary hover:bg-primary/10"
      }`}
      title={collapsed ? label : undefined}
    >
      <div className="relative z-10 flex items-center justify-center">
        {icon}
      </div>
      
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-3 text-xs font-bold uppercase tracking-widest overflow-hidden whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}

      {active && (
        <motion.div 
          layoutId="nav-active"
          className="absolute inset-0 rounded-xl bg-primary -z-0"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {!active && !collapsed && (
        <div className="absolute left-0 w-1 h-0 bg-primary group-hover:h-6 transition-all rounded-r-full" />
      )}
    </button>
  );
}
