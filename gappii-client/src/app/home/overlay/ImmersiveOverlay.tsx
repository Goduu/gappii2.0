import { motion } from "framer-motion";
import { GradientOverlay } from "./GradientOverlay";

export function ImmersiveOverlay({
    close,
    size,
    children,
}: {
    close: () => void
    size: { width: number; height: number }
    children: React.ReactNode
}) {
    const transition = {
        duration: 0.35,
        ease: [0.59, 0, 0.35, 1],
    }

    const enteringState = {
        rotateX: 0,
        skewY: 0,
        scaleY: 1,
        scaleX: 1,
        y: 0,
        transition: {
            ...transition,
            y: { type: "spring", visualDuration: 0.7, bounce: 0.2 },
        },
    }

    const exitingState = {
        rotateX: -5,
        skewY: -1.5,
        scaleY: 2,
        scaleX: 0.4,
        y: 100,
    }

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden" onClick={close}>
            <GradientOverlay size={size} />
            <motion.div
                className="bg-slate-500/80 backdrop-blur-3xl absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={exitingState}
                    animate={enteringState}
                    exit={exitingState}
                    transition={transition}
                    style={{
                        transformPerspective: 1000,
                        originX: 0.5,
                        originY: 0,
                    }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </div>
    )
}
