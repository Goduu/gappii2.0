"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { QuizGameProps, QuizQuestion } from "./types"
import { SessionCard } from "./QuizCard"
import { GameHeader } from "./GameHeader"
import { GameOverScreen } from "./GameOverScreen"

export function LearningSession({ questions, initialTime }: QuizGameProps) {
    // Game state
    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(initialTime)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(questions[0])
    const [gameActive, setGameActive] = useState(true)
    const [isAnswering, setIsAnswering] = useState(false)

    // Timer effect
    useEffect(() => {
        if (!gameActive) return

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setGameActive(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [gameActive])

    // Update current question when index changes
    useEffect(() => {
        if (currentQuestionIndex < questions.length) {
            setCurrentQuestion(questions[currentQuestionIndex])
        }
    }, [currentQuestionIndex, questions])

    // Handle answer submission
    const handleAnswer = useCallback((isCorrect: boolean) => {
        if (isAnswering) return

        setIsAnswering(true)

        if (isCorrect) {
            setScore(prev => prev + 1)
        }

        // Move to next question after a short delay
        setTimeout(() => {
            if (currentQuestionIndex >= questions.length - 1) {
                setGameActive(false)
            } else {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1)
            }
            setIsAnswering(false)
        }, 500)
    }, [currentQuestionIndex, questions.length, isAnswering])

    // Reset game state
    const resetGame = () => {
        // First deactivate the game
        setGameActive(false)

        // Reset all state variables
        setScore(0)
        setTimer(initialTime)
        setCurrentQuestionIndex(0)
        setCurrentQuestion(questions[0])
        setIsAnswering(false)

        // Use setTimeout to ensure state updates are processed before reactivating
        setTimeout(() => {
            setGameActive(true)
        }, 50)
    }

    return (
        <AnimatePresence>
            <motion.div
                className="w-full h-screen flex flex-col rounded-4xl mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Score and timer header */}
                <GameHeader score={score} timeRemaining={timer} />

                {/* Main quiz area */}
                <div className="flex-1 flex items-center justify-center z-50">
                    {gameActive && currentQuestion ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <SessionCard
                                currentQuestion={currentQuestion}
                                onAnswer={handleAnswer}
                            />
                        </div>
                    ) : (
                        <AnimatePresence>
                            <GameOverScreen
                                score={score}
                                totalQuestions={questions.length}
                                onReset={resetGame}
                            />
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
} 