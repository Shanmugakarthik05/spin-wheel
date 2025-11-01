import { useState } from 'react';
import { Team, Question, Round } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Download, FileDown, FileSpreadsheet, Save } from 'lucide-react';
import { exportToPDF, exportToCSV, exportToExcel } from '../utils/exportUtils';
import { toast } from 'sonner@2.0.3';

interface MarksSheetProps {
  teams: Team[];
  questions: Question[];
  currentRound: number;
  rounds: Round[];
  onUpdateMarks: (teamId: string, marks: number, reason: string) => void;
}

export function MarksSheet({ teams, questions, currentRound, rounds, onUpdateMarks }: MarksSheetProps) {
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [tempMarks, setTempMarks] = useState<number>(0);
  const [tempReason, setTempReason] = useState<string>('');
  const [selectedRound, setSelectedRound] = useState<number>(currentRound);

  const currentRoundData = rounds.find(r => r.number === selectedRound);
  const roundTeams = teams.filter(t => t.round === selectedRound);

  const handleEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setTempMarks(team.marks || 0);
    setTempReason(team.reason || '');
  };

  const handleSave = (teamId: string) => {
    onUpdateMarks(teamId, tempMarks, tempReason);
    setEditingTeamId(null);
    toast.success('Marks saved successfully!');
  };

  const handleCancel = () => {
    setEditingTeamId(null);
    setTempMarks(0);
    setTempReason('');
  };

  const handleExportPDF = () => {
    if (currentRoundData) {
      exportToPDF(teams, questions, selectedRound, currentRoundData.name);
      toast.success('PDF exported successfully!');
    }
  };

  const handleExportCSV = () => {
    if (currentRoundData) {
      exportToCSV(teams, questions, selectedRound, currentRoundData.name);
      toast.success('CSV exported successfully!');
    }
  };

  const handleExportExcel = () => {
    if (currentRoundData) {
      exportToExcel(teams, questions, selectedRound, currentRoundData.name);
      toast.success('Excel exported successfully!');
    }
  };

  return (
    <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-white">Marks Sheet</CardTitle>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Round selector */}
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(Number(e.target.value))}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {rounds.map(round => (
                <option key={round.number} value={round.number} className="bg-gray-800">
                  Round {round.number}: {round.name}
                </option>
              ))}
            </select>

            {/* Export buttons */}
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-500/50"
            >
              <FileDown className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="bg-green-500/20 hover:bg-green-500/30 text-white border-green-500/50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="bg-blue-500/20 hover:bg-blue-500/30 text-white border-blue-500/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {roundTeams.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            No teams in Round {selectedRound} yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white">#</TableHead>
                  <TableHead className="text-white">Team Name</TableHead>
                  <TableHead className="text-white">Question</TableHead>
                  <TableHead className="text-white w-32">Marks</TableHead>
                  <TableHead className="text-white">Reason/Feedback</TableHead>
                  <TableHead className="text-white w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roundTeams.map((team, index) => {
                  const question = questions.find(q => q.id === team.assignedQuestionId);
                  const isEditing = editingTeamId === team.id;

                  return (
                    <TableRow 
                      key={team.id} 
                      className={`border-white/10 hover:bg-white/5 ${
                        team.marks === undefined ? 'bg-yellow-500/5' : ''
                      }`}
                    >
                      <TableCell className="text-white/80">{index + 1}</TableCell>
                      <TableCell className="text-white">
                        {team.name}
                        {team.marks === undefined && (
                          <span className="ml-2 text-xs text-yellow-400">● Unmarked</span>
                        )}
                      </TableCell>
                      <TableCell className="text-white/80 max-w-xs">
                        {question?.question || 'Not assigned'}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={tempMarks}
                            onChange={(e) => setTempMarks(Number(e.target.value))}
                            min={0}
                            max={100}
                            placeholder="0-100"
                            className="bg-white/10 border-white/20 text-white w-24"
                          />
                        ) : (
                          <span className={`${
                            team.marks !== undefined 
                              ? team.marks >= 70 
                                ? 'text-green-400' 
                                : team.marks >= 50 
                                ? 'text-yellow-400' 
                                : 'text-red-400'
                              : 'text-white/60'
                          }`}>
                            {team.marks !== undefined ? `${team.marks}/100` : 'N/A'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Textarea
                            value={tempReason}
                            onChange={(e) => setTempReason(e.target.value)}
                            placeholder="Add feedback or reason..."
                            className="bg-white/10 border-white/20 text-white min-h-[60px]"
                          />
                        ) : (
                          <span className="text-white/80 text-sm">
                            {team.reason || '-'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSave(team.id)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={handleCancel}
                              size="sm"
                              variant="outline"
                              className="bg-white/10 hover:bg-white/20"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleEdit(team)}
                            size="sm"
                            variant="outline"
                            className="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-white"
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary */}
        {roundTeams.length > 0 && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-white/60 text-sm">Total Teams</div>
                <div className="text-white text-2xl mt-1">{roundTeams.length}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Marked</div>
                <div className="text-white text-2xl mt-1">
                  {roundTeams.filter(t => t.marks !== undefined).length}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Average Score</div>
                <div className="text-white text-2xl mt-1">
                  {roundTeams.some(t => t.marks !== undefined)
                    ? (
                        roundTeams.reduce((sum, t) => sum + (t.marks || 0), 0) /
                        roundTeams.filter(t => t.marks !== undefined).length
                      ).toFixed(1)
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
