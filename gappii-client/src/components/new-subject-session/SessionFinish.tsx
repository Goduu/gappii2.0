"use client"

import { useSquareRouter } from "@/app/home/RouterContext";
import { motion } from "motion/react"
import { useLessonSession } from "@/app/home/LessonSessionContext";
import { experimental_useObject } from "@ai-sdk/react";
import { useState } from "react";
import { CreateSubjectTopicsAndActivitiesSchema } from "../lesson-session/types";

interface SessionFinishProps {
    onReset: () => void;
}

export function SessionFinish({ onReset }: SessionFinishProps) {
    const { changeRouter: setRouter } = useSquareRouter()
    const [loadedSubject, setLoadedSubject] = useState(false)
    const { newSubjectAttempts } = useLessonSession()


    const { submit, isLoading } = experimental_useObject({
        api: "/api/createSubjectTopicsAndActivities",
        schema: CreateSubjectTopicsAndActivitiesSchema,
        onFinish({ object }) {
            if (object != null) {
                console.log(object)
            }
            setLoadedSubject(true)
        },
        onError: () => {
            console.log("You've been rate limited, please try again later!");
        },
    });

    if (!loadedSubject && !isLoading) {
        const userPrompt = {
            userPrompt: newSubjectAttempts.map(attempt =>
                "question: " + attempt.activity.question +
                "answer " + attempt.activity.options.find(option => option.id === attempt.answerId)?.text
            ).join("\n")
        }
        console.log(userPrompt)
        submit(userPrompt)
    }

    return (
        <motion.div
            key="game-over"
            className="text-center text-white p-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <div className="flex gap-4">
                <button
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-colors cursor-pointer"
                    onClick={() => setRouter("inSquare")}
                >
                    Back to Home
                </button>
                <button
                    onClick={onReset}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-colors cursor-pointer"
                >
                    Continue Learning
                </button>
            </div>
        </motion.div>
    )
} 