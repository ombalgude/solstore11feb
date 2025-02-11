export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          wallet_address: string | null
          name: string | null
          username: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          average_rating: number | null
        }
        Insert: {
          id?: string
          email?: string | null
          wallet_address?: string | null
          name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          average_rating?: number | null
        }
        Update: {
          id?: string
          email?: string | null
          wallet_address?: string | null
          name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          average_rating?: number | null
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          content_url: string | null
          preview_url: string | null
          category: string | null
          content_type: string
          is_locked: boolean
          creator_id: string
          created_at: string
          updated_at: string
          average_rating: number | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          content_url?: string | null
          preview_url?: string | null
          category?: string | null
          content_type: string
          is_locked?: boolean
          creator_id: string
          created_at?: string
          updated_at?: string
          average_rating?: number | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          content_url?: string | null
          preview_url?: string | null
          category?: string | null
          content_type?: string
          is_locked?: boolean
          creator_id?: string
          created_at?: string
          updated_at?: string
          average_rating?: number | null
        }
      }
      purchases: {
        Row: {
          id: string
          product_id: string
          buyer_id: string
          price: number
          tx_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          buyer_id: string
          price: number
          tx_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          buyer_id?: string
          price?: number
          tx_hash?: string
          created_at?: string
        }
      }
      store_ratings: {
        Row: {
          id: string
          store_id: string
          reviewer_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          reviewer_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          reviewer_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      product_ratings: {
        Row: {
          id: string
          product_id: string
          reviewer_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          reviewer_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          reviewer_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}