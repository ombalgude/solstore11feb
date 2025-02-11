import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

export class ProductService {
  static async createProduct(product: ProductInsert) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProduct(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        creator:users(id, name, username, avatar_url),
        ratings:product_ratings(*)
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getCreatorProducts(creatorId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateProduct(productId: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
  }

  static async searchProducts(query: string, category?: string) {
    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        creator:users(id, name, username, avatar_url)
      `)
      .ilike('title', `%${query}%`);

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data;
  }
}