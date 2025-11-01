import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, UserPlus, LogIn } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner@2.0.3';

interface LoginProps {
  onLogin: (username: string) => void;
  onCreateTeam: (teamName: string) => void;
  teams: Array<{ id: string; name: string }>;
}

export function Login({ onLogin, onCreateTeam, teams }: LoginProps) {
  const [username, setUsername] = useState('');
  const [newTeamName, setNewTeamName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newTeamName.trim();
    
    if (!trimmedName) {
      toast.error('Please enter a team name');
      return;
    }

    // Check if team name already exists
    const existingTeam = teams.find(t => t.name.toLowerCase() === trimmedName.toLowerCase());
    if (existingTeam) {
      toast.error('This team name already exists. Please choose a different name.');
      return;
    }

    // Check if trying to use admin password
    if (trimmedName.toLowerCase() === 'uxcellence') {
      toast.error('This name is reserved. Please choose a different team name.');
      return;
    }

    // Create the team
    onCreateTeam(trimmedName);
    toast.success(`Team "${trimmedName}" created successfully! You can now login.`);
    setNewTeamName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            UXcellence
          </CardTitle>
          <CardDescription>
            Multi-Round Competition Event System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="create">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Team Name
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your team name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-input-background"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Don't have a team? Create one in the "Create Team" tab.
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="create">
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newTeamName">
                    Choose Your Team Name
                  </Label>
                  <Input
                    id="newTeamName"
                    type="text"
                    placeholder="e.g., Team Phoenix"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="bg-input-background"
                  />
                  {teams.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {teams.length} team{teams.length !== 1 ? 's' : ''} already registered
                    </p>
                  )}
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> Your team will be automatically registered and added to the current round. After creation, use the Login tab to access your dashboard.
                  </p>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
