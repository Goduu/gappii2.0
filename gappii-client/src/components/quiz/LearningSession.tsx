"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Activity } from "./types"
import { SessionCard } from "./QuizCard"
import { GameHeader } from "./GameHeader"
import { GameOverScreen } from "./GameOverScreen"
import { useInput } from "@/app/home/InputContext"
import { DeepPartial } from "ai"
import { TextAnimate } from "../magicui/text-animate"

export interface LearningSessionProps {
    initialTime: number;
    isAddLessonRoute: boolean;
}

export function LearningSession({ initialTime, isAddLessonRoute = false }: LearningSessionProps) {
    // Game state
    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(initialTime)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [gameActive, setGameActive] = useState(!isAddLessonRoute)
    const [isAnswering, setIsAnswering] = useState(false)
    const { lesson } = useInput()
    const [currentQuestion, setCurrentQuestion] = useState<DeepPartial<Activity> | undefined>(lesson?.activities[0])
    const [isIntroPlayed, setIsIntroPlayed] = useState(!isAddLessonRoute)

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
        const questions = lesson?.activities
        if (questions && currentQuestionIndex < questions.length) {
            setCurrentQuestion(questions[currentQuestionIndex])
        }
    }, [currentQuestionIndex, lesson])

    // Handle answer submission
    const handleAnswer = useCallback((isCorrect: boolean) => {
        if (isAnswering) return

        setIsAnswering(true)

        if (isCorrect) {
            setScore(prev => prev + 1)
        }

        // Move to next question after a short delay
        setTimeout(() => {
            const questions = lesson?.activities
            if (questions && currentQuestionIndex >= questions.length - 1) {
                setGameActive(false)
            } else {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1)
            }
            setIsAnswering(false)
        }, 500)
    }, [currentQuestionIndex, lesson, isAnswering])

    // Reset game state
    const resetGame = () => {
        // First deactivate the game
        setGameActive(false)
        // Reset all state variables
        setScore(0)
        setTimer(initialTime)
        setCurrentQuestionIndex(0)
        setCurrentQuestion(lesson?.activities[0])
        setIsAnswering(false)

        // Use setTimeout to ensure state updates are processed before reactivating
        setTimeout(() => {
            setGameActive(true)
        }, 50)
    }

    useEffect(() => {
        if (isAddLessonRoute) {
            setTimeout(() => {
                setIsIntroPlayed(true)
                setGameActive(true)
            }, 5000)
        }
    }, [isAddLessonRoute])

    return (
        <AnimatePresence>
            {!isIntroPlayed ? (
                <TextAnimate animation="slideLeft" by="character" className="text-2xl md:text-3xl font-black" duration={0.7} delay={0.4}>
                    Let`s understand better what you want to learn
                </TextAnimate>
            )
                :
                <motion.div
                    className="w-full h-full flex flex-col rounded-4xl mt-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Score and timer header */}
                    <GameHeader score={score} timeRemaining={timer} />

                    {/* Main quiz area */}
                    <div className="flex-1 flex items-center justify-center z-50 h-full">
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
                                    totalQuestions={lesson?.activities.length || 0}
                                    onReset={resetGame}
                                />
                            </AnimatePresence>
                        )}
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
} 