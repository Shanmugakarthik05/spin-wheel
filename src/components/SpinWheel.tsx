import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question } from '../types';

interface SpinWheelProps {
  questions: Question[];
  onSpinComplete: (questionId: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

export function SpinWheel({ questions, onSpinComplete, isSpinning, setIsSpinning }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const availableQuestions = questions.filter(q => !q.isLocked);
  const totalSegments = availableQuestions.length;

  const handleSpin = () => {
    if (isSpinning || availableQuestions.length === 0) return;

    setIsSpinning(true);

    // Random selection
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];

    // Calculate rotation
    const segmentAngle = 360 / totalSegments;
    const targetAngle = segmentAngle * randomIndex;
    const spins = 5; // Number of full rotations
    const finalRotation = rotation + (spins * 360) + (360 - targetAngle);

    setRotation(finalRotation);

    // Complete after animation
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(selectedQuestion.id);
    }, 4000);
  };

  const colors = [
    'from-purple-500 to-purple-700',
    'from-pink-500 to-pink-700',
    'from-blue-500 to-blue-700',
    'from-indigo-500 to-indigo-700',
    'from-violet-500 to-violet-700',
    'from-fuchsia-500 to-fuchsia-700',
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-96 h-96">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <motion.div
          ref={wheelRef}
          className="relative w-full h-full rounded-full shadow-2xl overflow-hidden border-8 border-white dark:border-gray-700"
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {availableQuestions.map((question, index) => {
            const segmentAngle = 360 / totalSegments;
            const startAngle = index * segmentAngle;

            return (
              <div
                key={question.id}
                className={`absolute w-full h-full bg-gradient-to-br ${colors[index % colors.length]}`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((startAngle + segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + segmentAngle - 90) * Math.PI / 180)}%)`,
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 text-white text-center origin-center"
                  style={{
                    transform: `rotate(${startAngle + segmentAngle / 2}deg) translate(0, -120px)`,
                  }}
                >
                  <span className="block transform -rotate-90">Q{index + 1}</span>
                </div>
              </div>
            );
          })}

          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border-4 border-gray-200 dark:border-gray-600">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SPIN</span>
          </div>
        </motion.div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || availableQuestions.length === 0}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
      >
        {isSpinning ? 'Spinning...' : availableQuestions.length === 0 ? 'No Questions Available' : 'Spin the Wheel!'}
      </button>
    </div>
  );
}
