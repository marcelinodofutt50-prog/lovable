# 🟢 Hacker Panel — Guia de instalação e build (Electron + VS Code)

Painel hacker para gerenciar **logins, senhas e pagamentos** dos seus clientes.
Funciona como **app web** (no navegador) **e como app desktop** (via Electron).

---

## 📋 O que você precisa instalado

| Programa | Para que serve | Link |
|---|---|---|
| **Node.js 20+** | rodar o projeto | https://nodejs.org |
| **VS Code** | editar o código | https://code.visualstudio.com |
| **Git** (opcional) | clonar/atualizar | https://git-scm.com |

> 💡 Para verificar, abra o terminal (no VS Code: `Ctrl + '`) e rode:
> ```bash
> node -v   # precisa mostrar v20 ou superior
> npm -v
> ```

---

## 🚀 Passo a passo no VS Code

### 1) Abrir o projeto
- Baixe/clone o projeto e abra a pasta no **VS Code**: `File → Open Folder`.
- Abra o terminal integrado: `Ctrl + '` (ou `Terminal → New Terminal`).

### 2) Instalar dependências
```bash
npm install
```

### 3) Rodar como **site no navegador** (modo dev)
```bash
npm run dev
```
Abra: <http://localhost:3000>

### 4) Rodar como **app desktop (Electron) em modo dev**

Em **dois terminais** dentro do VS Code:

**Terminal 1** — sobe o servidor web:
```bash
npm run dev
```

**Terminal 2** — abre a janela Electron:
```bash
npm run electron:dev
```

> ⚠️ Espere o terminal 1 mostrar **"Local: http://localhost:3000"** antes de rodar o terminal 2.

### 5) Gerar o app desktop **instalável** (build de produção)

```bash
npm run electron:build
```

Os instaladores ficam em **`electron-release/`**:
- **Windows**: pasta `Hacker Panel-win32-x64/` → executável `Hacker Panel.exe`
- **Mac**: `Hacker Panel-darwin-x64/Hacker Panel.app`
- **Linux**: `Hacker Panel-linux-x64/Hacker Panel`

> 💡 Para gerar para outro sistema operacional, edite `package.json` e troque
> `--platform=...` (`win32`, `darwin` ou `linux`) no script `electron:build`.

---

## 🔐 Primeiro acesso

1. Abra o painel (web ou Electron).
2. Clique em **"// novo no sistema? registrar nó"**.
3. Crie sua conta com **email + senha** (mínimo 6 caracteres).
4. Pronto! Você cai direto no dashboard.

> 🔒 Cada usuário só vê **seus próprios** clientes (proteção RLS no banco).
> Toda ação importante (criar / editar / pagar / apagar cliente) é notificada
> automaticamente no seu **Discord** via webhook.

---

## 📂 Estrutura

```
electron/
  main.cjs              # processo principal do Electron (janela)
src/
  routes/
    index.tsx           # redireciona para /login ou /dashboard
    login.tsx           # tela de login hacker
    dashboard.tsx       # painel CRUD de clientes
  components/
    MatrixRain.tsx      # animação Matrix de fundo
  lib/
    discord.ts          # envio de webhooks pro Discord
    auth.ts             # hook de sessão Supabase
  styles.css            # design system (tema hacker / verde neon)
```

---

## 🛠️ Comandos disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor web em `http://localhost:3000` |
| `npm run build` | Gera o build web em `dist/` |
| `npm run electron:dev` | Abre o Electron apontando pro dev server |
| `npm run electron:build` | Build web + empacota o desktop em `electron-release/` |

---

## ❓ Problemas comuns

- **Janela em branco no Electron** → você esqueceu de buildar. Rode `npm run build` antes do `electron:build`, ou use `electron:dev` durante o desenvolvimento.
- **`electron: command not found`** → rode `npm install` de novo.
- **Login não funciona** → confirme no Discord se chegou alguma notificação. Verifique também se o email/senha estão corretos. Senhas têm que ter no mínimo 6 caracteres.

Bom uso! 🟢
