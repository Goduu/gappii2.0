"use client"

import { SampleQuizData } from "@/components/quiz/quiz-data"
import { LearningSession } from "@/components/quiz/LearningSession"

export default function SpinnerTestPage() {
    return (
        <LearningSession
            questions={SampleQuizData}
            initialTime={60}
        />
    )
} 