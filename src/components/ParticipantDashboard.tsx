import { useState, useEffect } from 'react';
import { LogOut, Trophy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthUser, logout } from '../lib/auth';
import SpinWheel from './SpinWheel';

interface ParticipantDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

interface Question {
  id: string;
  content: string;
  description: string;
  order_index: number;
  is_locked: boolean;
}

interface Round {
  id: string;
  name: string;
  description: string;
  round_number: number;
}

interface Assignment {
  id: string;
  question_content: string;
  question_description: string;
  assigned_at: string;
}

export default function ParticipantDashboard({ user, onLogout }: ParticipantDashboardProps) {
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [myAssignment, setMyAssignment] = useState<Assignment | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    loadRoundData();

    const questionsChannel = supabase
      .channel('questions-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, loadRoundData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rounds' }, loadRoundData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'question_assignments' }, loadRoundData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'countdown_control' }, handleCountdownUpdate)
      .subscribe();

    return () => {
      supabase.removeChannel(questionsChannel);
    };
  }, [user.id]);

  const handleCountdownUpdate = async () => {
    if (!activeRound) return;

    const { data } = await supabase
      .from('countdown_control')
      .select('*')
      .eq('round_id', activeRound.id)
      .maybeSingle();

    if (data && data.is_active) {
      setCountdownValue(3);
      setShowDescription(false);

      let currentValue = 3;
      const interval = setInterval(() => {
        currentValue -= 1;
        if (currentValue > 0) {
          setCountdownValue(currentValue);
        } else {
          setCountdownValue(null);
          setShowDescription(true);
          clearInterval(interval);
        }
      }, 1000);
    } else {
      setCountdownValue(null);
    }
  };

  const loadRoundData = async () => {
    const { data: roundData } = await supabase
      .from('rounds')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (roundData) {
      setActiveRound(roundData);

      const { data: assignmentData } = await supabase
        .from('question_assignments')
        .select(`
          id,
          assigned_at,
          questions:question_id (content, description)
        `)
        .eq('team_id', user.id)
        .eq('round_id', roundData.id)
        .maybeSingle();

      if (assignmentData) {
        const question = assignmentData.questions as any;
        setMyAssignment({
          id: assignmentData.id,
          question_content: question?.content || 'Unknown',
          question_description: question?.description || '',
          assigned_at: assignmentData.assigned_at,
        });
        setHasSpun(true);
        setShowResult(true);
      } else {
        setMyAssignment(null);
        setHasSpun(false);
        setShowDescription(false);
      }

      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .eq('round_id', roundData.id)
        .eq('is_locked', false)
        .order('order_index');

      if (questionsData) {
        setAvailableQuestions(questionsData);
      }
    }
  };

  const handleSpin = async (questionId: string) => {
    if (!activeRound || hasSpun) return;

    try {
      await supabase.from('questions').update({ is_locked: true }).eq('id', questionId);

      const { error: assignmentError } = await supabase.from('question_assignments').insert([
        {
          team_id: user.id,
          question_id: questionId,
          round_id: activeRound.id,
        },
      ]);

      if (assignmentError) {
        await supabase.from('questions').update({ is_locked: false }).eq('id', questionId);
        alert('Failed to assign question. Please try again.');
        return;
      }

      await supabase.from('spin_history').insert([
        {
          team_id: user.id,
          question_id: questionId,
          round_id: activeRound.id,
        },
      ]);

      setHasSpun(true);
      setTimeout(() => {
        setShowResult(true);
        loadRoundData();
      }, 500);
    } catch (error) {
      console.error('Error during spin:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10">
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">UXcellence</h1>
                  <p className="text-sm text-gray-300">{user.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeRound ? (
            <>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{activeRound.name}</h2>
                <p className="text-cyan-300 text-lg">{activeRound.description}</p>
                <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/50">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">Round {activeRound.round_number}</span>
                </div>
              </div>

              {countdownValue !== null && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl font-bold text-white mb-8 animate-bounce">
                      {countdownValue}
                    </div>
                    <p className="text-2xl text-cyan-300">Get ready for your challenge...</p>
                  </div>
                </div>
              )}

              {!showResult ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Spin to Get Your Question</h3>
                    <p className="text-gray-300">
                      {availableQuestions.length} questions available
                    </p>
                  </div>
                  <SpinWheel
                    questions={availableQuestions}
                    onSpin={handleSpin}
                    disabled={hasSpun}
                  />
                </div>
              ) : myAssignment ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Your Challenge</h3>
                    <p className="text-gray-300">Here is your assigned question for this round</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 rounded-xl p-8 mb-6">
                    <h4 className="text-cyan-300 text-sm font-medium mb-3">QUESTION</h4>
                    <p className="text-white text-xl font-semibold leading-relaxed mb-6">
                      {myAssignment.question_content}
                    </p>

                    {showDescription && myAssignment.question_description && (
                      <div className="pt-6 border-t border-white/20 animate-fade-in">
                        <h4 className="text-purple-300 text-sm font-medium mb-3">DESCRIPTION</h4>
                        <p className="text-gray-200 text-lg leading-relaxed">
                          {myAssignment.question_description}
                        </p>
                      </div>
                    )}

                    {!showDescription && myAssignment.question_description && (
                      <div className="pt-6 border-t border-white/20">
                        <p className="text-yellow-300 text-sm text-center animate-pulse">
                          ⏳ Waiting for countdown to reveal full description...
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Assigned: {new Date(myAssignment.assigned_at).toLocaleString()}</span>
                  </div>

                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-3 bg-green-500/20 text-green-300 rounded-lg border border-green-500/50">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Good luck with your challenge!</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Active Round</h3>
              <p className="text-gray-300">
                Please wait for the admin to activate a round. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
