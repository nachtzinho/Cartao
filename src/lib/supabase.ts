import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para as tabelas do Supabase
export interface Cartao {
  id?: number;
  numero_cartao: string;
  validade: string;
  cvv: string;
  valido: boolean;
  vazado: boolean;
  created_at?: string;
}

export interface AdminCredentials {
  id?: number;
  username: string;
  password: string;
}
