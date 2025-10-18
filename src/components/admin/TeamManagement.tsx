import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Team {
  id: string;
  name: string;
  password: string;
  is_active: boolean;
  created_at: string;
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', password: '' });

  useEffect(() => {
    loadTeams();

    const channel = supabase
      .channel('teams-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, loadTeams)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTeams = async () => {
    const { data } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
    if (data) setTeams(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('teams').insert([formData]);
    setFormData({ name: '', password: '' });
    setShowAddForm(false);
  };

  const handleUpdate = async (id: string) => {
    await supabase.from('teams').update(formData).eq('id', id);
    setEditingId(null);
    setFormData({ name: '', password: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    await supabase.from('teams').delete().eq('id', id);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase.from('teams').update({ is_active: !currentStatus }).eq('id', id);
  };

  const startEdit = (team: Team) => {
    setEditingId(team.id);
    setFormData({ name: team.name, password: team.password });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', password: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Team Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white/5 border border-white/20 rounded-xl p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter team name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
            >
              Add Team
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setFormData({ name: '', password: '' });
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white/5 border border-white/20 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all"
          >
            {editingId === team.id ? (
              <div className="flex-1 grid grid-cols-2 gap-4 mr-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-white font-medium">{team.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      team.is_active
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/50'
                    }`}
                  >
                    {team.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Password: {team.password}</p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {editingId === team.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(team.id)}
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
                    onClick={() => toggleActive(team.id, team.is_active)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      team.is_active
                        ? 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-200'
                        : 'bg-green-500/20 hover:bg-green-500/30 text-green-200'
                    }`}
                  >
                    {team.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => startEdit(team)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {teams.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No teams yet. Add your first team to get started.
          </div>
        )}
      </div>
    </div>
  );
}
