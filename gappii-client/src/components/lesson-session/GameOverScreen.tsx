"use client"

import { useSquareRouter } from "@/app/home/RouterContext";
import { motion } from "motion/react"
import { CreateSubjectTopicsAndActivitiesSchema } from "./types";
import { useLessonSession } from "@/app/home/LessonSessionContext";
import { experimental_useObject } from "@ai-sdk/react";

interface GameOverScreenProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
  isAddLessonRoute: boolean;
}

export function GameOverScreen({ score, totalQuestions, onReset, isAddLessonRoute }: GameOverScreenProps) {
  const { changeRouter: setRouter } = useSquareRouter()
  const { attempts } = useLessonSession()


  const { submit, isLoading, object } = experimental_useObject({
    api: "/api/createSubjectTopicsAndActivities",
    schema: CreateSubjectTopicsAndActivitiesSchema,
    onFinish({ object }) {
      if (object != null) {
        console.log(object)
      }
    },
    onError: () => {
      console.log("You've been rate limited, please try again later!");
    },
  });

  if (isAddLessonRoute) {
    if (!isLoading) {
      submit({
        userPrompt: attempts.map(attempt =>
          "question: " + attempt.activity.question 
        ).join("\n")
      })
    }
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
      <p className="text-xl mb-6">Your final score: {score}/{totalQuestions}</p>
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