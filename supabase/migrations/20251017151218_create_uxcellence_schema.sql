-- UXcellence Spin Wheel Event System Database Schema
-- This migration creates the complete database structure for a multi-round 
-- spin wheel competition system with role-based access control.
--
-- Tables Created:
-- 1. admin_users - Admin authentication
-- 2. rounds - Competition rounds (Round 1, 2, Final)
-- 3. teams - Participating teams
-- 4. questions - Round questions
-- 5. question_assignments - Team-Question mappings
-- 6. spin_history - Audit trail of spins

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create rounds table
CREATE TABLE IF NOT EXISTS rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  round_number integer NOT NULL,
  is_active boolean DEFAULT false,
  team_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  password text NOT NULL,
  is_active boolean DEFAULT true,
  current_round_id uuid REFERENCES rounds(id),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id)
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid REFERENCES rounds(id) ON DELETE CASCADE,
  content text NOT NULL,
  order_index integer DEFAULT 0,
  is_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create question_assignments table
CREATE TABLE IF NOT EXISTS question_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  round_id uuid REFERENCES rounds(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(team_id, round_id)
);

-- Create spin_history table
CREATE TABLE IF NOT EXISTS spin_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  round_id uuid REFERENCES rounds(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  spun_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE spin_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users (public read for login)
CREATE POLICY "Anyone can read admin_users for authentication"
  ON admin_users FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for rounds (public read, no auth needed)
CREATE POLICY "Anyone can read rounds"
  ON rounds FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for teams (public read for login)
CREATE POLICY "Anyone can read teams for authentication"
  ON teams FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update teams"
  ON teams FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for questions (public read)
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update questions"
  ON questions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for question_assignments (public read)
CREATE POLICY "Anyone can read question_assignments"
  ON question_assignments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert question_assignments"
  ON question_assignments FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for spin_history (public read/write)
CREATE POLICY "Anyone can read spin_history"
  ON spin_history FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert spin_history"
  ON spin_history FOR INSERT
  TO anon
  WITH CHECK (true);

-- Insert default admin user (event name: UXcellence, password: admin123)
INSERT INTO admin_users (event_name, password)
VALUES ('UXcellence', 'admin123')
ON CONFLICT (event_name) DO NOTHING;

-- Insert default rounds
INSERT INTO rounds (name, description, round_number, is_active, team_count)
VALUES 
  ('Style Battle', 'Test on HTML + CSS skills', 1, true, 30),
  ('Design Remix', 'Creative design twist challenge', 2, false, 20),
  ('UXcellence Grand Showdown', 'Final design presentation & justification', 3, false, 10)
ON CONFLICT DO NOTHING;