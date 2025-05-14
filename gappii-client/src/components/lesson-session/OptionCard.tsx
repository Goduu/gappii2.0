"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils";

interface OptionCardProps {
  option: string | undefined;
  position: 'left' | 'right';
}

export function OptionCard({ option, position }: OptionCardProps) {
  const isLeft = position === 'left'

  return (
    <motion.div
      key={`${position}-${option}`}
      className={cn(
        "text-white text-sm md:text-xl font-bold w-full h-20 flex items-center justify-center",
        "p-3 md:p-6 bg-white/10 rounded-4xl select-none")}
      initial={{ x: isLeft ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: isLeft ? -100 : 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {option}
    </motion.div>
  )
} 