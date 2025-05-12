"use client"

import { useSquareRouter } from "@/app/home/RouterContext";
import { motion } from "motion/react"
import { useLessonSession } from "@/app/home/LessonSessionContext";
import { experimental_useObject } from "@ai-sdk/react";
import { useState } from "react";
import { CreateSubjectTopicsAndActivitiesSchema } from "../lesson-session/types";
import { TypingAnimation } from "../magicui/typing-animation";

interface SessionFinishProps {
    onReset: () => void;
}

export function SessionFinish({ onReset }: SessionFinishProps) {
    const { changeRouter: setRouter } = useSquareRouter()
    const [loadedSubject, setLoadedSubject] = useState(false)
    const { newSubjectAttempts, setQuestions } = useLessonSession()


    const { submit, isLoading } = experimental_useObject({
        api: "/api/createSubjectTopicsAndActivities",
        schema: CreateSubjectTopicsAndActivitiesSchema,
        onFinish({ object }) {
            if (object != null) {
                console.log('setting questions', object)
                setQuestions(object.activities)
                setRouter('session/continue')
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
            className="text-center text-white p-8 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            <TypingAnimation className="text-3xl md:text-4xl font-bold mb-4" duration={50}>
                Great! Now let&apos;s create a customized lesson for you...
            </TypingAnimation>
            <TypingAnimation className="text-3xl md:text-4xl font-bold mb-4" delay={2500}>
                about...
            </TypingAnimation>
        </motion.div>
    )
} 