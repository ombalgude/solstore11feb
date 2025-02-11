import { supabase } from '@/lib/supabase';

export class RatingService {
  static async rateStore(storeId: string, reviewerId: string, rating: number, comment?: string) {
    const { data, error } = await supabase
      .from('store_ratings')
      .upsert([
        {
          store_id: storeId,
          reviewer_id: reviewerId,
          rating,
          comment,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async rateProduct(productId: string, reviewerId: string, rating: number, comment?: string) {
    const { data, error } = await supabase
      .from('product_ratings')
      .upsert([
        {
          product_id: productId,
          reviewer_id: reviewerId,
          rating,
          comment,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getStoreRatings(storeId: string) {
    const { data, error } = await supabase
      .from('store_ratings')
      .select(`
        *,
        reviewer:users(id, name, username, avatar_url)
      `)
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getProductRatings(productId: string) {
    const { data, error } = await supabase
      .from('product_ratings')
      .select(`
        *,
        reviewer:users(id, name, username, avatar_url)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}