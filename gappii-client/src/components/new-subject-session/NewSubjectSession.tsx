"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Activity, NewSubjectSchema } from "../lesson-session/types"
import { SessionCard } from "../lesson-session/QuizCard"
import { useInput } from "@/app/home/InputContext"
import { DeepPartial } from "ai"
import { useLessonSession } from "@/app/home/LessonSessionContext"
import { useRouterChange } from "@/app/home/RouterContext"
import { NewSubjectSessionFinish } from "./SessionFinish"

export interface NewSubjectSessionProps {
    initialTime: number;
    isAddLessonRoute: boolean;
}

export function NewSubjectSession() {
    // Game state
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
    const [gameActive, setGameActive] = useState(true)
    const [isAnswering, setIsAnswering] = useState(false)
    const { newSubjectLesson: lesson } = useInput()
    const [currentActivity, setCurrentActivity] = useState<DeepPartial<Activity> | undefined>(lesson?.activities[0])

    const { addNewSubjectAttempt, startSession } = useLessonSession()

    // Watch for router changes
    useRouterChange((newRoute, oldRoute) => {
        if (oldRoute.includes("session")) {
            resetGame()
        }
        if (newRoute.includes("session")) {
            startSession()
        }
    });

    // Update current activity when index changes
    useEffect(() => {
        const activities = lesson?.activities
        if (activities && currentActivityIndex < activities.length) {
            setCurrentActivity(activities[currentActivityIndex])
        }
    }, [currentActivityIndex, lesson])

    // Handle answer submission
    const handleAnswer = useCallback((answer: string) => {
        if (isAnswering || !currentActivity) return

        setIsAnswering(true)

        const validationResult = NewSubjectSchema.safeParse(currentActivity)
        if (!validationResult.success) {
            console.warn('Current activity is not a complete Activity object:', currentActivity)
            return
        }
        addNewSubjectAttempt({
            activity: validationResult.data,
            answerId: answer
        })

        // Move to next activity after a short delay
        setTimeout(() => {
            const activities = lesson?.activities
            if (activities && currentActivityIndex >= activities.length - 1) {
                setGameActive(false)
            } else {
                setCurrentActivityIndex(prevIndex => prevIndex + 1)
            }
            setIsAnswering(false)
        }, 500)
    }, [isAnswering, currentActivity, addNewSubjectAttempt, lesson?.activities, currentActivityIndex])

    // Reset game state
    const resetGame = () => {
        // First deactivate the game
        setGameActive(false)
        // Reset all state variables
        setCurrentActivityIndex(0)
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
                            currentActivity={currentActivity}
                            onAnswer={handleAnswer}
                        />
                    </div>
                ) : (
                    <AnimatePresence>
                        <NewSubjectSessionFinish />
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    )
} 