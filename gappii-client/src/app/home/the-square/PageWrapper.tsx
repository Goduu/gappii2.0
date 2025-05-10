import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { useSquareRouter } from "../RouterContext"


type PageWrapperProps = {
    children: ReactNode
    icon: ReactNode
    isThisRoute: boolean
    showEverything: boolean
}
export const PageWrapper = ({ children, icon, isThisRoute, showEverything }: PageWrapperProps) => {
    const { setRouter, isInSquareRoute } = useSquareRouter()

    if (!showEverything) {
        return
    }

    return (
        <div className={cn(
            "z-20 flex gap-10 justify-center transition-all duration-300",
            isThisRoute && "bottom-0"
        )}>
            <motion.div
                className="drop-shadow-lg w-full h-full"
                animate={{
                    scale: isThisRoute ? [1] : [1, 1, 0.9, 0.80, 1, 1, 0.95, 1, 1, 1, 1, 1,],
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}>
                <AnimatePresence>
                    {isThisRoute &&
                        <motion.div
                            layout
                            className={cn(
                                "flex flex-col w-screen h-screen",
                                "items-center justify-center pt-10",
                                "bg-gradient-to-b from-midnight-900 to-midnight-800",
                                "rounded-4xl drop-shadow-lg"
                            )}
                        >
                            {children}
                        </motion.div>
                    }
                </AnimatePresence>
                {isInSquareRoute &&
                    <motion.div
                        layout
                        data-expanded={isThisRoute}
                        className={cn(
                            "rounded-4xl drop-shadow-lg",
                            "items-center justify-center bg-gradient-to-b from-midnight-900 to-midnight-800",
                            "flex size-14 cursor-pointer transition-all duration-500",
                            isThisRoute && "w-screen h-screen flex-col items-center cursor-default pt-10"
                        )}
                        onClick={() => setRouter("inSquare")}
                    >
                        <div className={cn(
                            "flex flex-col items-center justify-center gap-2",
                            isThisRoute && "bottom-32 absolute z-20 cursor-pointer"
                        )}
                            onClick={(e) => {
                                if (isThisRoute) {
                                    setRouter("inSquare")
                                    e.stopPropagation()
                                }
                            }}
                        >
                            {icon}
                        </div>
                    </motion.div>
                }
            </motion.div>
        </div>
    )
}

