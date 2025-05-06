import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSquareRouter } from "../../RouterContext"
import { Plus } from "lucide-react"
import { TextAnimate } from "@/components/magicui/text-animate"


export const New = () => {
    const { router, setRouter } = useSquareRouter()

    const isNewRoute = router === "new"

    return (
        <div className={cn(
            "z-20 flex gap-10 justify-center transition-all duration-300",
            isNewRoute && "bottom-0"
        )}>
            <motion.div
                className="drop-shadow-lg"
                animate={{
                    scale: isNewRoute ? [1] : [1, 1, 0.9, 0.80, 1, 1, 0.95, 1, 1, 1, 1, 1,],
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}>

                <motion.div
                    layout
                    data-expanded={isNewRoute}
                    className={cn(
                        "rounded-4xl drop-shadow-lg",
                        "items-center justify-center bg-gradient-to-b from-midnight-900 to-midnight-800",
                        "flex size-14 cursor-pointer transition-all duration-500",
                        isNewRoute && "w-screen h-screen flex-col items-center cursor-default pt-10"
                    )}
                    onClick={() => setRouter("inSquare")}
                >
                    <AnimatePresence>
                        {isNewRoute && (
                            <TextAnimate animation="slideLeft" by="character" className="text-2xl md:text-3xl font-black" duration={0.7} delay={0.4}>
                                What do you want to learn?
                            </TextAnimate>
                        )}
                    </AnimatePresence>
                    <div className={cn(
                        "flex flex-col items-center justify-center gap-2",
                        isNewRoute && "bottom-32 absolute z-20 cursor-pointer"
                    )}
                        onClick={(e) => {
                            if (isNewRoute) {
                                setRouter("inSquare")
                                e.stopPropagation()
                            }
                        }
                        }
                    >
                        <Plus />
                    </div>
                </motion.div>
            </motion.div>
        </div >

    )
}

