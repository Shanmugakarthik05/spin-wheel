import { useState, useEffect } from 'react';
import { Play, Pause, RotateCw, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Round {
  id: string;
  name: string;
  description: string;
  round_number: number;
  is_active: boolean;
  team_count: number;
}

export default function RoundControl() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRounds();
  }, []);

  const loadRounds = async () => {
    const { data } = await supabase
      .from('rounds')
      .select('*')
      .order('round_number');

    if (data) setRounds(data);
  };

  const activateRound = async (roundId: string) => {
    setLoading(true);
    try {
      await supabase.from('rounds').update({ is_active: false }).neq('id', roundId);
      await supabase.from('rounds').update({ is_active: true }).eq('id', roundId);
      await loadRounds();
    } finally {
      setLoading(false);
    }
  };

  const resetRound = async (roundId: string) => {
    if (!confirm('Are you sure you want to reset this round? This will clear all assignments.')) return;

    setLoading(true);
    try {
      await supabase.from('question_assignments').delete().eq('round_id', roundId);
      await supabase.from('spin_history').delete().eq('round_id', roundId);
      await supabase.from('questions').update({ is_locked: false }).eq('round_id', roundId);
      await loadRounds();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Round Management</h2>

      {rounds.map((round) => (
        <div
          key={round.id}
          className={`border rounded-xl p-6 transition-all ${
            round.is_active
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 border-white/20'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold text-white">{round.name}</h3>
                {round.is_active && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/50 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm mb-2">{round.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Round {round.round_number}</span>
                <span>•</span>
                <span>{round.team_count} Teams</span>
              </div>
            </div>

            <div className="flex space-x-2">
              {!round.is_active && (
                <button
                  onClick={() => activateRound(round.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Activate</span>
                </button>
              )}
              {round.is_active && (
                <button
                  disabled
                  className="px-4 py-2 bg-green-500/50 text-white rounded-lg font-medium flex items-center space-x-2 cursor-not-allowed"
                >
                  <Pause className="w-4 h-4" />
                  <span>Current</span>
                </button>
              )}
              <button
                onClick={() => resetRound(round.id)}
                disabled={loading}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
