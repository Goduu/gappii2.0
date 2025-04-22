"use client"

import { Home } from "lucide-react";
import Link from "next/link";

interface GameHeaderProps {
  score: number;
  timeRemaining: number;
}

export function GameHeader({ score, timeRemaining }: GameHeaderProps) {
  return (
    <div className="relative flex justify-between items-center p-4 bg-slate-900 text-white">
      <div className="text-xl font-bold">
        Score: {score}
      </div>
      <Link href="/home" className="relative group size-16 rounded-4xl border-8 border-white/10 hover:border-white transition-all duration-200 cursor-pointer items-center justify-center" >
        <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-500 font-bold text-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Home />
        </div>
      </Link>
      <div className={`text-xl font-bold ${timeRemaining <= 10 ? 'text-red-500' : ''}`}>
        Time: {timeRemaining}s
      </div>
    </div>
  )
} 