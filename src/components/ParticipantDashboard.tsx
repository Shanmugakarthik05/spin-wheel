import { useState, useEffect } from 'react';
import { Team, Question, Round } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SpinWheel } from './SpinWheel';
import { Trophy, CheckCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';

interface ParticipantDashboardProps {
  team: Team;
  questions: Question[];
  currentRound: number;
  rounds: Round[];
  onSpin: (questionId: string) => void;
  onLogout: () => void;
  allTeamsAssigned: boolean;
}

export function ParticipantDashboard({
  team,
  questions,
  currentRound,
  rounds,
  onSpin,
  onLogout,
  allTeamsAssigned,
}: ParticipantDashboardProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showDescription, setShowDescription] = useState(false);

  const currentRoundData = rounds.find(r => r.number === currentRound);
  const currentRoundQuestions = questions.filter(q => q.round === currentRound);
  const assignedQuestion = questions.find(q => q.id === team.assignedQuestionId);

  // Countdown effect when all teams are assigned
  useEffect(() => {
    if (allTeamsAssigned && assignedQuestion && !showDescription) {
      setShowCountdown(true);
      setCountdown(3);

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowCountdown(false);
            setShowDescription(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [allTeamsAssigned, assignedQuestion, showDescription]);

  const handleSpinComplete = (questionId: string) => {
    onSpin(questionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between text-white">
          <div>
            <h1>Welcome, {team.name}!</h1>
            <p className="text-purple-100 dark:text-purple-200">Round {currentRound}: {currentRoundData?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={onLogout} variant="secondary">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Round Info */}
        <Card className="border-2 border-white/20 bg-white/10 backdrop-blur-md text-white dark:bg-white/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5" />
                  {currentRoundData?.name}
                </CardTitle>
                <CardDescription className="text-purple-100 dark:text-purple-200">
                  {currentRoundData?.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-white text-purple-600 dark:bg-white/90">
                Round {currentRound}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        {!team.hasSpun ? (
          <Card className="border-2 border-white/20 bg-white/95 backdrop-blur-md">
            <CardHeader className="text-center">
              <CardTitle>Spin the Wheel to Get Your Question!</CardTitle>
              <CardDescription>
                You have one spin per round. Choose wisely!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <SpinWheel
                questions={currentRoundQuestions}
                onSpinComplete={handleSpinComplete}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
              />
            </CardContent>
          </Card>
        ) : assignedQuestion ? (
          <div className="space-y-6">
            {/* Countdown Overlay */}
            <AnimatePresence>
              {showCountdown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white text-9xl"
                  >
                    {countdown}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="border-2 border-green-500 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-green-800">Your Question Assigned!</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-muted-foreground mb-2">Question:</h3>
                  <p className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                    {assignedQuestion.question}
                  </p>
                </div>

                {showDescription && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-muted-foreground mb-2">Description:</h3>
                    <p className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 whitespace-pre-wrap">
                      {assignedQuestion.description}
                    </p>
                  </motion.div>
                )}

                {!showDescription && allTeamsAssigned && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-center">
                      ⏳ All teams have been assigned! Description will be revealed shortly...
                    </p>
                  </div>
                )}

                {!allTeamsAssigned && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-center">
                      ⏳ Waiting for all teams to spin the wheel...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
