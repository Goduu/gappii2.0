"use client"

import { motion, AnimatePresence } from "motion/react"
import { DraggableSquare } from "./DraggableSquare"
import { OptionCard } from "./OptionCard"
import { Activity } from "./types"
import { ChevronLeft, ChevronRight, Grab } from "lucide-react"
import { DeepPartial } from "ai"
import { useQuizCard } from "./useQuizCard"
export interface QuizCardProps {
    currentQuestion: DeepPartial<Activity>;
    onAnswer: (answerId: string) => void;
}

export function SessionCard({ currentQuestion, onAnswer }: QuizCardProps) {

    const { question,
        options,
        correctOptionId,
        colorTransform,
        xSpring,
        controls,
        hasAnswered,
        boundaries,
        getBackgroundColor,
        handleDragEnd,
    } = useQuizCard({ currentQuestion, onAnswer })

    return (
        <motion.div
            className="flex flex-col justify-between items-center flex-1 w-full h-full rounded-xl relative overflow-hidden py-5"
            style={{ background: getBackgroundColor() }}
        >
            <div className="h-1/2 md:h-2/5 text-white text-xl md:text-2xl font-bold w-full px-4 justify-center items-center flex select-none">
                {question}
            </div>

            <div className="h-1/2 md:h-1/5 w-full px-4">
                <AnimatePresence mode="wait">
                    <div className="flex h-full gap-2 justify-between w-full">
                        <OptionCard key={`left-${options?.[0]?.id}`} option={options?.[0]} position="left" />
                        <OptionCard key={`right-${options?.[1]?.id}`} option={options?.[1]} position="right" />
                    </div>
                </AnimatePresence>
            </div>

            <div className="h-1/2 md:h-1/5 w-full flex flex-col gap-4 items-center justify-center">
                <div className="relative h-[85px] flex items-center justify-center w-full rounded-4xl">
                    <div className="flex items-center justify-between w-full px-4 ">
                        <ChevronLeft className="size-8 text-white/20" />
                        <ChevronRight className="size-8 text-white/20" />
                    </div>
                    <div className="absolute">
                        <DraggableSquare
                            xSpring={xSpring}
                            controls={controls}
                            colorTransform={colorTransform}
                            dragBoundaries={{ left: boundaries.leftBoundary, right: boundaries.rightBoundary }}
                            correctAnswerPosition={!correctOptionId ? "all" : correctOptionId === options?.[0]?.id ? "left" : "right"}
                            handleDragEnd={handleDragEnd}
                            hasAnswered={hasAnswered}
                        />
                    </div>
                </div>

                <div className="text-white/70 text-center pt-10">
                    <div className="opacity-75 text-xs flex flex-col items-center">
                        <div className="items-center gap-2 hidden md:flex">
                            <ChevronLeft className="size-4" />
                            <Grab className="size-4" />
                            <ChevronRight className="size-4" />
                        </div>
                        <div className="select-none">
                            Drag the circle or use arrow keys to answer
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
} 