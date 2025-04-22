"use client"

import { motion } from "motion/react"
import Link from "next/link";

interface GameOverScreenProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export function GameOverScreen({ score, totalQuestions, onReset }: GameOverScreenProps) {
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
        <Link
          href="/home"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-colors cursor-pointer"
        >
          Back to Home
        </Link>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-colors cursor-pointer"
        >
          Play Again
        </button>
      </div>
    </motion.div>
  )
} 