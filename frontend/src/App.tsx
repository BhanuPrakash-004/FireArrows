import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Suspense, useState, useRef, useCallback, useEffect } from 'react'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import { EnvironmentMap } from './components/EnvironmentMap'
import { Player } from './components/Player'
import { FireArrows } from './components/FireArrows'
import { StartScreen } from './components/ui/StartScreen'
import { GameOverScreen } from './components/ui/GameOverScreen'
import { QuestionModal } from './components/ui/QuestionModal'
import { GameHUD } from './components/ui/GameHUD'
import { useGameState } from './hooks/useGameState'

const HIT_RADIUS = 2.0

function App() {
  const [state, actions] = useGameState()
  const [sensitivity, setSensitivity] = useState(1.0)
  const playerPositionRef = useRef(new THREE.Vector3())
  const spawnPositionRef = useRef(new THREE.Vector3())

  // ESC key to pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        actions.togglePause()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [actions])

  // Capture player position when scramble starts
  const prevPhase = useRef(state.phase)
  if (prevPhase.current === 'question' && state.phase === 'scramble') {
    spawnPositionRef.current.copy(playerPositionRef.current)
  }
  prevPhase.current = state.phase

  const handleArrowLand = useCallback((arrowPos: THREE.Vector3) => {
    if (state.phase === 'paused') return
    const px = playerPositionRef.current
    const dist = Math.sqrt((arrowPos.x - px.x) ** 2 + (arrowPos.z - px.z) ** 2)
    
    if (dist < HIT_RADIUS && !state.isSafe) {
      actions.takeDamage()
    }
  }, [state.isSafe, state.phase, actions])

  const showArrows = state.phase === 'scramble' || state.phase === 'arrows' || 
    (state.phase === 'paused' && (state.previousPhase === 'scramble' || state.previousPhase === 'arrows'))
  const playerFrozen = state.phase === 'question' || state.phase === 'paused'
  const isPaused = state.phase === 'paused'

  const handleStart = (arrowDuration: number) => {
    actions.setArrowDuration(arrowDuration)
    actions.startGame()
  }

  return (
    <div className="w-full h-screen relative bg-gray-900 m-0 p-0 overflow-hidden">
      {state.phase === 'start' && <StartScreen onStart={handleStart} />}
      {state.phase === 'gameover' && <GameOverScreen state={state} onRestart={actions.restart} />}
      
      {state.phase === 'question' && state.currentQuestion && (
        <QuestionModal
          question={state.currentQuestion}
          timeLeft={state.timer}
          onSubmit={actions.submitAnswer}
        />
      )}

      <GameHUD 
        state={state} 
        sensitivity={sensitivity} 
        onSensitivityChange={setSensitivity}
        onPause={actions.togglePause}
      />

      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 60 }}
        style={{ pointerEvents: state.phase === 'question' ? 'none' : 'auto' }}
      >
        <color attach="background" args={['#87CEEB']} />

        <Sky
          sunPosition={[100, 20, 100]}
          turbidity={0.1}
          rayleigh={0.5}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 20, 10]}
          castShadow
          intensity={1.5}
          shadow-mapSize={[2048, 2048]}
        />

        <Suspense fallback={null}>
          <Physics paused={isPaused}>
            <EnvironmentMap />
            <Player
              onSafeStatusChange={actions.setSafe}
              sensitivity={sensitivity}
              playerPositionRef={playerPositionRef}
              frozen={playerFrozen}
            />
          </Physics>
        </Suspense>

        {showArrows && state.arrowCount > 0 && (
          <FireArrows
            active={showArrows}
            arrowCount={state.arrowCount}
            arrowDuration={state.arrowDuration}
            waveId={state.waveId}
            playerPosition={spawnPositionRef.current}
            paused={isPaused}
            onArrowLand={handleArrowLand}
          />
        )}
      </Canvas>
    </div>
  )
}

export default App
