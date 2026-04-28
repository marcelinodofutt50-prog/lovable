import React, { useState } from "react";
import { Shield, ShieldAlert, Lock, Unlock, Zap, RefreshCw, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { encryptData, decryptData } from "@/lib/crypto";
import { toast } from "sonner";

export function CryptoTools() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEncrypt = async () => {
    if (!input) return;
    setIsProcessing(true);
    const result = await encryptData(input);
    setOutput(result);
    setIsProcessing(false);
    toast.success("DATA_ENCRYPTED", { description: "AES-GCM 256-bit protocol applied." });
  };

  const handleDecrypt = async () => {
    if (!input) return;
    setIsProcessing(true);
    const result = await decryptData(input);
    setOutput(result);
    setIsProcessing(false);
    if (result === input) {
      toast.error("DECRYPTION_FAILED", { description: "Invalid hash or corrupted cluster." });
    } else {
      toast.success("DATA_DECRYPTED", { description: "Cipher broken successfully." });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#080808]/80 backdrop-blur-3xl rounded-xl border border-white/5 overflow-hidden shadow-2xl relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Lock className="h-4 w-4 text-primary" />
             <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">Vault_Processor</span>
            <span className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.4em]">AES-GCM 256 Hardened</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className={`h-1.5 w-1.5 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} border border-black shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
           <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{isProcessing ? "Processing..." : "Ready"}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute top-3 left-3 text-[8px] font-mono text-white/10 group-focus-within:text-primary/40 uppercase tracking-widest z-10 transition-colors">Input_Buffer</div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject plaintext or hex stream..."
              className="w-full h-40 rounded-lg bg-black/40 border border-white/5 p-8 font-mono text-[10px] text-white/80 outline-none focus:border-primary/30 focus:bg-black/60 transition-all resize-none custom-scrollbar"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleEncrypt}
              disabled={isProcessing || !input}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-black hover:box-glow transition-all duration-300 disabled:opacity-20"
            >
              <Shield className="h-3.5 w-3.5" /> Secure
            </button>
            <button
              onClick={handleDecrypt}
              disabled={isProcessing || !input}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all duration-300 disabled:opacity-20"
            >
              <Unlock className="h-3.5 w-3.5" /> Unlock
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative group flex-1">
             <div className="absolute top-3 left-3 text-[8px] font-mono text-white/10 uppercase tracking-widest z-10">Output_Stream</div>
             <div className="absolute top-3 right-3 z-20">
                <button 
                  onClick={handleCopy}
                  disabled={!output}
                  className="p-1.5 rounded bg-white/5 border border-white/10 text-white/20 hover:text-primary transition-all disabled:opacity-5"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
             </div>
             <div className="w-full h-40 rounded-lg bg-white/[0.01] border border-white/5 p-8 font-mono text-[10px] text-primary/60 break-all overflow-y-auto custom-scrollbar italic">
                {isProcessing ? (
                  <div className="flex items-center gap-2 animate-pulse">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>SYNCHRONIZING_ALGORITHM...</span>
                  </div>
                ) : output || <span className="text-white/5 italic uppercase tracking-widest">Awaiting_Operation...</span>}
             </div>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 flex gap-3 items-center">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500/40 shrink-0" />
            <p className="text-[7px] text-rose-500/30 leading-relaxed uppercase tracking-[0.1em]">
              Warning: Vault persistence limited to local enclave sessions.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center">
         <span className="text-[7px] font-mono text-white/10 uppercase tracking-[0.6em]">Cipher_Module_Enabled</span>
         <Zap className="h-3 w-3 text-primary/20" />
      </div>
    </div>
  );
}
