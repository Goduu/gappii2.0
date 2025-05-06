import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSquareRouter } from "../../RouterContext"
import { Play } from "lucide-react"
import { LearningSession } from "@/components/quiz/LearningSession"
import { SampleQuizData } from "@/components/quiz/quiz-data"

export const Continue = () => {
    const { router, setRouter } = useSquareRouter()

    const isContinueRoute = router === "continue"

    return (
        <div className={cn(
            "z-20 flex gap-10 justify-center transition-all duration-300",
            isContinueRoute && "bottom-0"
        )}>
            <motion.div
                className="drop-shadow-lg"
                animate={{
                    scale: isContinueRoute ? [1] : [1, 1, 0.9, 0.80, 1, 1, 0.95, 1, 1, 1, 1, 1,],
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}>

                <motion.div
                    layout
                    data-expanded={isContinueRoute}
                    className={cn(
                        "rounded-4xl drop-shadow-lg overflow-hidden",
                        "items-center justify-center bg-gradient-to-b from-midnight-900 to-midnight-800",
                        "flex size-14 cursor-pointer transition-all duration-500",
                        isContinueRoute && "w-screen h-screen flex-col items-center cursor-default pt-10"
                    )}
                    onClick={(e) => {
                        if (isContinueRoute) {
                            e.stopPropagation()
                        }
                    }}
                >
                    {isContinueRoute && (
                        <LearningSession
                            questions={SampleQuizData}
                            initialTime={60}
                        />
                    )}
                    <div className={cn(
                        "flex flex-col items-center justify-center gap-2",
                        isContinueRoute && "opacity-0"
                    )}>
                        <Play />
                    </div>
                </motion.div>
            </motion.div>
        </div >

    )
}

