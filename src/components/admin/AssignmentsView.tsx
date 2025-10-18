import { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Assignment {
  id: string;
  team_name: string;
  question_content: string;
  round_name: string;
  assigned_at: string;
}

interface Round {
  id: string;
  name: string;
  round_number: number;
}

export default function AssignmentsView() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<string>('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    loadRounds();
  }, []);

  useEffect(() => {
    if (selectedRoundId) {
      loadAssignments();

      const channel = supabase
        .channel('assignments-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'question_assignments' }, loadAssignments)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedRoundId]);

  const loadRounds = async () => {
    const { data } = await supabase.from('rounds').select('*').order('round_number');
    if (data && data.length > 0) {
      setRounds(data);
      if (!selectedRoundId) {
        setSelectedRoundId(data[0].id);
      }
    }
  };

  const loadAssignments = async () => {
    const { data } = await supabase
      .from('question_assignments')
      .select(`
        id,
        assigned_at,
        teams:team_id (name),
        questions:question_id (content),
        rounds:round_id (name)
      `)
      .eq('round_id', selectedRoundId)
      .order('assigned_at', { ascending: false });

    if (data) {
      const formatted = data.map((a: any) => ({
        id: a.id,
        team_name: a.teams?.name || 'Unknown',
        question_content: a.questions?.content || 'Unknown',
        round_name: a.rounds?.name || 'Unknown',
        assigned_at: a.assigned_at,
      }));
      setAssignments(formatted);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">Question Assignments</h2>
          <select
            value={selectedRoundId}
            onChange={(e) => setSelectedRoundId(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {rounds.map((round) => (
              <option key={round.id} value={round.id} className="bg-slate-800">
                {round.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-400">
          Total Assignments: <span className="text-white font-medium">{assignments.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white/5 border border-white/20 rounded-xl p-5 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">{assignment.team_name}</h3>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-3">
                  <p className="text-cyan-100 text-sm leading-relaxed">{assignment.question_content}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Assigned: {formatDate(assignment.assigned_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {assignments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No assignments yet for this round. Teams will appear here after they spin the wheel.
          </div>
        )}
      </div>
    </div>
  );
}
