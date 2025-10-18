import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  admin_users: {
    id: string;
    event_name: string;
    password: string;
    created_at: string;
  };
  rounds: {
    id: string;
    name: string;
    description: string;
    round_number: number;
    is_active: boolean;
    team_count: number;
    created_at: string;
  };
  teams: {
    id: string;
    name: string;
    password: string;
    is_active: boolean;
    current_round_id: string | null;
    created_at: string;
    created_by: string | null;
  };
  questions: {
    id: string;
    round_id: string;
    content: string;
    order_index: number;
    is_locked: boolean;
    created_at: string;
  };
  question_assignments: {
    id: string;
    team_id: string;
    question_id: string;
    round_id: string;
    assigned_at: string;
  };
  spin_history: {
    id: string;
    team_id: string;
    round_id: string;
    question_id: string;
    spun_at: string;
  };
};
