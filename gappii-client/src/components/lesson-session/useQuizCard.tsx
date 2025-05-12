import { useAnimation, useSpring, useTransform } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { SessionCardProps } from "./QuizCard"

export const useQuizCard = ({ currentQuestion, onAnswer }: SessionCardProps) => {
    const { question, options, correctOptionId } = currentQuestion
    const xSpring = useSpring(0, { stiffness: 400, damping: 30 })
    const controls = useAnimation()
    const [hasAnswered, setHasAnswered] = useState(false)
    const [selectAnswerId, setSelectedAnswerId] = useState<string | null>(null)
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
        !correctOptionId ?
            [
                "rgb(3, 209, 0)", // Green left
                "rgb(20, 0, 20)", // Black center
                "rgb(3, 209, 0)", // Green right
            ]
            :
            (options && options?.[0]?.id === correctOptionId) ?
                [
                    "rgb(3, 209, 0)", // Green left
                    "rgb(20, 0, 20)", // Black center
                    "rgb(159, 7, 18)", // Red right
                ]
                :
                [
                    "rgb(159, 7, 18)", // Red left
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
        const selectedOptionId = isRight ? options && options?.[1]?.id : options && options?.[0]?.id
        const correct = !correctOptionId || selectedOptionId === correctOptionId
        setIsCorrect(correct)

        // Animate using controls rather than just setting the spring value
        controls.start({
            x: position,
            transition: { type: 'spring', stiffness: 500, damping: 25 }
        }).finally(() => {
            if (isMounted.current && selectedOptionId) {
                setSelectedAnswerId(selectedOptionId)
                onAnswer(selectedOptionId)
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
        const selectedOptionId = isLeft ? options?.[0]?.id : options?.[1]?.id
        const correct = !correctOptionId || selectedOptionId === correctOptionId
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
                if (!isDragging && selectedOptionId) {
                    setSelectedAnswerId(selectedOptionId)
                    onAnswer(selectedOptionId)
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
        } else if (hasAnswered && isCorrect !== null && selectAnswerId) {
            onAnswer(selectAnswerId)
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
        if (!hasAnswered) return ""

        return isCorrect
            ? "linear-gradient(180deg, oklch(0.527 0.154 150.069) 0%, oklch(0.266 0.065 152.934) 100%)"
            : "linear-gradient(180deg, oklch(0.505 0.213 27.518) 0%, oklch(0.258 0.092 26.042) 100%)"
    }

    return {
        question,
        options,
        correctOptionId,
        colorTransform,
        xSpring,
        controls,
        hasAnswered,
        boundaries,
        getBackgroundColor,
        handleDragEnd,
    }
}