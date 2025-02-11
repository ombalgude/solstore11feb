/*
  # Initial Schema Setup

  1. Tables Created:
    - users: Store user profiles and authentication data
    - products: Digital products for sale
    - purchases: Track product purchases
    - store_ratings: Store ratings and reviews
    - product_ratings: Product ratings and reviews

  2. Security:
    - RLS policies for each table
    - Secure access patterns for authenticated users

  3. Features:
    - Automatic timestamps
    - Rating calculations
    - Secure relationships
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  wallet_address text UNIQUE,
  name text,
  username text UNIQUE,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  average_rating numeric(2,1)
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  content_url text,
  preview_url text,
  category text,
  content_type text NOT NULL,
  is_locked boolean DEFAULT true,
  creator_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  average_rating numeric(2,1)
);

-- Create purchases table
CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  price numeric NOT NULL,
  tx_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create store ratings table
CREATE TABLE store_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 3),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, reviewer_id)
);

-- Create product ratings table
CREATE TABLE product_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 3),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, reviewer_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON users
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create products"
  ON products
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own products"
  ON products
  FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own products"
  ON products
  FOR DELETE
  USING (auth.uid() = creator_id);

-- Purchases policies
CREATE POLICY "Users can view own purchases"
  ON purchases
  FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create purchases"
  ON purchases
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Store ratings policies
CREATE POLICY "Store ratings are viewable by everyone"
  ON store_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create store ratings"
  ON store_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own store ratings"
  ON store_ratings
  FOR UPDATE
  USING (auth.uid() = reviewer_id);

-- Product ratings policies
CREATE POLICY "Product ratings are viewable by everyone"
  ON product_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create product ratings"
  ON product_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own product ratings"
  ON product_ratings
  FOR UPDATE
  USING (auth.uid() = reviewer_id);

-- Function to update store average rating
CREATE OR REPLACE FUNCTION update_store_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET average_rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM store_ratings
    WHERE store_id = NEW.store_id
  )
  WHERE id = NEW.store_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update product average rating
CREATE OR REPLACE FUNCTION update_product_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET average_rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM product_ratings
    WHERE product_id = NEW.product_id
  )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for ratings
CREATE TRIGGER update_store_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON store_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_store_average_rating();

CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_average_rating();

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();