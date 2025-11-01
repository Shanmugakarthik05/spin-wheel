import { useState } from 'react';
import { Team, Question, Round } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Users, FileQuestion, Trophy, Plus, Trash2, LogOut, Settings, ClipboardList, RotateCcw, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ThemeToggle } from './ThemeToggle';
import { MarksSheet } from './MarksSheet';

interface AdminDashboardProps {
  teams: Team[];
  questions: Question[];
  currentRound: number;
  rounds: Round[];
  onAddTeam: (teamName: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onAddQuestion: (question: string, description: string, round: number) => void;
  onDeleteQuestion: (questionId: string) => void;
  onCompleteRound: (selectedTeamIds: string[]) => void;
  onUpdateRoundMaxTeams: (roundNumber: number, maxTeams: number) => void;
  onUpdateMarks: (teamId: string, marks: number, reason: string) => void;
  onResetCurrentRound: () => void;
  onResetAllRounds: () => void;
  onLogout: () => void;
}

export function AdminDashboard({
  teams,
  questions,
  currentRound,
  rounds,
  onAddTeam,
  onDeleteTeam,
  onAddQuestion,
  onDeleteQuestion,
  onCompleteRound,
  onUpdateRoundMaxTeams,
  onUpdateMarks,
  onResetCurrentRound,
  onResetAllRounds,
  onLogout,
}: AdminDashboardProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCompleteRoundOpen, setIsCompleteRoundOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetAllConfirmOpen, setIsResetAllConfirmOpen] = useState(false);
  const [roundMaxTeams, setRoundMaxTeams] = useState<Record<number, string>>({
    1: rounds[0]?.maxTeams.toString() || '30',
    2: rounds[1]?.maxTeams.toString() || '20',
    3: rounds[2]?.maxTeams.toString() || '10',
  });

