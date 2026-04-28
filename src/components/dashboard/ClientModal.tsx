import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { notifyDiscord } from "@/lib/discord";
import { encryptData } from "@/lib/crypto";
import { createYaarsaUser } from "@/lib/yaarsa.functions";
import {
  X,
  Save,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Unlock,
  Globe,
  CheckCircle2,
  Loader2,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldAlert
} from "lucide-react";
import { Client, SUBSCRIPTION_TYPES } from "@/types/client";

interface ClientModalProps {
  ownerId: string;
  initial: Client | null;
  onClose: () => void;
  onSaved: (c: Client, isNew: boolean) => void;
}

export function ClientModal({ ownerId, initial, onClose, onSaved }: ClientModalProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    password: initial?.password ?? "",
    whatsapp: initial?.whatsapp ?? "",
    server_info: initial?.server_info ?? "",
    amount: String(initial?.amount ?? "0"),
    paid: initial?.paid ?? false,
    due_date: initial?.due_date ?? "",
    notes: initial?.notes ?? "",
    subscription_type: initial?.subscription_type ?? "Essential",
    additional_info: initial?.additional_info ?? "",
  });

  const [confirmPassword, setConfirmPassword] = useState(initial?.password ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [useEncryption, setUseEncryption] = useState(true);
  const [pushToYaarsa, setPushToYaarsa] = useState(!initial);
  const [yaarsaStatus, setYaarsaStatus] = useState<null | { ok: boolean; message: string }>(null);

  const isPasswordChanged = initial ? form.password !== initial.password : true;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setYaarsaStatus(null);

    // Validações
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setErr("CAMPOS_OBRIGATÓRIOS: Nome, Email e Senha devem ser preenchidos.");
      setBusy(false);
      return;
    }

    if (isPasswordChanged && form.password !== confirmPassword) {
      setErr("ERRO_DE_VALIDAÇÃO: As senhas fornecidas não coincidem.");
      setBusy(false);
      return;
    }

    if (form.password.length < 6) {
      setErr("SEGURANÇA_FRACA: A senha deve conter pelo menos 6 caracteres.");
      setBusy(false);
      return;
    }

    try {
      const plainPassword = form.password;
      const finalPassword = useEncryption
        ? await encryptData(plainPassword)
        : plainPassword;

      const payload = {
        owner_id: ownerId,
        name: form.name.trim(),
        email: form.email.trim(),
        password: finalPassword,
        whatsapp: form.whatsapp.trim() || null,
        server_info: form.server_info || null,
        amount: Number(form.amount) || 0,
        paid: form.paid,
        due_date: form.due_date || null,
        notes: form.notes || null,
        subscription_type: form.subscription_type,
        additional_info: form.additional_info || null,
      };

      let saved: Client;
      const isNew = !initial;

      if (initial) {
        const { data, error } = await supabase
          .from("clients")
          .update(payload)
          .eq("id", initial.id)
          .select()
          .single();
        if (error) throw new Error(`Falha ao atualizar DB: ${error.message}`);
        saved = data as Client;
      } else {
        const { data, error } = await supabase
          .from("clients")
          .insert(payload)
          .select()
          .single();
        if (error) throw new Error(`Falha ao inserir no DB: ${error.message}`);
        saved = data as Client;
      }

      if (pushToYaarsa && isNew) {
        setYaarsaStatus({ ok: false, message: "Iniciando bridge com Yaarsa..." });
        try {
          const result = await createYaarsaUser({
            data: {
              username: form.name.trim(),
              email: form.email.trim(),
              password: plainPassword,
              subscription_type: form.subscription_type,
              total_paid: Number(form.amount) || 0,
              additional_info: form.additional_info,
              expire_date: form.due_date,
            },
          });

          if (result.ok) {
            setYaarsaStatus({ ok: true, message: "✓ Sincronizado com Yaarsa." });
            await supabase
              .from("clients")
              .update({ yaarsa_synced: true })
              .eq("id", saved.id);
            saved.yaarsa_synced = true;
          } else {
            setYaarsaStatus({
              ok: false,
              message: `Aviso: DB salvo, mas Yaarsa reportou: ${result.error || result.message}`,
            });
          }
        } catch (syncErr: any) {
          setYaarsaStatus({ ok: false, message: "Erro de rede ao conectar com a bridge Yaarsa." });
        }
      }

      onSaved(saved, isNew);

      try {
        notifyDiscord({
          title: isNew ? "🆕 Nova Entidade Detectada" : "✏️ Registro Modificado",
          color: isNew ? "green" : "blue",
          fields: [
            { name: "Entidade", value: payload.name, inline: true },
            { name: "Credencial", value: payload.email, inline: true },
            { name: "Password Change", value: isPasswordChanged ? "SIM" : "NÃO", inline: true },
          ],
        });
      } catch (discErr) {
        console.warn("Discord notify failed");
      }

      const waitTime = yaarsaStatus && !yaarsaStatus.ok ? 3000 : 1500;
      setTimeout(() => onClose(), isNew ? waitTime : 500);

    } catch (e: any) {
      setErr(e.message || "Erro desconhecido ao processar dados.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl bg-[#0a0a0a] border border-primary/20 shadow-2xl overflow-hidden"
      >
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-primary/10 border border-primary/20">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">
                {initial ? "UPDATE_ENTITY" : "INITIALIZE_ENTITY"}
              </h3>
              <p className="text-[9px] text-primary/40 font-mono uppercase tracking-widest">
                System Interface v1.3
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-white/20 hover:text-rose-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Username" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} required placeholder="Name" />
            <Field label="Email" value={form.email} onChange={(v: string) => setForm({ ...form, email: v })} required placeholder="email@domain.com" />
          </div>

          <div className="space-y-4 border-l-2 border-primary/20 pl-4 py-2 bg-primary/[0.02] rounded-r-xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 group-focus-within:text-primary transition-colors block">
                         Passphrase
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-white/20 hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setUseEncryption(!useEncryption)}
                          className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase transition-all ${useEncryption ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/5 text-white/40 border border-white/5"}`}
                        >
                          {useEncryption ? "AES ON" : "CRYPT OFF"}
                        </button>
                      </div>
                   </div>
                   <input
                     type={showPassword ? "text" : "password"}
                     required
                     value={form.password}
                     onChange={(e) => setForm({ ...form, password: e.target.value })}
                     className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-white outline-none focus:border-primary/40 transition-all"
                   />
                </div>

                <AnimatePresence>
                  {isPasswordChanged && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-2 group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 group-focus-within:text-primary transition-colors block">
                        Confirm_Passphrase
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-white outline-none focus:border-primary/40 transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
             {isPasswordChanged && form.password.length > 0 && form.password !== confirmPassword && (
                <div className="text-[9px] text-rose-500 font-mono uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="h-3 w-3" /> Passwords_Do_Not_Match
                </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 group-focus-within:text-primary transition-colors block">
                Subscription Type
              </span>
              <select
                value={form.subscription_type}
                onChange={(e) => setForm({ ...form, subscription_type: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-white outline-none focus:border-primary/40 transition-all"
              >
                {SUBSCRIPTION_TYPES.map((s) => (
                  <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>
                ))}
              </select>
            </div>
            <Field label="WhatsApp" value={form.whatsapp} onChange={(v: string) => setForm({ ...form, whatsapp: v })} placeholder="+55..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Total Paid (R$)" value={form.amount} onChange={(v: string) => setForm({ ...form, amount: v })} type="number" />
            <Field label="Expire Date" value={form.due_date || ""} onChange={(v: string) => setForm({ ...form, due_date: v })} type="date" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Server Info" value={form.server_info || ""} onChange={(v: string) => setForm({ ...form, server_info: v })} placeholder="IP / Host" />
            <Field label="Notes" value={form.notes || ""} onChange={(v: string) => setForm({ ...form, notes: v })} placeholder="..." />
          </div>

          <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
            <label className="flex items-center gap-4 cursor-pointer w-fit">
              <div className={`relative flex h-5 w-10 items-center rounded-full border transition-all ${form.paid ? "bg-emerald-500/20 border-emerald-500" : "bg-white/5 border-white/10"}`}>
                <div className={`h-2.5 w-2.5 rounded-full transition-all absolute ${form.paid ? "bg-emerald-500 left-6" : "bg-white/20 left-1"}`} />
              </div>
              <input type="checkbox" className="hidden" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${form.paid ? "text-emerald-500" : "text-white/40"}`}>
                STATUS: {form.paid ? "PAID" : "PENDING"}
              </span>
            </label>

            {!initial && (
              <label className="flex items-center gap-4 cursor-pointer w-fit">
                <div className={`relative flex h-5 w-10 items-center rounded-full border transition-all ${pushToYaarsa ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10"}`}>
                  <div className={`h-2.5 w-2.5 rounded-full transition-all absolute ${pushToYaarsa ? "bg-primary left-6" : "bg-white/20 left-1"}`} />
                </div>
                <input type="checkbox" className="hidden" checked={pushToYaarsa} onChange={(e) => setPushToYaarsa(e.target.checked)} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${pushToYaarsa ? "text-primary" : "text-white/40"}`}>
                  YAARSA_BRIDGE_SYNC
                </span>
              </label>
            )}
          </div>

          {err && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-mono uppercase">
              [ERROR]: {err}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-xl bg-primary px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Commit_Entity"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}

function Field({ label, value, onChange, required, type = "text", placeholder }: any) {
  return (
    <label className="block space-y-2 group">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 group-focus-within:text-primary transition-colors block">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-white outline-none focus:border-primary/40 transition-all"
      />
    </label>
  );
}
