import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/ThemeContext";
import { NotificationProvider } from "@/components/NotificationContext";
import { Toaster } from "sonner";

import "../styles.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 font-mono">
      <div className="max-w-md text-center terminal-border p-8 rounded-xl bg-black/60 backdrop-blur-xl">
        <h1 className="text-7xl font-black text-primary italic">404</h1>
        <h2 className="mt-4 text-xl font-bold text-white uppercase tracking-widest">Entry Point Not Found</h2>
        <p className="mt-2 text-xs text-white/40 leading-relaxed">
          The requested resource is outside the current security clearance or has been purged from the database.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded bg-primary px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:box-glow"
          >
            RETURN_TO_ROOT
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FSOCIETY REMOTE // COMMAND_CENTER" },
      { name: "description", content: "Painel hacker elite v1.2 para gestão de ativos e infraestrutura." },
      { name: "author", content: "fsociety.remote" },
      { property: "og:title", content: "FSOCIETY REMOTE // COMMAND_CENTER" },
      { property: "og:description", content: "Painel hacker elite v1.2 para gestão de ativos e infraestrutura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Outlet />
        <Toaster position="bottom-right" closeButton theme="dark" expand={true} />
      </NotificationProvider>
    </ThemeProvider>
  );
}
