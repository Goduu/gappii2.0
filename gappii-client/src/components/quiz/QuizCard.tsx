"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, useTransform, useSpring, useAnimation, AnimatePresence } from "motion/react"
import { DraggableCircle } from "./DraggableCircle"
import { OptionCard } from "./OptionCard"
import { QuizQuestion } from "./types"
import { ChevronLeft, ChevronRight, Grab } from "lucide-react"

export interface QuizCardProps {
    currentQuestion: QuizQuestion;
    onAnswer: (isCorrect: boolean) => void;
}

export function SessionCard({ currentQuestion, onAnswer }: QuizCardProps) {
    const { question, options, correctOptionId } = currentQuestion
    const xSpring = useSpring(0, { stiffness: 400, damping: 30 })
    const controls = useAnimation()
    const [hasAnswered, setHasAnswered] = useState(false)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    // Track if component is mounted to avoid state updates after unmount
    const isMounted = useRef(true)

    // Responsive thresholds based on screen size
    const [boundaries, setBoundaries] = useState({
        leftBoundary: -200,
        rightBoundary: 200,
        answerThreshold: 50
    })

    // Update boundaries based on screen size
    useEffect(() => {
        const updateBoundaries = () => {
            const width = window.innerWidth

            if (width < 640) { // Small screens
                setBoundaries({
                    leftBoundary: -120,
                    rightBoundary: 120,
                    answerThreshold: 10
                })
            } else if (width < 1024) { // Medium screens
                setBoundaries({
                    leftBoundary: -160,
                    rightBoundary: 160,
                    answerThreshold: 20
                })
            } else { // Large screens
                setBoundaries({
                    leftBoundary: -250,
                    rightBoundary: 250,
                    answerThreshold: 30
                })
            }
        }

        // Set initial values
        updateBoundaries()

        // Update on resize
        window.addEventListener('resize', updateBoundaries)

        return () => {
            window.removeEventListener('resize', updateBoundaries)
        }
    }, [])

    // Transform values for animations
    const xInput = [boundaries.leftBoundary, 0, boundaries.rightBoundary]

    const colorTransform = useTransform(xSpring, xInput,
        options[0].id === correctOptionId ?
            [
                "rgb(3, 209, 0)",
                "rgb(20, 0, 20)",
                "rgb(159, 7, 18)",
            ]
            :
            [
                "rgb(159, 7, 18)",
                "rgb(20, 0, 20)",
                "rgb(3, 209, 0)",
            ]
    )

    // Keep track if component is mounted
    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    // Handle arrow key movement
    const moveWithArrow = useCallback((direction: 'left' | 'right') => {
        if (hasAnswered) return

        const position = direction === 'right' ?
            boundaries.rightBoundary :
            boundaries.leftBoundary

        // First set hasAnswered to prevent multiple answers
        setHasAnswered(true)

        // Calculate if the answer is correct
        const isRight = direction === 'right'
        const selectedOptionId = isRight ? options[1].id : options[0].id
        const correct = selectedOptionId === correctOptionId
        setIsCorrect(correct)

        // Animate using controls rather than just setting the spring value
        controls.start({
            x: position,
            transition: { type: 'spring', stiffness: 500, damping: 25 }
        }).finally(() => {
            console.log("finally")
            if (isMounted.current) {
                console.log("isMounted.current")
                onAnswer(correct)
            }

            controls.start({
                x: 0,
                transition: { type: 'spring', stiffness: 500, damping: 25 }
            })
        })
    }, [hasAnswered, options, correctOptionId, onAnswer, controls, boundaries.rightBoundary, boundaries.leftBoundary])

    // Check if answer is correct based on drag position
    const checkAnswer = useCallback((x: number) => {
        if (hasAnswered) return

        const isRight = x > boundaries.answerThreshold
        const isLeft = x < -boundaries.answerThreshold

        if (!isRight && !isLeft) return

        setHasAnswered(true)

        // Ensure consistency: left = options[0], right = options[1]
        const selectedOptionId = isLeft ? options[0].id : options[1].id
        const correct = selectedOptionId === correctOptionId
        setIsCorrect(correct)

        // Animate to the chosen side
        const targetX = isLeft ? boundaries.leftBoundary : boundaries.rightBoundary

        // Update the spring directly to ensure transforms
        xSpring.set(targetX)

        // Also update the animation control
        controls.start({
            x: targetX,
            transition: { type: 'spring', stiffness: 2000, damping: 30 }
        }).then(() => {
            if (isMounted.current) {
                // Only proceed to the next question if not dragging
                if (!isDragging) {
                    onAnswer(correct)
                }
            }
        })

    }, [options, correctOptionId, hasAnswered, controls, onAnswer, xSpring, boundaries.answerThreshold, boundaries.leftBoundary, boundaries.rightBoundary, isDragging])

    // Handle drag end event
    const handleDragEnd = () => {
        // Set dragging to false
        setIsDragging(false)

        // Get the current position from the spring value instead of just the offset
        const currentPosition = xSpring.get();
        const isSignificantDrag = Math.abs(currentPosition) > boundaries.answerThreshold;

        if (isSignificantDrag) {
            // If dragged far enough to trigger answer
            checkAnswer(currentPosition)
        } else if (hasAnswered && isCorrect !== null) {
            // If answer was already checked, proceed to next question
            onAnswer(isCorrect)
        } else {
            // Otherwise return to center
            xSpring.set(0) // Reset spring value
            controls.start({
                x: 0,
                transition: { type: 'spring', stiffness: 500, damping: 25 }
            })
        }
    }

    // Handle keyboard events for accessibility
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (hasAnswered) return

        if (event.key === "ArrowRight") {
            moveWithArrow('right')
        } else if (event.key === "ArrowLeft") {
            moveWithArrow('left')
        }
    }, [hasAnswered, moveWithArrow])

    // Set up keyboard event listeners
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleKeyDown])

    // Reset state when options change
    useEffect(() => {
        setHasAnswered(false)
        setIsCorrect(null)

        // Reset both controls and spring value
        xSpring.set(0)
        controls.start({
            x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        })
    }, [options, controls, xSpring])

    // Get background color based on answer
    const getBackgroundColor = () => {
        if (!hasAnswered) return "linear-gradient(180deg, oklch(0.21 0.034 264.665) 0%, oklch(0.13 0.028 261.692) 100%)"

        return isCorrect
            ? "linear-gradient(180deg, oklch(0.527 0.154 150.069) 0%, oklch(0.266 0.065 152.934) 100%)"
            : "linear-gradient(180deg, oklch(0.505 0.213 27.518) 0%, oklch(0.258 0.092 26.042) 100%)"
    }

    return (
        <motion.div
            className="flex flex-col justify-between items-center flex-1 w-full h-full rounded-xl relative overflow-hidden"
            style={{ background: getBackgroundColor() }}
        >
            <div className="h-1/2 md:h-2/5 text-white text-xl md:text-2xl font-bold w-full px-4 justify-center items-center flex">
                {question}
            </div>

            <div className="h-1/2 md:h-1/5 w-full px-4">
                <AnimatePresence mode="wait">
                    <div className="flex h-full gap-2 justify-between w-full">
                        <OptionCard key={`left-${options[0].id}`} option={options[0]} position="left" />
                        <OptionCard key={`right-${options[1].id}`} option={options[1]} position="right" />
                    </div>
                </AnimatePresence>
            </div>

            <div className="h-1/2 md:h-1/5 w-full flex flex-col gap-4 items-center justify-center">
                <div className="relative h-[85px] flex items-center justify-center w-full bg-gray-900/70 rounded-xl">
                    <div className="flex items-center justify-between w-full px-4 ">
                        <ChevronLeft className="size-8 text-white/20" />
                        <ChevronRight className="size-8 text-white/20" />
                    </div>
                    <div className="absolute">
                        <DraggableCircle
                            xSpring={xSpring}
                            controls={controls}
                            colorTransform={colorTransform}
                            dragBoundaries={{ left: boundaries.leftBoundary, right: boundaries.rightBoundary }}
                            correctAnswerPosition={options[0].id === correctOptionId ? "left" : "right"}
                            handleDragEnd={handleDragEnd}
                            hasAnswered={hasAnswered}
                        />
                    </div>
                </div>

                <div className="text-white/70 text-center mt-4">
                    <div className="opacity-75 text-sm flex flex-col items-center gap-2">
                        <div className="items-center gap-2 hidden md:flex">
                            <ChevronLeft className="size-4" />
                            <Grab className="size-4" />
                            <ChevronRight className="size-4" />
                        </div>
                        <div>
                            Drag the circle or use arrow keys to answer
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
} 