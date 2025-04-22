import { useIsPresent } from "motion/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export function GradientOverlay({
    size,
}: {
    size: { width: number; height: number }
}) {
    const breathe = useMotionValue(0)
    const isPresent = useIsPresent()

    useEffect(() => {
        if (!isPresent) {
            animate(breathe, 0, { duration: 0.5, ease: "easeInOut" })
        }

        async function playBreathingAnimation() {
            await animate(breathe, 1, {
                duration: 0.5,
                delay: 0.35,
                ease: [0, 0.55, 0.45, 1],
            })

            animate(breathe, [null, 0.7, 1], {
                duration: 15,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
            })
        }

        playBreathingAnimation()
    }, [isPresent])

    const enterDuration = 0.75
    const exitDuration = 0.5

    const expandingCircleRadius = size.width / 3

    return (
        <div className="gradient-container">
            <motion.div
                className="bg-slate-400 absolute rounded-full filter blur-3xl"
                initial={{
                    scale: 0,
                    opacity: 1,
                }}
                animate={{
                    scale: 10,
                    opacity: 0.2,
                    transition: {
                        duration: enterDuration,
                        opacity: { duration: enterDuration, ease: "easeInOut" },
                    },
                }}
                exit={{
                    scale: 0,
                    opacity: 1,
                    transition: { duration: exitDuration },
                }}
                style={{
                    left: `calc(50% - ${expandingCircleRadius / 2}px)`,
                    top: "100%",
                    width: expandingCircleRadius,
                    height: expandingCircleRadius,
                    originX: 0.5,
                    originY: 1,
                }}
            />


            <motion.div
                className="absolute rounded-full blur-3xl w-[200%] aspect-square bg-slate-600"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 0.9,
                    transition: { duration: enterDuration },
                }}
                exit={{
                    opacity: 0,
                    transition: { duration: exitDuration },
                }}
                style={{
                    scale: breathe,
                    width: size.width * 2,
                    height: size.width * 2,
                    top: -size.width,
                    left: -size.width,
                }}
            />

            <motion.div
                className="absolute rounded-full blur-3xl w-[200%] aspect-square bg-slate-400"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 0.9,
                    transition: { duration: enterDuration },
                }}
                exit={{
                    opacity: 0,
                    transition: { duration: exitDuration },
                }}
                style={{
                    scale: breathe,
                    width: size.width * 2,
                    height: size.width * 2,
                    top: size.height - size.width,
                    left: 0,
                }}
            />
        </div>
    )
}