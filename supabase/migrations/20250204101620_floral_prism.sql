/*
  # Creator Verification System

  1. New Tables
    - `creator_verifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `business_name` (text)
      - `business_website` (text)
      - `business_description` (text)
      - `id_document_url` (text)
      - `id_type` (text)
      - `id_number` (text)
      - `status` (text)
      - `submitted_at` (timestamptz)
      - `reviewed_at` (timestamptz)
      - `reviewer_notes` (text)

  2. Security
    - Enable RLS on `creator_verifications` table
    - Add policies for user access and admin review
*/

-- Create creator_verifications table
CREATE TABLE creator_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_website text,
  business_description text NOT NULL,
  id_document_url text NOT NULL,
  id_type text NOT NULL,
  id_number text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewer_notes text,
  CONSTRAINT status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Add is_verified column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Enable RLS
ALTER TABLE creator_verifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own verifications"
  ON creator_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification requests"
  ON creator_verifications
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    NOT EXISTS (
      SELECT 1 FROM creator_verifications
      WHERE user_id = auth.uid() AND status = 'pending'
    )
  );

-- Function to update user verification status
CREATE OR REPLACE FUNCTION update_user_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE users SET is_verified = true WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating user verification status
CREATE TRIGGER update_user_verification
  AFTER UPDATE ON creator_verifications
  FOR EACH ROW
  WHEN (OLD.status != 'approved' AND NEW.status = 'approved')
  EXECUTE FUNCTION update_user_verification_status();