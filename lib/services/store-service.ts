import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';

type User = Database['public']['Tables']['users']['Row'];

export class StoreService {
  static async getStore(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        products(*),
        ratings:store_ratings(*)
      `)
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateStore(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTopStores(limit = 10) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        products(count),
        ratings:store_ratings(avg(rating))
      `)
      .not('products', 'is', null)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}