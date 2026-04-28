import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";

import { supabase } from "@/integrations/supabase/client";
import { CyberBackground } from "@/components/CyberBackground";
import { useTheme } from "@/components/ThemeContext";

import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Lock,
  User,
  ShieldAlert,
  Loader2,
  Cpu,
  Globe,
  Database,
  Ghost,
  Eye,
  EyeOff
} from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const BOOT_LINES = [
  "INITIALIZING EXPLOIT: FSOCIETY_v1.3.ELITE",
  "CONNECTING TO NODE: 191.96.78.81 [REDACTED]",
  "BYPASSING E-CORP FIREWALL... [SUCCESS]",
  "INJECTING SHELLCODE INTO KERNEL...",
  "ACCESSING FSOCIETY PRIVATE NETWORK...",
  "IDENTITY VERIFICATION REQUIRED_",
];

function LoginPage() {
  const navigate = useNavigate();

  const {
    theme,
    setTheme,
    themes,
    isAuthenticating: contextAuthenticating,
    setIsAuthenticating: setContextAuthenticating,
  } = useTheme();

  const [localAuthenticating, setLocalAuthenticating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [loadingProgress, setLoadingProgress] = useState(0);

  // ✅ FIX PRINCIPAL (SEM LOOP)
  useEffect(() => {
    let ignore = false;

    supabase.auth.getSession().then(({ data }) => {
      if (ignore) return;

      if (data.session) {
        navigate({ to: "/dashboard" });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate({ to: "/dashboard" });
        }
      }
    );

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  // ✅ LOGIN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const isUniversal =
      email === "callioniskate@gmail.com" &&
      password === "callioni890@";

    try {
      if (isUniversal) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError("Erro no login universal");
          setBusy(false);
          return;
        }

        setLocalAuthenticating(true);
        setContextAuthenticating(true);

        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 1000);

        return;
      }

      const { error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError("Credenciais inválidas");
        setBusy(false);
      } else {
        setLocalAuthenticating(true);
        setContextAuthenticating(true);

        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 800);
      }
    } catch {
      setError("Erro crítico");
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <CyberBackground type={theme} />

      <AnimatePresence>
        {(localAuthenticating || contextAuthenticating) && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="text-white font-mono">
              {loadingProgress}% Authenticating...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-50 w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-bold tracking-widest">
            FSOCIETY REMOTE
          </h1>
        </div>

        <div className="bg-black/90 border border-zinc-800 p-8 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs text-zinc-500">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-zinc-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-xs">{error}</div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-red-600 py-3 text-white font-bold"
            >
              {busy ? <Loader2 className="animate-spin mx-auto" /> : "Login"}
            </button>
          </form>
        </div>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="mt-4 w-full bg-black text-white p-2 border border-zinc-700"
        >
          {themes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}