import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth session error:", error);
        throw redirect({ to: "/login" });
      }
      if (data?.session) {
        throw redirect({ to: "/dashboard" });
      }
      throw redirect({ to: "/login" });
    } catch (err) {
      if (err instanceof Error && err.message === 'Redirect') throw err;
      // If any other error happens (like Supabase failing), default to login
      throw redirect({ to: "/login" });
    }
  },
  component: () => null,
});
