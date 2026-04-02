import { useState, useEffect, useRef, useCallback } from 'react'
import type { Question } from '../../types/game'

interface QuestionModalProps {
  question: Question
  timeLeft: number
  onSubmit: (answer: number) => void
}

export function QuestionModal({ question, timeLeft, onSubmit }: QuestionModalProps) {
  const [answer, setAnswer] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const hasSubmitted = useRef(false)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
    hasSubmitted.current = false
  }, [question.id])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft <= 0 && !hasSubmitted.current) {
      hasSubmitted.current = true
      onSubmit(answer ? parseInt(answer, 10) : 0)
    }
  }, [timeLeft, answer, onSubmit])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (hasSubmitted.current) return
    hasSubmitted.current = true
    onSubmit(answer ? parseInt(answer, 10) : 0)
  }, [answer, onSubmit])

  const urgency = timeLeft <= 5
  const critical = timeLeft <= 3

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div className="bg-gray-900/95 border-2 border-orange-500/50 rounded-2xl p-8 max-w-xl w-full mx-4 shadow-2xl shadow-orange-500/20 pointer-events-auto backdrop-blur-sm">
        {/* Timer */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-orange-400 font-semibold uppercase tracking-wider text-sm">
            Round Question
          </span>
          <div className={`px-4 py-1.5 rounded-full font-bold text-lg ${
            critical ? 'bg-red-500 text-white animate-pulse' :
            urgency ? 'bg-orange-500 text-white' :
            'bg-white/10 text-white'
          }`}>
            {timeLeft}s
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-white mb-2 leading-relaxed">
          {question.question}
        </h2>
        
        {question.hint && (
          <p className="text-gray-400 text-sm mb-6 italic">
            💡 Hint: {question.hint}
          </p>
        )}

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white text-xl font-medium placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              autoComplete="off"
            />
            {question.unit && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                {question.unit}
              </span>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-lg font-bold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-150 uppercase tracking-wider"
          >
            Submit Answer
          </button>
        </form>

        {/* Warning */}
        <p className="text-center text-gray-500 text-sm mt-4">
          ⚠️ The further from the answer, the more arrows will fall!
        </p>
      </div>
    </div>
  )
}
