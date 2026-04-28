import { createServerFn } from "@tanstack/react-start";

const YAARSA_URL = "https://painelyaarsa.com.br/yaarsa/user/create8619.php";

export interface YaarsaUserPayload {
  username: string;
  email: string;
  password: string;
  subscription_type: string;
  total_paid: string | number;
  additional_info?: string;
  expire_date?: string; // dd/mm/yyyy or yyyy-mm-dd
}

/**
 * Server function que envia os dados do cliente para o painel web Yaarsa.
 * Roda 100% no servidor — a YAARSA_ADMIN_KEY nunca é exposta no browser.
 *
 * Faz POST x-www-form-urlencoded em /yaarsa/user/create8619.php imitando
 * o submit do formulário "Add New User".
 */
export const createYaarsaUser = createServerFn({ method: "POST" })
  .inputValidator((input: YaarsaUserPayload) => {
    if (!input?.username || input.username.trim().length < 2) {
      throw new Error("O nome de usuário deve conter pelo menos 2 caracteres.");
    }
    if (!input?.email || !input.email.includes("@")) {
      throw new Error("Endereço de email inválido.");
    }
    if (!input?.password || input.password.length < 4) {
      throw new Error("A senha deve conter pelo menos 4 caracteres.");
    }
    return input;
  })
  .handler(async ({ data }) => {
    // Admin key hardcoded as requested by user for direct integration
    const adminKey = "Callioni2010@";

    // Normaliza data: dd/mm/yyyy é o formato comum em painéis PHP-BR.
    let expire = data.expire_date ?? "";
    if (expire && /^\d{4}-\d{2}-\d{2}$/.test(expire)) {
      const [y, m, d] = expire.split("-");
      expire = `${d}/${m}/${y}`;
    }

    const body = new URLSearchParams({
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
      admin_key: adminKey,
      subscription_type: data.subscription_type || "Essential",
      total_paid: String(data.total_paid ?? "0"),
      additional_info: data.additional_info ?? "",
      expire_date: expire,
      submit: "Add User",
      action: "add",
    });

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000); // Aumentado para 20s

      const res = await fetch(YAARSA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FSocietyRemote/1.5",
          Accept: "text/html,application/xhtml+xml",
          Referer: "https://painelyaarsa.com.br/yaarsa/",
        },
        body: body.toString(),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`Servidor respondeu com status ${res.status}`);
      }

      const text = await res.text();
      const lower = text.toLowerCase();

      // Heurística de erro/sucesso baseada na resposta PHP
      const looksLikeError =
        lower.includes("error") ||
        lower.includes("invalid") ||
        lower.includes("denied") ||
        lower.includes("wrong") ||
        lower.includes("unauthorized") ||
        lower.includes("falha") ||
        lower.includes("erro");

      const looksLikeSuccess =
        lower.includes("success") ||
        lower.includes("added") ||
        lower.includes("created") ||
        lower.includes("usuário adicionado") ||
        lower.includes("sucesso") ||
        lower.includes("concluído") ||
        lower.includes("user added");

      const ok = looksLikeSuccess || (!looksLikeError && text.length > 0);

      return {
        ok,
        status: res.status,
        message: ok
          ? "Sincronização concluída: Usuário criado no painel Yaarsa."
          : "O painel recebeu os dados, mas não confirmou a criação. Verifique manualmente.",
        snippet: text.slice(0, 500),
      };
    } catch (err: any) {
      console.error("[yaarsa] falha na requisição:", err);
      const isTimeout = err.name === 'AbortError';
      return {
        ok: false,
        status: 0,
        error: isTimeout 
          ? "Tempo limite esgotado: O painel Yaarsa está demorando muito para responder." 
          : `Erro de conexão: ${err.message || "Falha ao conectar com o servidor painelyaarsa.com.br"}`,
      };
    }
  });

