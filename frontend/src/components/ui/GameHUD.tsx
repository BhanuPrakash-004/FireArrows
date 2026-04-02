import type { GameState, GamePhase } from '../../types/game'

interface GameHUDProps {
  state: GameState
  sensitivity: number
  onSensitivityChange: (value: number) => void
  onPause: () => void
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <span className={`text-2xl transition-all duration-300 ${filled ? 'text-red-500 scale-100' : 'text-gray-600 scale-90'}`}>
      {filled ? '❤️' : '🖤'}
    </span>
  )
}

function getPhaseInfo(phase: GamePhase, timer: number, arrowCount: number) {
  switch (phase) {
    case 'question':
      return { label: 'ANSWER TIME', color: 'bg-blue-600/60 border-blue-500', timer: `${timer}s` }
    case 'scramble':
      return { 
        label: `🏹 ${arrowCount} ARROWS INCOMING!`, 
        color: 'bg-yellow-600/60 border-yellow-500 animate-pulse', 
        timer: `${timer}s` 
      }
    case 'arrows':
      return { label: '🔥 ARROWS FALLING!', color: 'bg-red-600/60 border-red-500 animate-pulse', timer: `${timer}s` }
    case 'paused':
      return { label: '⏸️ PAUSED', color: 'bg-gray-600/60 border-gray-500', timer: '' }
    default:
      return { label: '', color: 'bg-gray-600/60 border-gray-500', timer: '' }
  }
}

export function GameHUD({ state, sensitivity, onSensitivityChange, onPause }: GameHUDProps) {
  const { phase, lives, maxLives, round, score, isSafe, timer, arrowCount, lastError } = state
  const phaseInfo = getPhaseInfo(phase, timer, arrowCount)

  if (phase === 'start' || phase === 'gameover') return null

  return (
    <>
      {/* Top Bar */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-5xl flex justify-between items-start">
          
          {/* Left: Title + Round + Pause */}
          <div className="bg-black/60 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-white font-bold text-2xl uppercase tracking-wider">Fire Arrows</h1>
              <button
                onClick={onPause}
                className="pointer-events-auto px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-semibold text-sm transition-colors"
              >
                {phase === 'paused' ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-orange-400 font-semibold">Round {round}</span>
              <span className="text-gray-400">|</span>
              <span className="text-yellow-400 font-semibold">Score: {score}</span>
            </div>
          </div>

          {/* Center: Phase Timer */}
          {phaseInfo.label && (
            <div className={`px-6 py-3 rounded-xl font-bold text-lg shadow-lg border backdrop-blur-sm text-white ${phaseInfo.color}`}>
              {phaseInfo.label} {phaseInfo.timer}
            </div>
          )}

          {/* Right: Status + Lives */}
          <div className="flex flex-col items-end gap-3">
            {/* Safety Status */}
            <div className={`px-5 py-2 rounded-full font-bold text-lg uppercase tracking-widest shadow-lg border-2 transition-all ${
              isSafe
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                : 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
            }`}>
              {isSafe ? '🛡️ SAFE' : '⚠️ DANGER'}
            </div>

            {/* Lives */}
            <div className="bg-black/60 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm flex items-center gap-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <Heart key={i} filled={i < lives} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrow Count Display */}
      {(phase === 'scramble' || phase === 'arrows') && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="flex items-center gap-3 bg-black/70 px-5 py-2 rounded-full border border-orange-500/50">
            <span className="text-3xl">🏹</span>
            <span className="text-orange-400 font-bold text-xl">{arrowCount}</span>
            <span className="text-white/70 text-sm uppercase">arrows</span>
          </div>
        </div>
      )}

      {/* Error Feedback */}
      {lastError !== null && phase === 'scramble' && (
        <div className="absolute top-40 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className={`px-6 py-3 rounded-xl font-bold text-lg ${
            lastError < 10 ? 'bg-green-600/80 text-white' :
            lastError < 30 ? 'bg-yellow-600/80 text-white' :
            'bg-red-600/80 text-white'
          }`}>
            {lastError < 10 ? '🎯 Excellent!' : lastError < 30 ? '😅 Close...' : '😱 Way off!'} 
            {' '}Error: {lastError}%
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {phase === 'paused' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-5xl font-black text-white mb-4">⏸️ PAUSED</h2>
            <p className="text-gray-300 mb-6">Press the Resume button to continue</p>
            <button
              onClick={onPause}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              ▶️ Resume Game
            </button>
          </div>
        </div>
      )}

      {/* Bottom: Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white/70 px-6 py-2 rounded-full text-sm font-medium tracking-wide pointer-events-none">
        WASD to move · Mouse to rotate camera · ESC to pause
      </div>

      {/* Sensitivity Slider */}
      <div className="absolute bottom-6 left-4 z-10 bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex flex-col gap-1 min-w-[160px] pointer-events-auto">
        <label className="text-white/80 text-xs font-semibold uppercase tracking-widest">
          Sensitivity
        </label>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">0.5</span>
          <input
            type="range"
            min={0.5}
            max={3.0}
            step={0.1}
            value={sensitivity}
            onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
            className="flex-1 accent-orange-500 cursor-pointer"
          />
          <span className="text-white/50 text-xs">3.0</span>
        </div>
        <span className="text-orange-400 text-xs font-bold text-center">{sensitivity.toFixed(1)}x</span>
      </div>
    </>
  )
}
