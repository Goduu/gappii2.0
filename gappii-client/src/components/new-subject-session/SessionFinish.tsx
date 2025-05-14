"use client"

import { useSquareRouter } from "@/app/home/RouterContext";
import { motion } from "motion/react"
import { useLessonSession } from "@/app/home/LessonSessionContext";
import { experimental_useObject } from "@ai-sdk/react";
import { useState } from "react";
import { CreateSubjectTopicsAndActivitiesSchema } from "../lesson-session/types";
import { TypingAnimation } from "../magicui/typing-animation";
import GibberishText from "../magicui/gibberish-text";

export function NewSubjectSessionFinish() {
    const { changeRouter: setRouter } = useSquareRouter()
    const [loadedSubject, setLoadedSubject] = useState(false)
    const { newSubjectAttempts, setActivities, currentSubject, setCurrentSubject } = useLessonSession()


    const { submit, isLoading } = experimental_useObject({
        api: "/api/createSubjectTopicsAndActivities",
        schema: CreateSubjectTopicsAndActivitiesSchema,
        onFinish({ object }) {
            if (object != null) {
                setActivities(object.activities)
                setCurrentSubject(object.subject)
                setTimeout(() => {
                    setRouter('session/continue')
                }, 3000)
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
                "description: " + attempt.activity.description +
                "answer " + attempt.activity.options.find(option => option === attempt.answerId)
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
            {currentSubject && (
                <GibberishText text={currentSubject} className="text-3xl md:text-4xl font-bold mb-4" />
            )}
        </motion.div>
    )
} 