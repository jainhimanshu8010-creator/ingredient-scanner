import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  created_at: string;
};

export type Ingredient = {
  id: string;
  product_id: string;
  name: string;
  quantity_tablespoons: number;
  order_index: number;
  created_at: string;
};
