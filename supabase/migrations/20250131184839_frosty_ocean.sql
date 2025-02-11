/*
  # Add ratings and reviews system

  1. New Tables
    - `ratings`
      - `id` (uuid, primary key)
      - `store_id` (uuid, references users)
      - `reviewer_id` (uuid, references users)
      - `rating` (integer, 1-3)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ratings` table
    - Add policies for authenticated users to:
      - Read all ratings
      - Create ratings for stores they've purchased from
      - Update their own ratings
*/

CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 3),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, reviewer_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read ratings
CREATE POLICY "Anyone can read ratings"
  ON ratings
  FOR SELECT
  USING (true);

-- Allow authenticated users to create ratings
CREATE POLICY "Authenticated users can create ratings"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Allow users to update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Add average rating column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS average_rating numeric(2,1);

-- Function to update average rating
CREATE OR REPLACE FUNCTION update_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET average_rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM ratings
    WHERE store_id = NEW.store_id
  )
  WHERE id = NEW.store_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update average rating
CREATE TRIGGER update_store_rating
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_average_rating();