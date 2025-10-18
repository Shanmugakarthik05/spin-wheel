import { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface Question {
  id: string;
  content: string;
  order_index: number;
}

interface SpinWheelProps {
  questions: Question[];
  onSpin: (questionId: string) => void;
  disabled: boolean;
}

export default function SpinWheel({ questions, onSpin, disabled }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const colors = [
    'from-red-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-purple-500 to-violet-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-teal-500',
    'from-orange-500 to-red-500',
  ];

  const handleSpin = () => {
    if (isSpinning || disabled || questions.length === 0) return;

    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    const degreesPerSegment = 360 / questions.length;
    const targetRotation = rotation + 360 * 5 + (360 - (randomIndex * degreesPerSegment + degreesPerSegment / 2));

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onSpin(selectedQuestion.id);
    }, 5000);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">No questions available for this round</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      <div className="relative">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
        </div>

        <div className="relative w-96 h-96">
          <div
            ref={wheelRef}
            className="absolute inset-0 rounded-full shadow-2xl transition-transform duration-[5000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {questions.map((question, index) => {
                const startAngle = (index * 360) / questions.length;
                const endAngle = ((index + 1) * 360) / questions.length;
                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                const startX = 50 + 45 * Math.cos((Math.PI * startAngle) / 180);
                const startY = 50 + 45 * Math.sin((Math.PI * startAngle) / 180);
                const endX = 50 + 45 * Math.cos((Math.PI * endAngle) / 180);
                const endY = 50 + 45 * Math.sin((Math.PI * endAngle) / 180);

                const colorClass = colors[index % colors.length];

                return (
                  <g key={question.id}>
                    <defs>
                      <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className={`stop-color-${colorClass.split(' ')[0].replace('from-', '')}`} stopColor={`var(--${colorClass.split(' ')[0].replace('from-', '')})`} />
                        <stop offset="100%" className={`stop-color-${colorClass.split(' ')[1].replace('to-', '')}`} stopColor={`var(--${colorClass.split(' ')[1].replace('to-', '')})`} />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 50 50 L ${startX} ${startY} A 45 45 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                      className={`fill-current bg-gradient-to-br ${colorClass}`}
                      fill={`url(#grad-${index})`}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <text
                      x="50"
                      y="50"
                      fill="white"
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${startAngle + (endAngle - startAngle) / 2} 50 50) translate(0 -30)`}
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-yellow-400">
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        className={`px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all transform ${
          isSpinning || disabled
            ? 'bg-gray-500 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:scale-110 hover:shadow-orange-500/50 animate-pulse'
        }`}
      >
        {isSpinning ? (
          <span className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Spinning...</span>
          </span>
        ) : disabled ? (
          'Already Spun'
        ) : (
          'SPIN THE WHEEL'
        )}
      </button>

      <style>{`
        :root {
          --red-500: #ef4444;
          --pink-500: #ec4899;
          --blue-500: #3b82f6;
          --cyan-500: #06b6d4;
          --green-500: #22c55e;
          --emerald-500: #10b981;
          --yellow-500: #eab308;
          --orange-500: #f97316;
          --purple-500: #a855f7;
          --violet-500: #8b5cf6;
          --rose-500: #f43f5e;
          --teal-500: #14b8a6;
        }
      `}</style>
    </div>
  );
}
