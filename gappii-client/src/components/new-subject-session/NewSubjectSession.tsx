"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Activity, NewSubjectSchema } from "../lesson-session/types"
import { SessionCard } from "../lesson-session/QuizCard"
import { useInput } from "@/app/home/InputContext"
import { DeepPartial } from "ai"
import { useLessonSession } from "@/app/home/LessonSessionContext"
import { useRouterChange } from "@/app/home/RouterContext"
import { SessionFinish } from "./SessionFinish"

export interface NewSubjectSessionProps {
    initialTime: number;
    isAddLessonRoute: boolean;
}

export function NewSubjectSession() {
    // Game state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [gameActive, setGameActive] = useState(true)
    const [isAnswering, setIsAnswering] = useState(false)
    const { newSubjectLesson: lesson } = useInput()
    const [currentActivity, setCurrentActivity] = useState<DeepPartial<Activity> | undefined>(lesson?.activities[0])

    const { addNewSubjectAttempt } = useLessonSession()

    // Watch for router changes
    useRouterChange((newRoute, oldRoute) => {
        if (oldRoute.includes("session")) {
            resetGame()
        }
    });

    // Update current question when index changes
    useEffect(() => {
        const questions = lesson?.activities
        if (questions && currentQuestionIndex < questions.length) {
            setCurrentActivity(questions[currentQuestionIndex])
        }
    }, [currentQuestionIndex, lesson])

    // Handle answer submission
    const handleAnswer = useCallback((answer: string) => {
        if (isAnswering || !currentActivity) return

        setIsAnswering(true)

        const validationResult = NewSubjectSchema.safeParse(currentActivity)
        if (!validationResult.success) {
            console.warn('Current question is not a complete Activity object:', currentActivity)
            return
        }
        addNewSubjectAttempt({
            activity: validationResult.data,
            answerId: answer
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
    }, [isAnswering, currentActivity, addNewSubjectAttempt, lesson?.activities, currentQuestionIndex])

    // Reset game state
    const resetGame = () => {
        // First deactivate the game
        setGameActive(false)
        // Reset all state variables
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
            <div className="p-4">
            </div>

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
                        <SessionFinish
                            onReset={resetGame}
                        />
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    )
} 