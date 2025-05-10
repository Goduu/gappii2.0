"use client"

import { useSquareRouter } from "@/app/home/RouterContext";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";

interface GameHeaderProps {
  score: number;
  timeRemaining: number;
}

export function GameHeader({ score, timeRemaining }: GameHeaderProps) {

  const { setRouter } = useSquareRouter()

  return (
    <div className="relative flex justify-between items-center p-4 w-full">
      <div className="text-xl font-bold">
        Score: {score}
      </div>
      <div className={cn(
        "absolute opacity-0 group-hover:opacity-100 transition-all duration-500",
        "font-bold text-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer",
        "border-4 border-white rounded-4xl p-3"
      )}
        onClick={() => setRouter("inSquare")}>
        <Home />
      </div>
      <div className={`text-xl font-bold ${timeRemaining <= 10 ? 'text-red-500' : ''}`}>
        Time: {timeRemaining}s
      </div>
    </div>
  )
} 