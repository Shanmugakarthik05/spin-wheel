import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Lock, Unlock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Question {
  id: string;
  round_id: string;
  content: string;
  description: string;
  order_index: number;
  is_locked: boolean;
}

interface Round {
  id: string;
  name: string;
  round_number: number;
}

export default function QuestionManagement() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ content: '', description: '' });

  useEffect(() => {
    loadRounds();
  }, []);

  useEffect(() => {
    if (selectedRoundId) {
      loadQuestions();
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

  const loadQuestions = async () => {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('round_id', selectedRoundId)
      .order('order_index');
    if (data) setQuestions(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const maxOrder = questions.length > 0 ? Math.max(...questions.map(q => q.order_index)) : 0;
    await supabase.from('questions').insert([{
      ...formData,
      round_id: selectedRoundId,
      order_index: maxOrder + 1,
    }]);
    setFormData({ content: '', description: '' });
    setShowAddForm(false);
    loadQuestions();
  };

  const handleUpdate = async (id: string) => {
    await supabase.from('questions').update(formData).eq('id', id);
    setEditingId(null);
    setFormData({ content: '', description: '' });
    loadQuestions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    await supabase.from('questions').delete().eq('id', id);
    loadQuestions();
  };

  const toggleLock = async (id: string, currentStatus: boolean) => {
    await supabase.from('questions').update({ is_locked: !currentStatus }).eq('id', id);
    loadQuestions();
  };

  const startEdit = (question: Question) => {
    setEditingId(question.id);
    setFormData({ content: question.content, description: question.description || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ content: '', description: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">Question Management</h2>
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
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white/5 border border-white/20 rounded-xl p-6 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Question Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-24"
              placeholder="Enter question content (shown on wheel)"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description (Revealed After Countdown)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-32"
              placeholder="Enter detailed description (revealed after countdown)"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
            >
              Add Question
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setFormData({ content: '', description: '' });
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between">
              {editingId === question.id ? (
                <div className="flex-1 mr-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Question</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-24"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded border border-cyan-500/50">
                      Q{index + 1}
                    </span>
                    {question.is_locked && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded border border-red-500/50 flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                  <p className="text-white font-medium mb-2">{question.content}</p>
                  {question.description && (
                    <p className="text-gray-400 text-sm">{question.description}</p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                {editingId === question.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(question.id)}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleLock(question.id, question.is_locked)}
                      className={`p-2 rounded-lg transition-all ${
                        question.is_locked
                          ? 'bg-green-500/20 hover:bg-green-500/30 text-green-200'
                          : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200'
                      }`}
                    >
                      {question.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(question)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No questions yet for this round. Add your first question to get started.
          </div>
        )}
      </div>
    </div>
  );
}
