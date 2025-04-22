"use client"

import { motion } from "motion/react"
import { QuizOption } from "./types"
import { cn } from "@/lib/utils";

interface OptionCardProps {
  option: QuizOption;
  position: 'left' | 'right';
}

export function OptionCard({ option, position }: OptionCardProps) {
  const isLeft = position === 'left'

  return (
    <motion.div
      key={`${position}-${option.id}`}
      className={cn(
        `absolute ${isLeft ? 'left-8' : 'right-8'}`,
        "text-white text-sm md:text-xl font-bold",
        "px-3 md:px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg")}
      initial={{ x: isLeft ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: isLeft ? -100 : 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {option.text}
    </motion.div>
  )
} 