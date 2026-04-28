import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCRIPTS = [
  "INITIALIZING UPLINK...",
  "BYPASSING FIREWALL [78%]",
  "ENCRYPTING DATA PACKETS...",
  "NODE 191.96.78.81 CONNECTED",
  "DECRYPTING CLIENT_TABLE.DB",
  "INJECTING AUTH_TOKEN...",
  "SCANNING FOR VULNERABILITIES...",
  "CLEANING LOGS...",
  "ESTABLISHING SECURE TUNNEL...",
  "ROTATING PROXIES...",
  "SIGNAL STRENGTH: 98%",
  "DOWLINK RATE: 2.4 GB/S",
  "CORE_KERNEL: RELOADED",
  "MEM_DUMP: SUCCESSFUL",
  "HASH_DECRYPT: MD5_COLLISION_DETECTED",
  "OVERRIDING_DNS_ROOT...",
];

export function HackerScript() {
  const [lines, setLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLine = SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLines((prev) => [...prev.slice(-15), `[${timestamp}] ${newLine}`]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="hidden lg:block w-64 border-l border-border/40 bg-black/40 backdrop-blur-md p-4 font-mono text-[10px] overflow-hidden">
      <div className="mb-4 flex items-center justify-between text-primary/40 uppercase tracking-widest border-b border-primary/20 pb-1">
        <span>System Log</span>
        <span className="animate-pulse">Live</span>
      </div>
      <div ref={scrollRef} className="space-y-1 h-full overflow-y-auto scrollbar-none">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i + line}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-primary/70 whitespace-nowrap"
            >
              <span className="text-primary/30 mr-2">{">"}</span>
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
