import * as THREE from 'three'
import type { MutableRefObject } from 'react'

// Game phases
export type GamePhase = 'start' | 'question' | 'scramble' | 'arrows' | 'paused' | 'gameover'

// Question data
export interface Question {
  id: number
  question: string
  answer: number
  unit?: string
  hint?: string
}

// Arrow data for rendering
export interface ArrowData {
  id: number
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  velocity: number
  landed: boolean
}

// Game state managed by useGameState hook
export interface GameState {
  phase: GamePhase
  previousPhase: GamePhase | null
  lives: number
  maxLives: number
  round: number
  score: number
  isSafe: boolean
  timer: number
  arrowCount: number
  arrowDuration: number
  waveId: number
  currentQuestion: Question | null
  playerAnswer: number | null
  lastError: number | null
  totalQuestions: number
  correctAnswers: number
}

// Player component props
export interface PlayerProps {
  position?: [number, number, number]
  onSafeStatusChange?: (isSafe: boolean) => void
  sensitivity?: number
  playerPositionRef?: MutableRefObject<THREE.Vector3>
  frozen?: boolean
}

// Game actions returned by useGameState
export interface GameActions {
  startGame: () => void
  submitAnswer: (answer: number) => void
  takeDamage: () => void
  setSafe: (safe: boolean) => void
  nextPhase: () => void
  togglePause: () => void
  setArrowDuration: (duration: number) => void
  restart: () => void
}
