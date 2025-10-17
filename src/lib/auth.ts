import { supabase } from './supabase';

export type UserRole = 'admin' | 'participant';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  currentRoundId?: string | null;
}

export const loginAsAdmin = async (eventName: string, password: string): Promise<AuthUser | null> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('event_name', eventName)
    .eq('password', password)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.event_name,
    role: 'admin',
  };
};

export const loginAsParticipant = async (teamName: string, password: string): Promise<AuthUser | null> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('name', teamName)
    .eq('password', password)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    role: 'participant',
    currentRoundId: data.current_round_id,
  };
};

export const saveAuthUser = (user: AuthUser) => {
  localStorage.setItem('authUser', JSON.stringify(user));
};

export const getAuthUser = (): AuthUser | null => {
  const stored = localStorage.getItem('authUser');
  return stored ? JSON.parse(stored) : null;
};

export const logout = () => {
  localStorage.removeItem('authUser');
};
