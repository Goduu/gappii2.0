"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Activity, ActivitySchema } from "./types"
import { SessionCard } from "./QuizCard"
import { GameOverScreen } from "./GameOverScreen"
import { useInput } from "@/app/home/InputContext"
import { DeepPartial } from "ai"
import { useLessonSession } from "@/app/home/LessonSessionContext"
import { useRouterChange } from "@/app/home/RouterContext"
import { LessonHeader } from "./LessonHeade"

export interface LearningSessionProps {
    initialTime: number;
    isAddLessonRoute: boolean;
}

export function LearningSession({ initialTime, isAddLessonRoute }: LearningSessionProps) {
    // Game state
    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(initialTime)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [gameActive, setGameActive] = useState(true)
    const [isAnswering, setIsAnswering] = useState(false)
    const { lesson } = useInput()
    const [currentActivity, setCurrentActivity] = useState<DeepPartial<Activity> | undefined>(lesson?.activities[0])

    const { addAttempt } = useLessonSession()

    // Watch for router changes
    useRouterChange((newRoute, oldRoute) => {
        if (oldRoute === "continue" || oldRoute === "add-lesson") {
            resetGame()
        }
    });

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
            setCurrentActivity(questions[currentQuestionIndex])
        }
    }, [currentQuestionIndex, lesson])

    // Handle answer submission
    const handleAnswer = useCallback((selectedOption: string) => {
        if (isAnswering || !currentActivity) return

        setIsAnswering(true)


        const validationResult = ActivitySchema.safeParse(currentActivity)
        if (!validationResult.success) {
            console.warn('Current question is not a complete Activity object:', currentActivity)
            return
        }
        addAttempt({
            activity: validationResult.data,
            isCorrect: selectedOption === validationResult.data.correctOptionId
        })

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
    }, [isAnswering, currentActivity, addAttempt, lesson?.activities, currentQuestionIndex])

    // Reset game state
    const resetGame = () => {
        // First deactivate the game
        setGameActive(false)
        // Reset all state variables
        setScore(0)
        setTimer(initialTime)
        setCurrentQuestionIndex(0)
        setCurrentActivity(lesson?.activities[0])
        setIsAnswering(false)

        // Use setTimeout to ensure state updates are processed before reactivating
        setTimeout(() => {
            setGameActive(true)
        }, 50)
    }

    return (
        <motion.div
            className="w-full h-full flex flex-col rounded-4xl mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {/* Score and timer header */}
            <LessonHeader score={score} timeRemaining={timer} />

            {/* Main quiz area */}
            <div className="flex-1 flex items-center justify-center z-50 h-full">
                {gameActive && currentActivity ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <SessionCard
                            currentQuestion={currentActivity}
                            onAnswer={handleAnswer}
                        />
                    </div>
                ) : (
                    <AnimatePresence>
                        <GameOverScreen
                            score={score}
                            totalQuestions={lesson?.activities.length || 0}
                            onReset={resetGame}
                            isAddLessonRoute={isAddLessonRoute}
                        />
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    )
} 