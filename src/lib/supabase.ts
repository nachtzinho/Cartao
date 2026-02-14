import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate configuration
const isConfigured = supabaseUrl && supabaseKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseKey !== 'placeholder-key';

// Create client only if properly configured
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient('https://fallback.supabase.co', 'fallback-key');

// Export configuration status
export const supabaseConfig = {
  isConfigured,
  url: isConfigured ? supabaseUrl : null,
};

// Types for tables
export type Card = {
  id: string;
  card_number: string;
  card_holder: string;
  card_month: string;
  card_year: string;
  card_cvv: string;
  card_type: string;
  created_at: string;
  user_id?: string;
};

// Sanitize card data to prevent XSS
export function sanitizeCardData(data: Partial<Card>): Partial<Card> {
  const sanitize = (str: string) => str.replace(/[<>\"']/g, '');
  
  return {
    ...data,
    card_holder: data.card_holder ? sanitize(data.card_holder) : undefined,
  };
}

// Mask card number for display
export function maskCardNumber(number: string): string {
  if (!number || number.length < 4) return '••••';
  return '•••• ' + number.slice(-4);
}
