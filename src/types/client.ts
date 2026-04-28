export interface Client {
  id: string;
  owner_id: string;
  name: string;
  email: string;
  password: string;
  whatsapp?: string | null;
  server_info: string | null;
  amount: number | null;
  paid: boolean;
  due_date: string | null;
  notes: string | null;
  // Campos para integração com painel Yaarsa
  subscription_type?: string | null;
  additional_info?: string | null;
  yaarsa_synced?: boolean | null;
  created_at?: string;
  updated_at?: string;
}


export const SUBSCRIPTION_TYPES = [
  "Essential",
  "Premium",
  "Ultra",
  "Lifetime",
  "Trial",
] as const;
