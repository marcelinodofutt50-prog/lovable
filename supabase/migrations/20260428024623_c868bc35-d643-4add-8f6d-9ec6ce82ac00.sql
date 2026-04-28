ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS subscription_type text DEFAULT 'Essential',
  ADD COLUMN IF NOT EXISTS additional_info text,
  ADD COLUMN IF NOT EXISTS yaarsa_synced boolean DEFAULT false;