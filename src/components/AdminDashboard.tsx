import { useState, useEffect } from 'react';
import { LogOut, Users, FileQuestion, Settings, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthUser, logout } from '../lib/auth';
import TeamManagement from './admin/TeamManagement';
import QuestionManagement from './admin/QuestionManagement';
import RoundControl from './admin/RoundControl';
import AssignmentsView from './admin/AssignmentsView';

interface AdminDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

type TabType = 'teams' | 'questions' | 'rounds' | 'assignments';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('rounds');
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeTeams: 0,
    totalQuestions: 0,
    assignedQuestions: 0,
  });

  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel('admin-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, loadStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, loadStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'question_assignments' }, loadStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadStats = async () => {
    const [teamsRes, questionsRes, assignmentsRes] = await Promise.all([
      supabase.from('teams').select('id, is_active'),
      supabase.from('questions').select('id, is_locked'),
      supabase.from('question_assignments').select('id'),
    ]);

    setStats({
      totalTeams: teamsRes.data?.length || 0,
      activeTeams: teamsRes.data?.filter(t => t.is_active).length || 0,
      totalQuestions: questionsRes.data?.length || 0,
      assignedQuestions: assignmentsRes.data?.length || 0,
    });
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const tabs = [
    { id: 'rounds' as TabType, label: 'Round Control', icon: Trophy },
    { id: 'teams' as TabType, label: 'Teams', icon: Users },
    { id: 'questions' as TabType, label: 'Questions', icon: FileQuestion },
    { id: 'assignments' as TabType, label: 'Assignments', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10">
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Teams</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.totalTeams}</p>
                </div>
                <Users className="w-10 h-10 text-cyan-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Active Teams</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.activeTeams}</p>
                </div>
                <Users className="w-10 h-10 text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Questions</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.totalQuestions}</p>
                </div>
                <FileQuestion className="w-10 h-10 text-purple-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Assigned</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.assignedQuestions}</p>
                </div>
                <Trophy className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
            <div className="border-b border-white/20 bg-white/5">
              <div className="flex space-x-1 p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'rounds' && <RoundControl />}
              {activeTab === 'teams' && <TeamManagement />}
              {activeTab === 'questions' && <QuestionManagement />}
              {activeTab === 'assignments' && <AssignmentsView />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
