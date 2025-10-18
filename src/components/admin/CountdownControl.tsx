import { useState, useEffect } from 'react';
import { Play, StopCircle, Users, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Round {
  id: string;
  name: string;
  team_count: number;
}

export default function CountdownControl() {
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [assignedCount, setAssignedCount] = useState(0);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoundData();

    const channel = supabase
      .channel('countdown-admin-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'question_assignments' }, loadRoundData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rounds' }, loadRoundData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'countdown_control' }, checkCountdownStatus)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadRoundData = async () => {
    const { data: roundData } = await supabase
      .from('rounds')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (roundData) {
      setActiveRound(roundData);

      const { data: assignments } = await supabase
        .from('question_assignments')
        .select('id')
        .eq('round_id', roundData.id);

      setAssignedCount(assignments?.length || 0);
    }
  };

  const checkCountdownStatus = async () => {
    if (!activeRound) return;

    const { data } = await supabase
      .from('countdown_control')
      .select('is_active')
      .eq('round_id', activeRound.id)
      .maybeSingle();

    setIsCountdownActive(data?.is_active || false);
  };

  const startCountdown = async () => {
    if (!activeRound) return;

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('countdown_control')
        .select('id')
        .eq('round_id', activeRound.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('countdown_control')
          .update({
            is_active: true,
            countdown_value: 3,
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('round_id', activeRound.id);
      } else {
        await supabase.from('countdown_control').insert([
          {
            round_id: activeRound.id,
            is_active: true,
            countdown_value: 3,
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }

      setIsCountdownActive(true);
    } finally {
      setLoading(false);
    }
  };

  const stopCountdown = async () => {
    if (!activeRound) return;

    setLoading(true);
    try {
      await supabase
        .from('countdown_control')
        .update({
          is_active: false,
          countdown_value: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('round_id', activeRound.id);

      setIsCountdownActive(false);
    } finally {
      setLoading(false);
    }
  };

  if (!activeRound) {
    return (
      <div className="text-center py-8 text-gray-400">
        No active round. Please activate a round first.
      </div>
    );
  }

  const allTeamsAssigned = assignedCount >= activeRound.team_count;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Countdown Control</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Round</p>
                <p className="text-xl font-bold text-white mt-1">{activeRound.name}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Expected Teams</p>
                <p className="text-xl font-bold text-white mt-1">{activeRound.team_count}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${
            allTeamsAssigned
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Teams Assigned</p>
                <p className="text-xl font-bold text-white mt-1">{assignedCount}</p>
              </div>
              {allTeamsAssigned ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <Users className="w-8 h-8 text-yellow-400" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold text-white mb-2">
              {isCountdownActive ? 'Countdown In Progress' : 'Start Countdown'}
            </h4>
            <p className="text-gray-300 text-sm">
              {isCountdownActive
                ? 'All participants are seeing the countdown (3, 2, 1) before descriptions are revealed.'
                : allTeamsAssigned
                ? 'All teams have been assigned questions. Click to start the countdown.'
                : `Waiting for all teams to receive questions (${assignedCount}/${activeRound.team_count})`}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            {!isCountdownActive ? (
              <button
                onClick={startCountdown}
                disabled={loading || !allTeamsAssigned}
                className={`px-8 py-3 rounded-lg font-bold text-lg transition-all flex items-center space-x-2 ${
                  allTeamsAssigned
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 text-white'
                    : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5" />
                <span>Start Countdown</span>
              </button>
            ) : (
              <button
                onClick={stopCountdown}
                disabled={loading}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-lg transition-all flex items-center space-x-2"
              >
                <StopCircle className="w-5 h-5" />
                <span>Stop Countdown</span>
              </button>
            )}
          </div>
        </div>

        {!allTeamsAssigned && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200 text-sm text-center">
              💡 The countdown will be enabled once all {activeRound.team_count} teams have spun the wheel and received their questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