  const currentRoundData = rounds.find(r => r.number === currentRound);
  const currentRoundTeams = teams.filter(t => t.round === currentRound);
  const currentRoundQuestions = questions.filter(q => q.round === currentRound);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      onAddTeam(newTeamName.trim());
      setNewTeamName('');
      setIsAddTeamOpen(false);
      toast.success('Team added successfully!');
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newDescription.trim()) {
      onAddQuestion(newQuestion.trim(), newDescription.trim(), currentRound);
      setNewQuestion('');
      setNewDescription('');
      setIsAddQuestionOpen(false);
      toast.success('Question added successfully!');
    }
  };

  const handleOpenCompleteRound = () => {
    if (selectedTeamIds.length === 0) {
      toast.error('Please select at least one team to advance to the next round');
      return;
    }
    
    if (currentRound === 3) {
      toast.info('This is the final round!');
      return;
    }

    setIsCompleteRoundOpen(true);
  };

  const handleAdvanceToNextRound = () => {
    const unselectedCount = currentRoundTeams.length - selectedTeamIds.length;
    onCompleteRound(selectedTeamIds);
    setSelectedTeamIds([]);
    setIsCompleteRoundOpen(false);
    toast.success(`Round ${currentRound} completed! Advanced ${selectedTeamIds.length} teams to Round ${currentRound + 1}. ${unselectedCount} teams deleted.`);
  };

  const handleToggleTeamSelection = (teamId: string) => {
    setSelectedTeamIds(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAllTeams = () => {
    if (selectedTeamIds.length === currentRoundTeams.length) {
      setSelectedTeamIds([]);
    } else {
      setSelectedTeamIds(currentRoundTeams.map(t => t.id));
    }
  };

  const handleTryAgain = () => {
    onResetCurrentRound();
    setSelectedTeamIds([]);
    setIsCompleteRoundOpen(false);
    toast.success(`Round ${currentRound} has been reset! Teams can spin again.`);
  };

  const handleResetCurrentRound = () => {
    onResetCurrentRound();
    setSelectedTeamIds([]);
    setIsResetConfirmOpen(false);
    toast.success(`Round ${currentRound} has been reset!`);
  };

  const handleResetAllRounds = () => {
    onResetAllRounds();
    setSelectedTeamIds([]);
    setIsResetAllConfirmOpen(false);
    toast.success('All rounds have been reset! Game restarted from Round 1.');
  };

  const handleUpdateMaxTeams = () => {
    Object.entries(roundMaxTeams).forEach(([roundNum, maxTeams]) => {
      const count = parseInt(maxTeams);
      if (!isNaN(count) && count > 0) {
        onUpdateRoundMaxTeams(parseInt(roundNum), count);
      }
    });
    setIsSettingsOpen(false);
    toast.success('Round settings updated!');
  };

  const allTeamsHaveQuestions = currentRoundTeams.length > 0 && 
    currentRoundTeams.every(t => t.assignedQuestionId);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              UXcellence Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage teams, questions, and rounds</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Round Settings</DialogTitle>
                  <DialogDescription>
                    Customize the maximum number of teams per round
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {rounds.map((round) => (
                    <div key={round.number} className="space-y-2">
                      <Label htmlFor={`round-${round.number}`}>
                        Round {round.number}: {round.name}
                      </Label>
                      <Input
                        id={`round-${round.number}`}
                        type="number"
                        placeholder="Max teams"
                        value={roundMaxTeams[round.number]}
                        onChange={(e) => setRoundMaxTeams({
                          ...roundMaxTeams,
                          [round.number]: e.target.value
                        })}
                      />
                    </div>
                  ))}
                  <Button onClick={handleUpdateMaxTeams} className="w-full">
                    Save Settings
                  </Button>
                  <Button 
                    onClick={() => setIsResetAllConfirmOpen(true)}
                    variant="destructive"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset All Rounds
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Round Info */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Round {currentRound}: {currentRoundData?.name}
                </CardTitle>
                <CardDescription>{currentRoundData?.description}</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-purple-600 text-white dark:bg-purple-700">
                {currentRoundTeams.length} / {currentRoundData?.maxTeams} Teams
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="teams" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="teams">
              <Users className="w-4 h-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="questions">
              <FileQuestion className="w-4 h-4 mr-2" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="marks">
              <ClipboardList className="w-4 h-4 mr-2" />
              Marks
            </TabsTrigger>
            <TabsTrigger value="round-control">
              <Trophy className="w-4 h-4 mr-2" />
              Round Control
            </TabsTrigger>
          </TabsList>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Teams in Round {currentRound}</CardTitle>
                  <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Team
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Team</DialogTitle>
                        <DialogDescription>
                          Enter the team name to add to Round {currentRound}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="teamName">Team Name</Label>
                          <Input
                            id="teamName"
                            placeholder="e.g., Team Alpha"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
                          />
                        </div>
                        <Button onClick={handleAddTeam} className="w-full">
                          Add Team
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {currentRound < 3 && currentRoundTeams.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="select-all"
                          checked={selectedTeamIds.length === currentRoundTeams.length && currentRoundTeams.length > 0}
                          onCheckedChange={handleSelectAllTeams}
                        />
                        <Label htmlFor="select-all" className="text-sm cursor-pointer">
                          Select All Teams ({selectedTeamIds.length} of {currentRoundTeams.length} selected)
                        </Label>
                      </div>
                      {selectedTeamIds.length > 0 && (
                        <Badge className="bg-green-600">
                          {selectedTeamIds.length} team{selectedTeamIds.length !== 1 ? 's' : ''} will advance
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      {currentRound < 3 && <TableHead className="w-12">Select</TableHead>}
                      <TableHead>Team Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Question</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRoundTeams.map((team) => {
                      const assignedQuestion = questions.find(q => q.id === team.assignedQuestionId);
                      return (
                        <TableRow key={team.id}>
                          {currentRound < 3 && (
                            <TableCell>
                              <Checkbox 
                                checked={selectedTeamIds.includes(team.id)}
                                onCheckedChange={() => handleToggleTeamSelection(team.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{team.name}</TableCell>
                          <TableCell>
                            {team.hasSpun ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                Spun
                              </Badge>
                            ) : (
                              <Badge variant="outline">Waiting</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {assignedQuestion ? (
                              <span className="text-sm">{assignedQuestion.question}</span>
                            ) : (
                              <span className="text-muted-foreground text-sm">Not assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onDeleteTeam(team.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {currentRoundTeams.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={currentRound < 3 ? 5 : 4} className="text-center text-muted-foreground">
                          No teams added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Questions for Round {currentRound}</CardTitle>
                  <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Question</DialogTitle>
                        <DialogDescription>
                          Add a question and description for Round {currentRound}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="question">Question</Label>
                          <Input
                            id="question"
                            placeholder="Enter the question..."
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Enter detailed description..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <Button onClick={handleAddQuestion} className="w-full">
                          Add Question
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRoundQuestions.map((question) => {
                      const assignedTeam = teams.find(t => t.id === question.assignedToTeamId);
                      return (
                        <TableRow key={question.id}>
                          <TableCell className="max-w-xs">
                            <div>
                              <p>{question.question}</p>
                              <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {question.isLocked ? (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                Locked
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Available
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {assignedTeam ? (
                              <span className="text-sm">{assignedTeam.name}</span>
                            ) : (
                              <span className="text-muted-foreground text-sm">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onDeleteQuestion(question.id)}
                              disabled={question.isLocked}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {currentRoundQuestions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No questions added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marks Tab */}
          <TabsContent value="marks" className="space-y-4">
            <MarksSheet
              teams={teams}
              questions={questions}
              currentRound={currentRound}
              rounds={rounds}
              onUpdateMarks={onUpdateMarks}
            />
          </TabsContent>

          {/* Round Control Tab */}
          <TabsContent value="round-control" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Round Completion Control</CardTitle>
                <CardDescription>
                  Complete the current round and advance selected teams to the next round
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg dark:bg-slate-900">
                    <p className="text-sm text-muted-foreground">Total Teams</p>
                    <p className="text-2xl">{currentRoundTeams.length}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg dark:bg-slate-900">
                    <p className="text-sm text-muted-foreground">Teams with Questions</p>
                    <p className="text-2xl">
                      {currentRoundTeams.filter(t => t.assignedQuestionId).length}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg dark:bg-slate-900">
                    <p className="text-sm text-muted-foreground">Teams Marked</p>
                    <p className="text-2xl">
                      {currentRoundTeams.filter(t => t.marks !== undefined).length}
                    </p>
                  </div>
                </div>

                {allTeamsHaveQuestions && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/30 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200">
                      ✓ All teams have been assigned questions!
                    </p>
                  </div>
                )}

                {currentRound < 3 && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
                      <p className="text-blue-800 text-sm dark:text-blue-200">
                        💡 <strong>Note:</strong> Go to the Teams tab to select which teams will advance to Round {currentRound + 1}. Unselected teams will be automatically deleted.
                      </p>
                    </div>
                    {selectedTeamIds.length > 0 && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg dark:bg-purple-950/30 dark:border-purple-800">
                        <div className="space-y-2">
                          <p className="text-purple-800 dark:text-purple-200">
                            <strong>Selected Teams ({selectedTeamIds.length}):</strong>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedTeamIds.map(teamId => {
                              const team = currentRoundTeams.find(t => t.id === teamId);
                              return team ? (
                                <Badge key={teamId} className="bg-purple-600">
                                  {team.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={handleOpenCompleteRound}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        disabled={!allTeamsHaveQuestions || selectedTeamIds.length === 0}
                    >
                        Complete Round {currentRound} & Advance Selected Teams
                      </Button>
                      <Button
                        onClick={() => setIsResetConfirmOpen(true)}
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Round
                      </Button>
                    </div>
                  </div>
                )}

                {currentRound === 3 && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg dark:bg-purple-950/30 dark:border-purple-800">
                    <p className="text-purple-800 dark:text-purple-200">
                      🏆 This is the final round - UXcellence Grand Showdown!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Complete Round Dialog - Ask Try Again or Go to Next Round */}
      <AlertDialog open={isCompleteRoundOpen} onOpenChange={setIsCompleteRoundOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Round {currentRound}?</AlertDialogTitle>
            <AlertDialogDescription>
              All teams have been assigned questions. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Try Again:</strong> Reset this round and let teams spin again with the same questions.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/30 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Go to Next Round:</strong> Advance {selectedTeamIds.length} selected team{selectedTeamIds.length !== 1 ? 's' : ''} to Round {currentRound + 1}.
              </p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>⚠️ Warning:</strong> {currentRoundTeams.length - selectedTeamIds.length} unselected team{currentRoundTeams.length - selectedTeamIds.length !== 1 ? 's' : ''} will be permanently deleted and won't have access to the next round.
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleTryAgain}
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <AlertDialogAction
              onClick={handleAdvanceToNextRound}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Go to Next Round
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Current Round Confirmation */}
      <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Round {currentRound}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all assigned questions and allow teams to spin again. Team marks will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetCurrentRound}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Reset Round
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset All Rounds Confirmation */}
      <AlertDialog open={isResetAllConfirmOpen} onOpenChange={setIsResetAllConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Rounds?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the entire game back to Round 1. All teams will be moved to Round 1, all questions will be unlocked, and all marks will be cleared. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetAllRounds}
              className="bg-red-600 hover:bg-red-700"
            >
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
