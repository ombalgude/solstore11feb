/*
  # Add product ratings

  1. New Tables
    - `product_ratings`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `reviewer_id` (uuid, foreign key)
      - `rating` (integer, 1-3)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add `average_rating` column to products table
    - Add trigger to update product average rating

  3. Security
    - Enable RLS
    - Add policies for reading and creating ratings
*/

-- Create product ratings table
CREATE TABLE IF NOT EXISTS product_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 3),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, reviewer_id)
);

-- Add average rating to products if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE products ADD COLUMN average_rating numeric(2,1);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read product ratings"
  ON product_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create product ratings"
  ON product_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own product ratings"
  ON product_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Function to update average rating
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

-- Trigger for average rating updates
DROP TRIGGER IF EXISTS update_product_rating_trigger ON product_ratings;
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_average_rating();