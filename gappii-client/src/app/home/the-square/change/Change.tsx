import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSquareRouter } from "../../RouterContext"
import { ChangeSubjects } from "./ChangeSubjects"
import { Replace } from "lucide-react"


export const Change = () => {
    const { router, setRouter } = useSquareRouter()

    const isChangeRoute = router === "change"

    return (
        <div className={cn(
            "z-20 flex gap-10 justify-center transition-all duration-300",
            isChangeRoute && "bottom-0"
        )}>
            <motion.div
                className="drop-shadow-lg"
                animate={{
                    scale: isChangeRoute ? [1] : [1, 1, 0.9, 0.80, 1, 1, 0.95, 1, 1, 1, 1, 1,],
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}>

                <motion.div
                    layout
                    data-expanded={isChangeRoute}
                    className={cn(
                        "rounded-4xl drop-shadow-lg",
                        "items-center justify-center bg-gradient-to-b from-midnight-900 to-midnight-800",
                        "flex size-14 cursor-pointer transition-all duration-500",
                        isChangeRoute && "w-screen h-screen flex-col items-center cursor-default pt-10"
                    )}
                    onClick={() => setRouter("inSquare")}
                >
                    <AnimatePresence>
                        {isChangeRoute && (
                            <ChangeSubjects />
                        )}
                    </AnimatePresence>
                    <div className={cn(
                        "flex flex-col items-center justify-center gap-2",
                        isChangeRoute && "bottom-32 absolute z-20 cursor-pointer"
                    )}
                        onClick={(e) => {
                            if (isChangeRoute) {
                                setRouter("inSquare")
                                e.stopPropagation()
                            }
                        }
                        }
                    >
                        <Replace/>
                    </div>
                </motion.div>
            </motion.div>
        </div >

    )
}

