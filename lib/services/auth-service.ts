import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';

type User = Database['public']['Tables']['users']['Row'];

export class AuthService {
  static async signUp(email: string, password: string, username: string) {
    try {
      // First check if username is taken
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking username:', checkError);
        throw new Error('Error checking username availability');
      }

      if (existingUser) {
        throw new Error('Username already taken');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            username,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('Failed to create user profile');
      }

      return { data: { user: authData.user, profile }, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Sign in error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user found');
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      return { data: { user: authData.user, profile }, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
}