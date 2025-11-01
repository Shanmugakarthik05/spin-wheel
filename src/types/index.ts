export interface Team {
  id: string;
  name: string;
  round: number;
  assignedQuestionId?: string;
  hasSpun?: boolean;
  marks?: number;
  reason?: string;
}

export interface Question {
  id: string;
  round: number;
  question: string;
  description: string;
  isLocked: boolean;
  assignedToTeamId?: string;
}

export interface Round {
  number: 1 | 2 | 3;
  name: string;
  maxTeams: number;
  description: string;
}

export type UserRole = 'admin' | 'participant' | null;

export interface User {
  role: UserRole;
  teamName?: string;
  teamId?: string;
}
