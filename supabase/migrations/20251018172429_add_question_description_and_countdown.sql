-- Add description field to questions and countdown control
-- This migration enhances the question system with descriptions
-- and adds countdown functionality for synchronized reveals

-- Add description column to questions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'description'
  ) THEN
    ALTER TABLE questions ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

-- Create countdown_control table for managing countdown state
CREATE TABLE IF NOT EXISTS countdown_control (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid REFERENCES rounds(id) ON DELETE CASCADE,
  is_active boolean DEFAULT false,
  countdown_value integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(round_id)
);

-- Enable RLS on countdown_control
ALTER TABLE countdown_control ENABLE ROW LEVEL SECURITY;

-- RLS Policies for countdown_control (public read/write for real-time sync)
CREATE POLICY "Anyone can read countdown_control"
  ON countdown_control FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert countdown_control"
  ON countdown_control FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update countdown_control"
  ON countdown_control FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete countdown_control"
  ON countdown_control FOR DELETE
  TO anon
  USING (true);