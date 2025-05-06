"use client"

import { motion, useTransform, MotionValue, AnimationControls } from "motion/react"
import { useEffect, useState } from "react"

/**
 * Props for the DraggableCircle component
 */
interface DraggableSquareProps {
  /** Motion value for horizontal position */
  xSpring: MotionValue<number>;
  /** Animation controls for programmatic animations */
  controls: AnimationControls;
  /** Motion value for the circle's color transformation */
  colorTransform: MotionValue<string>;
  /** Constraints for how far the circle can be dragged */
  dragBoundaries: {
    left: number;
    right: number;
  };
  /** Which side contains the correct answer */
  correctAnswerPosition: "left" | "right";
  /** Callback fired when drag ends */
  handleDragEnd: () => void;
  /** Whether the answer has been answered */
  hasAnswered: boolean;
}

export function DraggableSquare({
  xSpring,
  controls,
  colorTransform,
  dragBoundaries,
  correctAnswerPosition,
  handleDragEnd,
  hasAnswered
}: DraggableSquareProps) {
  console.log("correctAnswerPosition", correctAnswerPosition)
  // Determine if the correct answer is on the left side
  const isCorrectLeft = correctAnswerPosition === "left"

  // Responsive thresholds based on screen size
  const [thresholds, setThresholds] = useState({
    animationThreshold: 50,
    fullAnimation: 150
  })

  // Update thresholds based on screen size
  useEffect(() => {
    const updateThresholds = () => {
      const width = window.innerWidth

      if (width < 640) { // Small screens
        setThresholds({
          animationThreshold: 90,
          fullAnimation: 100
        })
      } else if (width < 1024) { // Medium screens
        setThresholds({
          animationThreshold: 120,
          fullAnimation: 130
        })
      } else { // Large screens
        setThresholds({
          animationThreshold: 140,
          fullAnimation: 150
        })
      }
    }

    // Set initial values
    updateThresholds()

    // Update on resize
    window.addEventListener('resize', updateThresholds)

    return () => {
      window.removeEventListener('resize', updateThresholds)
    }
  }, [])

  // Animation control for the success checkmark - only show when moving toward correct answer
  const checkmarkPathProgress = useTransform(
    xSpring,
    isCorrectLeft
      ? [-thresholds.fullAnimation, -thresholds.animationThreshold, thresholds.animationThreshold, thresholds.fullAnimation]
      : [-thresholds.fullAnimation, -thresholds.animationThreshold, thresholds.animationThreshold, thresholds.fullAnimation],
    isCorrectLeft
      ? [1, 0, 0, 0]
      : [0, 0, 0, 1]
  )

  // Animation control for the error X mark - only show when moving toward incorrect answer
  const xMarkPathProgress = useTransform(
    xSpring,
    isCorrectLeft
      ? [-thresholds.fullAnimation, -thresholds.animationThreshold, thresholds.animationThreshold, thresholds.fullAnimation]
      : [-thresholds.fullAnimation, -thresholds.animationThreshold, thresholds.animationThreshold, thresholds.fullAnimation],
    isCorrectLeft
      ? [0, 0, 0, 1]
      : [1, 0, 0, 0]
  )

  // Monitor xSpring changes and cleanup subscription
  useEffect(() => {
    const unsubscribe = xSpring.on("change", () => {
      // Uncomment for debugging position values
      // console.log("xSpring value:", xSpring.get());
    });

    return () => {
      unsubscribe();
    };
  }, [xSpring]);

  // Handle drag motion

  return (
    <motion.div
      animate={{opacity: [0,1]}}
      transition={{delay: 0.4, duration: 0.7}}
    >
      <motion.div
        className="size-20 md:size-32 bg-gray-200 rounded-2xl md:rounded-4xl p-5 z-10 cursor-grab active:cursor-grabbing"
        style={{ x: xSpring }}
        animate={controls}
        drag="x"
        dragConstraints={dragBoundaries}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          bounce: 0.25
        }}
      >
        {/* SVG containing the circle and answer indicators */}
        <svg className="progress-icon" viewBox="0 0 50 50">
          {/* Circle background */}
          <motion.path
            fill="none"
            strokeWidth="5px"
            stroke={hasAnswered ? colorTransform : "rgb(20, 0, 20)"}
            d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
            style={{
              x: 5,
              y: 5,
            }}
          />

          {/* Checkmark for correct answer */}
          <motion.path
            id="checkmark"
            fill="none"
            strokeWidth="2"
            stroke={hasAnswered ? colorTransform : "rgb(20, 0, 20)"}
            d="M14,26 L 22,33 L 35,16"
            strokeDasharray="0 1"
            style={{ pathLength: hasAnswered ? checkmarkPathProgress : 0 }}
          />

          {/* Diagonal line for neutral state */}
          <motion.path
            id="neutral"
            fill="none"
            strokeWidth="2"
            stroke={hasAnswered ? colorTransform : "rgb(20, 0, 20)"}
            d="M17,17 L33,33"
            strokeDasharray="0 1"
            style={{ pathLength: hasAnswered ? xMarkPathProgress : 0 }}
          />

          {/* X mark for incorrect answer */}
          <motion.path
            id="xmark"
            fill="none"
            strokeWidth="2"
            stroke={hasAnswered ? colorTransform : "gray"}
            d="M33,17 L17,33"
            strokeDasharray="0 1"
            style={{ pathLength: hasAnswered ? xMarkPathProgress : 0 }}
          />
        </svg>
      </motion.div>
    </motion.div>
  )
} 