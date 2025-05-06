import { TelescopeIcon } from "@/components/ui/telescope"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSquareRouter } from "../../RouterContext"
import { ExploreSubjects } from "./ExploreSubjects"


export const Explore = () => {
    const { router, setRouter } = useSquareRouter()

    const isExploreRoute = router === "explore"

    return (
        <div className={cn(
            "z-20 flex gap-10 justify-center transition-all duration-300",
            isExploreRoute && "bottom-0"
        )}>
            <motion.div
                className="drop-shadow-lg"
                animate={{
                    scale: isExploreRoute ? [1] : [1, 1, 0.9, 0.80, 1, 1, 0.95, 1, 1, 1, 1, 1,],
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}>

                <motion.div
                    layout
                    data-expanded={isExploreRoute}
                    className={cn(
                        "rounded-4xl drop-shadow-lg",
                        "items-center justify-center bg-gradient-to-b from-teal-900 to-teal-950",
                        "flex size-14 cursor-pointer transition-all duration-500",
                        isExploreRoute && "w-screen h-screen flex-col items-center cursor-default pt-10"
                    )}
                    onClick={() => setRouter("inSquare")}
                >

                    <AnimatePresence>
                        {isExploreRoute && (
                            <ExploreSubjects />
                        )}
                    </AnimatePresence>
                    <div className={cn(
                        "flex flex-col items-center justify-center gap-2",
                        isExploreRoute && "bottom-32 absolute z-20 cursor-pointer"
                    )}
                        onClick={(e) => {
                            if (isExploreRoute) {
                                setRouter("inSquare")
                                e.stopPropagation()
                            }
                        }
                        }
                    >
                        <TelescopeIcon
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div >

    )
}

