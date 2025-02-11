import { supabase } from '@/lib/supabase';

export class PurchaseService {
  static async createPurchase(productId: string, buyerId: string, price: number, txHash: string) {
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          product_id: productId,
          buyer_id: buyerId,
          price,
          tx_hash: txHash,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserPurchases(userId: string) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        product:products(*),
        seller:users(id, name, username, avatar_url)
      `)
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getStorePurchases(storeId: string) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        product:products(*),
        buyer:users(id, name, username, avatar_url)
      `)
      .eq('product.creator_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}