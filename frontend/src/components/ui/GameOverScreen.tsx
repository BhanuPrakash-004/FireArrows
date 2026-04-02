import type { GameState } from '../../types/game'

interface GameOverScreenProps {
  state: GameState
  onRestart: () => void
}

export function GameOverScreen({ state, onRestart }: GameOverScreenProps) {
  const accuracy = state.totalQuestions > 0 
    ? Math.round((state.correctAnswers / state.totalQuestions) * 100) 
    : 0

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-red-900/90 to-black/95 backdrop-blur-md">
      <div className="text-center max-w-lg px-8">
        {/* Game Over Title */}
        <div className="mb-8">
          <p className="text-red-400 text-xl font-semibold uppercase tracking-widest mb-2">
            You Were Struck Down
          </p>
          <h1 className="text-7xl font-black text-white uppercase tracking-wider drop-shadow-[0_0_30px_rgba(255,80,0,0.8)]">
            Game Over
          </h1>
        </div>

        {/* Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Rounds Survived</p>
              <p className="text-4xl font-bold text-orange-400">{state.round - 1}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Final Score</p>
              <p className="text-4xl font-bold text-orange-400">{state.score}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Questions</p>
              <p className="text-4xl font-bold text-white">{state.totalQuestions}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Accuracy</p>
              <p className="text-4xl font-bold text-white">{accuracy}%</p>
            </div>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onRestart}
          className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-xl font-bold rounded-xl shadow-lg shadow-orange-500/30 transform hover:scale-105 transition-all duration-200 uppercase tracking-widest"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
