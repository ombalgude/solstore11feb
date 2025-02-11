/*
  # Add store rating system

  1. New Tables
    - `store_ratings`
      - `id` (uuid, primary key)
      - `store_id` (uuid, references users)
      - `reviewer_id` (uuid, references users)
      - `rating` (integer, 1-3)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add average_rating column to users table
    - Add trigger for automatic average rating calculation

  3. Security
    - Enable RLS on store_ratings table
    - Add policies for:
      - Reading ratings (public)
      - Creating ratings (authenticated users)
      - Updating own ratings (authenticated users)
*/

-- Create store ratings table
CREATE TABLE IF NOT EXISTS store_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 3),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, reviewer_id)
);

-- Add average rating to users if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE users ADD COLUMN average_rating numeric(2,1);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE store_ratings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read store ratings"
  ON store_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create store ratings"
  ON store_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own store ratings"
  ON store_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Function to update average rating
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

-- Trigger for average rating updates
DROP TRIGGER IF EXISTS update_store_rating_trigger ON store_ratings;
CREATE TRIGGER update_store_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON store_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_store_average_rating();