import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import { Physics } from '@react-three/rapier'
import { EnvironmentMap } from './components/EnvironmentMap'
import { Player } from './components/Player'
import { FireArrows } from './components/FireArrows'

function App() {
  const [isSafe, setIsSafe] = useState(true)
  const [arrowsActive, setArrowsActive] = useState(false)
  const [timer, setTimer] = useState(10)
  const [isEliminated, setIsEliminated] = useState(false)
  const [sensitivity, setSensitivity] = useState(1.0)
  const [waveId, setWaveId] = useState(0)
  const playerPositionRef = useRef({ x: 0, y: 0, z: 0 })

  // ── Game loop timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isEliminated) return

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setArrowsActive((prev) => {
            const next = !prev
            console.log(`%c[App] arrowsActive: ${prev} → ${next}, waveId will be ${next ? 'incremented' : 'same'}`, 'color: cyan; font-weight: bold')
            if (next) setWaveId((w) => w + 1)
            // When transitioning TO arrows: 5s of arrows
            // When transitioning FROM arrows: 10s of peace
            setTimer(next ? 5 : 10)
            return next
          })
          return t // will be overridden by setTimer above
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isEliminated])  // removed arrowsActive dependency — no more stale closures

  // ── Elimination handler ──────────────────────────────────────────────────
  // Called by the Player component when an arrow collides with it.
  // In Phase 3 (multiplayer) this will receive a playerId to mark the right player.
  const handlePlayerEliminated = useCallback(() => {
    if (!isEliminated) {
      setIsEliminated(true)
      setArrowsActive(false)   // stop rain once player is hit
    }
  }, [isEliminated])

  return (
    <div className="w-full h-screen relative bg-gray-900 m-0 p-0 overflow-hidden">

      {/* ── UI Overlay ─────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center text-center px-8 pointer-events-none">
        <div className="w-full max-w-4xl flex justify-between items-start">

          {/* Title */}
          <div className="bg-black/50 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
            <h1 className="text-white font-bold text-3xl mb-1 uppercase tracking-wider">Fire Arrows!</h1>
            <p className="text-gray-300 font-medium">Survive the rain of fire</p>
          </div>

          {/* Status badges */}
          <div className="flex flex-col items-end gap-3">
            <div className={`px-6 py-2 rounded-full font-bold text-xl uppercase tracking-widest shadow-lg transition-colors border-2 ${
              isSafe
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                : 'bg-red-500/20 text-red-500 border-red-500/50'
            }`}>
              {isEliminated ? 'ELIMINATED' : `Status: ${isSafe ? 'SAFE' : 'DANGER'}`}
            </div>

            {!isEliminated && (
              <div className={`px-6 py-3 rounded-xl font-bold text-lg shadow-lg border backdrop-blur-sm text-white ${
                arrowsActive
                  ? 'bg-orange-600/60 border-orange-500 animate-pulse'
                  : 'bg-blue-600/40 border-blue-500'
              }`}>
                {arrowsActive ? 'ARROWS FALLING: ' : 'NEXT WAVE IN: '} {timer}s
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Controls hint ──────────────────────────────────────────────── */}
      {!isEliminated && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white/70 px-6 py-2 rounded-full text-sm font-medium tracking-wide pointer-events-none">
          WASD to move · Mouse to rotate camera
        </div>
      )}

      {/* ── Sensitivity slider ─────────────────────────────────────────── */}
      {!isEliminated && (
        <div className="absolute bottom-6 left-4 z-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex flex-col gap-1 min-w-[170px]">
          <label className="text-white/80 text-xs font-semibold uppercase tracking-widest">
            Mouse Sensitivity
          </label>
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs">0.5</span>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.1}
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="flex-1 accent-orange-500 cursor-pointer"
            />
            <span className="text-white/50 text-xs">3.0</span>
          </div>
          <span className="text-orange-400 text-xs font-bold text-center">{sensitivity.toFixed(1)}x</span>
        </div>
      )}

      {/* ── ELIMINATED full-screen overlay ─────────────────────────────── */}
      {isEliminated && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-900/70 backdrop-blur-sm pointer-events-none">
          <div className="text-center animate-pulse">
            <p className="text-red-300 text-2xl font-semibold tracking-widest uppercase mb-3">You were struck by a fire arrow</p>
            <h2 className="text-white font-black text-7xl uppercase tracking-widest drop-shadow-[0_0_30px_rgba(255,80,0,1)]">
              ELIMINATED
            </h2>
          </div>
        </div>
      )}

      {/* ── 3D Canvas ──────────────────────────────────────────────────── */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 60 }}
        style={{ pointerEvents: 'none' }}
      >
        <color attach="background" args={['#87CEEB']} />

        {/* Sky changes appearance when arrows are falling */}
        <Sky
          sunPosition={arrowsActive ? [0, 10, 0] : [100, 20, 100]}
          turbidity={arrowsActive ? 10 : 0.1}
          rayleigh={arrowsActive ? 4 : 0.5}
          mieCoefficient={arrowsActive ? 0.05 : 0.005}
          mieDirectionalG={0.8}
        />

        <ambientLight intensity={arrowsActive ? 0.2 : 0.6} />
        <directionalLight
          position={[10, 20, 10]}
          castShadow
          intensity={arrowsActive ? 0.5 : 1.5}
          shadow-mapSize={[2048, 2048]}
          color={arrowsActive ? '#ff8866' : '#ffffff'}
        />

        <Suspense fallback={null}>
          <Physics>
            <EnvironmentMap />
            <Player
              onSafeStatusChange={setIsSafe}
              onEliminated={handlePlayerEliminated}
              sensitivity={sensitivity}
              playerPositionRef={playerPositionRef}
            />
          </Physics>
        </Suspense>

        {/* FireArrows lives OUTSIDE Physics — uses manual gravity, not Rapier */}
        {!isEliminated && (
          <FireArrows
            active={arrowsActive}
            waveId={waveId}
            onArrowLand={(arrowPos) => {
              // Check proximity to player — if within 1.5 units, eliminate
              const px = playerPositionRef.current
              const dist = Math.sqrt(
                (arrowPos.x - px.x) ** 2 + (arrowPos.z - px.z) ** 2
              )
              if (dist < 1.5 && !isSafe) {
                handlePlayerEliminated()
              }
            }}
          />
        )}
      </Canvas>
    </div>
  )
}

export default App
