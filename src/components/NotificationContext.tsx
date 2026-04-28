import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import { Bell, Shield, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

export type NotificationType = "info" | "success" | "warn" | "error" | "security";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (title: string, message: string, type?: NotificationType) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((title: string, message: string, type: NotificationType = "info") => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev].slice(0, 50));

    // System Toast
    const iconMap = {
      info: <Info className="h-4 w-4 text-blue-400" />,
      success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
      warn: <AlertTriangle className="h-4 w-4 text-amber-400" />,
      error: <AlertTriangle className="h-4 w-4 text-rose-500" />,
      security: <Shield className="h-4 w-4 text-primary" />
    };

    toast(title, {
      description: message,
      icon: iconMap[type],
      className: "terminal-border bg-black/90 text-white backdrop-blur-xl border-primary/20",
    });
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    // SSR-safe fallback to avoid hard crashes during hydration
    return {
      notifications: [],
      addNotification: () => {},
      markAsRead: () => {},
      clearAll: () => {},
      unreadCount: 0,
    } as NotificationContextType;
  }
  return context;
}
