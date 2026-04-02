import { useState, useCallback, useRef, useEffect } from 'react'
import type { GameState, GameActions } from '../types/game'
import { getRandomQuestion, calculateArrowCount } from '../data/questions'

const INITIAL_LIVES = 3
const QUESTION_TIME = 15
const SCRAMBLE_TIME = 3

const initialState: GameState = {
  phase: 'start',
  previousPhase: null,
  lives: INITIAL_LIVES,
  maxLives: INITIAL_LIVES,
  round: 0,
  score: 0,
  isSafe: true,
  timer: 0,
  arrowCount: 0,
  arrowDuration: 10,
  waveId: 0,
  currentQuestion: null,
  playerAnswer: null,
  lastError: null,
  totalQuestions: 0,
  correctAnswers: 0,
}

export function useGameState(): [GameState, GameActions] {
  const [state, setState] = useState<GameState>(initialState)
  const usedQuestions = useRef<number[]>([])

  // Timer effect - pauses when game is paused
  useEffect(() => {
    if (state.phase === 'start' || state.phase === 'gameover' || state.phase === 'paused') return

    const interval = setInterval(() => {
      setState(prev => {
        if (prev.timer <= 1) {
          // Time's up - handle phase transition
          if (prev.phase === 'question') {
            // Auto-submit 0 if no answer
            const arrows = calculateArrowCount(0, prev.currentQuestion?.answer ?? 1)
            return {
              ...prev,
              phase: 'scramble',
              timer: SCRAMBLE_TIME,
              arrowCount: arrows,
              waveId: prev.waveId + 1,
              playerAnswer: 0,
              lastError: 100,
              totalQuestions: prev.totalQuestions + 1,
            }
          } else if (prev.phase === 'scramble') {
            return { ...prev, phase: 'arrows', timer: prev.arrowDuration }
          } else if (prev.phase === 'arrows') {
            const question = getRandomQuestion(usedQuestions.current)
            usedQuestions.current.push(question.id)
            if (usedQuestions.current.length > 15) {
              usedQuestions.current = usedQuestions.current.slice(-10)
            }
            return {
              ...prev,
              phase: 'question',
              round: prev.round + 1,
              timer: QUESTION_TIME,
              currentQuestion: question,
              playerAnswer: null,
              lastError: null,
              arrowCount: 0,
            }
          }
          return prev
        }
        return { ...prev, timer: prev.timer - 1 }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.phase])

  const startGame = useCallback(() => {
    usedQuestions.current = []
    const question = getRandomQuestion([])
    usedQuestions.current.push(question.id)
    
    setState({
      ...initialState,
      phase: 'question',
      lives: INITIAL_LIVES,
      round: 1,
      timer: QUESTION_TIME,
      currentQuestion: question,
      waveId: 0,
    })
  }, [])

  const submitAnswer = useCallback((answer: number) => {
    setState(prev => {
      if (prev.phase !== 'question' || !prev.currentQuestion) return prev
      
      const error = Math.abs(answer - prev.currentQuestion.answer)
      const percentError = (error / Math.max(prev.currentQuestion.answer, 1)) * 100
      const arrows = calculateArrowCount(answer, prev.currentQuestion.answer)
      const isCorrect = percentError < 5
      
      return {
        ...prev,
        phase: 'scramble',
        timer: SCRAMBLE_TIME,
        arrowCount: arrows,
        waveId: prev.waveId + 1,
        playerAnswer: answer,
        lastError: Math.round(percentError),
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        score: prev.score + (isCorrect ? 100 : Math.max(0, 50 - Math.floor(percentError))),
      }
    })
  }, [])

  const takeDamage = useCallback(() => {
    setState(prev => {
      if (prev.lives <= 1) {
        return { ...prev, phase: 'gameover', lives: 0 }
      }
      return { ...prev, lives: prev.lives - 1 }
    })
  }, [])

  const setSafe = useCallback((safe: boolean) => {
    setState(prev => ({ ...prev, isSafe: safe }))
  }, [])

  const nextPhase = useCallback(() => {
    // Phase transitions now handled by timer
  }, [])

  const togglePause = useCallback(() => {
    setState(prev => {
      if (prev.phase === 'paused' && prev.previousPhase) {
        return { ...prev, phase: prev.previousPhase, previousPhase: null }
      }
      if (prev.phase !== 'start' && prev.phase !== 'gameover') {
        return { ...prev, phase: 'paused', previousPhase: prev.phase }
      }
      return prev
    })
  }, [])

  const setArrowDuration = useCallback((duration: number) => {
    setState(prev => ({ ...prev, arrowDuration: duration }))
  }, [])

  const restart = useCallback(() => {
    usedQuestions.current = []
    setState(initialState)
  }, [])

  return [state, { startGame, submitAnswer, takeDamage, setSafe, nextPhase, togglePause, setArrowDuration, restart }]
}

export { QUESTION_TIME, SCRAMBLE_TIME }
