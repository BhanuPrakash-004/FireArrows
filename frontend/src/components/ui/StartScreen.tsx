import { useState } from 'react'

interface StartScreenProps {
  onStart: (arrowDuration: number) => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal')
  
  const difficultySettings = {
    easy: { duration: 15, label: 'Easy', desc: 'More time to dodge' },
    normal: { duration: 10, label: 'Normal', desc: 'Balanced challenge' },
    hard: { duration: 5, label: 'Hard', desc: 'Intense arrow rain!' },
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-md">
      <div className="text-center max-w-2xl px-8">
        {/* Title */}
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 uppercase tracking-wider mb-4 drop-shadow-2xl">
          Fire Arrows
        </h1>
        <p className="text-2xl text-orange-300/80 font-medium mb-8">
          Survive the Rain of Fire
        </p>

        {/* Difficulty Selection */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-3">Select Difficulty</h2>
          <div className="flex gap-3 justify-center">
            {(['easy', 'normal', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  difficulty === level
                    ? level === 'easy' 
                      ? 'bg-green-500 text-white' 
                      : level === 'normal'
                      ? 'bg-orange-500 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {difficultySettings[level].label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {difficultySettings[difficulty].desc} ({difficultySettings[difficulty].duration}s arrow phase)
          </p>
        </div>

        {/* How to Play */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-xl">📜</span> How to Play
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">1.</span>
              <span>Answer questions. Wrong answers = more arrows!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">2.</span>
              <span>Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono">WASD</kbd> to run and find cover.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">3.</span>
              <span>Stay under roofs when arrows fall. Hits cost lives!</span>
            </li>
          </ul>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6 mb-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded font-mono">WASD</kbd>
            <span>Move</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded font-mono">Mouse</kbd>
            <span>Camera</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded font-mono">ESC</kbd>
            <span>Pause</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart(difficultySettings[difficulty].duration)}
          className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-2xl font-bold rounded-xl shadow-lg shadow-orange-500/30 transform hover:scale-105 transition-all duration-200 uppercase tracking-widest"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
