import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { ThemeProvider } from './components/ThemeProvider';
import { Team, Question, Round, User } from './types';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from './utils/supabase/info';

export default function App() {
  const [user, setUser] = useState<User>({ role: null });
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [rounds, setRounds] = useState<Round[]>([
    {
      number: 1,
      name: 'Style Battle',
      maxTeams: 30,
      description: 'Test on HTML + CSS skills',
    },
    {
      number: 2,
      name: 'Design Remix',
      maxTeams: 20,
      description: 'Creative design twist challenge',
    },
    {
      number: 3,
      name: 'UXcellence Grand Showdown',
      maxTeams: 10,
      description: 'Final design presentation & justification',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8ff233bb`;

  // Fetch initial state from backend
  useEffect(() => {
    fetchState();
    
    // Poll for updates every 3 seconds when logged in
    const interval = setInterval(() => {
      if (user.role) {
        fetchState();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [user.role]);

  const fetchState = async () => {
    try {
      const response = await fetch(`${API_BASE}/state`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams || []);
        setQuestions(data.questions || []);
        setCurrentRound(data.currentRound || 1);
        if (data.rounds) {
          setRounds(data.rounds);
        }
      }
    } catch (error) {
      console.error('Error fetching state:', error);
      toast.error('Failed to load game state');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTeams = async (newTeams: Team[]) => {
    try {
      await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(newTeams),
      });
    } catch (error) {
      console.error('Error saving teams:', error);
      toast.error('Failed to save teams');
    }
  };

  const saveQuestions = async (newQuestions: Question[]) => {
    try {
      await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(newQuestions),
      });
    } catch (error) {
      console.error('Error saving questions:', error);
      toast.error('Failed to save questions');
    }
  };

  const saveCurrentRound = async (round: number) => {
    try {
      await fetch(`${API_BASE}/currentRound`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ currentRound: round }),
      });
    } catch (error) {
      console.error('Error saving current round:', error);
      toast.error('Failed to save round');
    }
  };

  const saveRounds = async (newRounds: Round[]) => {
    try {
      await fetch(`${API_BASE}/rounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(newRounds),
      });
    } catch (error) {
      console.error('Error saving rounds:', error);
      toast.error('Failed to save rounds');
    }
  };

  const handleLogin = (username: string) => {
    if (username.toLowerCase() === 'uxcellence') {
      setUser({ role: 'admin' });
    } else {
      const team = teams.find(t => t.name.toLowerCase() === username.toLowerCase());
      if (team) {
        setUser({ role: 'participant', teamName: team.name, teamId: team.id });
      } else {
        // Allow login attempt even if team not found to show the proper error screen
        setUser({ role: 'participant', teamName: username, teamId: 'not-found' });
      }
    }
  };

  const handleLogout = () => {
    setUser({ role: null });
  };

  const handleAddTeam = (teamName: string) => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamName,
      round: currentRound,
      hasSpun: false,
    };
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    saveTeams(updatedTeams);
  };

  const handleDeleteTeam = (teamId: string) => {
    const updatedTeams = teams.filter(t => t.id !== teamId);
    setTeams(updatedTeams);
    saveTeams(updatedTeams);
  };

  const handleAddQuestion = (question: string, description: string, round: number) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      round,
      question,
      description,
      isLocked: false,
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };

  const handleSpin = (teamId: string, questionId: string) => {
    // Lock the question and assign it to the team
    const updatedQuestions = questions.map(q => 
      q.id === questionId 
        ? { ...q, isLocked: true, assignedToTeamId: teamId }
        : q
    );
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);

    // Mark team as having spun and assign question
    const updatedTeams = teams.map(t => 
      t.id === teamId 
        ? { ...t, hasSpun: true, assignedQuestionId: questionId }
        : t
    );
    setTeams(updatedTeams);
    saveTeams(updatedTeams);
  };

  const handleCompleteRound = (selectedTeamIds: string[]) => {
    if (currentRound >= 3) return;

    const currentRoundTeams = teams.filter(t => t.round === currentRound);
    
    // Delete unselected teams from the current round
    const updatedTeams = teams.filter(t => {
      // Keep teams from other rounds
      if (t.round !== currentRound) return true;
      // Keep only selected teams from current round
      return selectedTeamIds.includes(t.id);
    }).map(t => {
      // Advance selected teams to next round
      if (selectedTeamIds.includes(t.id) && t.round === currentRound) {
        return { ...t, round: currentRound + 1, hasSpun: false, assignedQuestionId: undefined };
      }
      return t;
    });
    
    setTeams(updatedTeams);
    saveTeams(updatedTeams);

    // Move to next round
    const newRound = currentRound + 1;
    setCurrentRound(newRound);
    saveCurrentRound(newRound);
  };

  const handleUpdateRoundMaxTeams = (roundNumber: number, maxTeams: number) => {
    const updatedRounds = rounds.map(r => 
      r.number === roundNumber ? { ...r, maxTeams } : r
    );
    setRounds(updatedRounds);
    saveRounds(updatedRounds);
  };

  const handleUpdateMarks = (teamId: string, marks: number, reason: string) => {
    const updatedTeams = teams.map(t =>
      t.id === teamId ? { ...t, marks, reason } : t
    );
    setTeams(updatedTeams);
    saveTeams(updatedTeams);
  };

  const handleResetCurrentRound = () => {
    // Reset hasSpun and assignedQuestionId for all teams in current round
    const updatedTeams = teams.map(t => {
      if (t.round === currentRound) {
        return { ...t, hasSpun: false, assignedQuestionId: undefined };
      }
      return t;
    });
    setTeams(updatedTeams);
    saveTeams(updatedTeams);

    // Unlock all questions in current round
    const updatedQuestions = questions.map(q => {
      if (q.round === currentRound) {
        return { ...q, isLocked: false, assignedToTeamId: undefined };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };

  const handleResetAllRounds = () => {
    // Reset all teams to round 1
    const updatedTeams = teams.map(t => ({
      ...t,
      round: 1,
      hasSpun: false,
      assignedQuestionId: undefined,
      marks: undefined,
      reason: undefined,
    }));
    setTeams(updatedTeams);
    saveTeams(updatedTeams);

    // Unlock all questions
    const updatedQuestions = questions.map(q => ({
      ...q,
      isLocked: false,
      assignedToTeamId: undefined,
    }));
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);

    // Reset to round 1
    setCurrentRound(1);
    saveCurrentRound(1);
  };

  // Check if all teams in current round have been assigned questions
  const currentRoundTeams = teams.filter(t => t.round === currentRound);
  const allTeamsAssigned = currentRoundTeams.length > 0 && 
    currentRoundTeams.every(t => t.assignedQuestionId);

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900">
          <div className="text-white text-center space-y-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xl">Loading UXcellence...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {!user.role ? (
        <>
          <Login onLogin={handleLogin} onCreateTeam={handleAddTeam} teams={teams} />
          <Toaster />
        </>
      ) : user.role === 'admin' ? (
        <>
          <AdminDashboard
            teams={teams}
            questions={questions}
            currentRound={currentRound}
            rounds={rounds}
            onAddTeam={handleAddTeam}
            onDeleteTeam={handleDeleteTeam}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onCompleteRound={handleCompleteRound}
            onUpdateRoundMaxTeams={handleUpdateRoundMaxTeams}
            onUpdateMarks={handleUpdateMarks}
            onResetCurrentRound={handleResetCurrentRound}
            onResetAllRounds={handleResetAllRounds}
            onLogout={handleLogout}
          />
          <Toaster />
        </>
      ) : user.role === 'participant' && user.teamId ? (
        (() => {
          // Try to find team by id first, then by name
          let team = teams.find(t => t.id === user.teamId);
          
          // If not found by id, try to find by name (for teams added after login)
          if (!team && user.teamName) {
            team = teams.find(t => t.name.toLowerCase() === user.teamName.toLowerCase());
            // Update user state with correct team id
            if (team) {
              setUser({ ...user, teamId: team.id });
            }
          }
          
          if (!team) {
            return (
              <>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 p-4">
                  <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h2 className="text-red-600 dark:text-red-400">Team Not Found</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Your team hasn't been registered yet. Please contact the admin to add your team to the system.
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md transition-all"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                </div>
                <Toaster />
              </>
            );
          }

          return (
            <>
              <ParticipantDashboard
                team={team}
                questions={questions}
                currentRound={currentRound}
                rounds={rounds}
                onSpin={(questionId) => handleSpin(user.teamId!, questionId)}
                onLogout={handleLogout}
                allTeamsAssigned={allTeamsAssigned}
              />
              <Toaster />
            </>
          );
        })()
      ) : (
        <>
          <div className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
          </div>
          <Toaster />
        </>
      )}
    </ThemeProvider>
  );
}
