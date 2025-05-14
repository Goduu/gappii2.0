import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import OrbitingMenu from "./OrbitingMenu"
import TheCircle from "./TheCircle"
import { useSquareRouter } from "../RouterContext"
import BackStripe from "../BackStripe"
import LogoTextWhite from "../LogoTextWhite"

export default function TheSquare() {
    const { router, changeRouter: setRouter } = useSquareRouter()

    const handleClick = () => {
        if (router === "home") {
            console.log("home")
            setRouter("inSquare")
        } else if (router === "session/continue") {
            return;
        } else if (router !== "inSquare") {
            console.log("inSquare")
            setRouter("inSquare")
        }
    }

    const isInSquare = router !== "home"
    const isContinueRoute = router === "session/continue"

    return (
        <div className={cn(
            "absolute flex items-center gap-10 justify-center left-1/2 -translate-x-1/2 bottom-1/2 transition-all duration-300",
            isInSquare && "bottom-10"
        )}>
            <motion.div
                className="drop-shadow-lg"
                animate={{
                    scale: isInSquare ? [1] : [1, 1, 0.9, 0.80, 1, 1, 0.95, 1, 1, 1, 1, 1,],
                    rotate: isInSquare ? [0] : [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 135, 45]
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}>

                <motion.div
                    layout
                    data-expanded={isInSquare}
                    className={cn(
                        "rounded-4xl drop-shadow-lg relative",
                        "items-center justify-center bg-gradient-to-b from-midnight-950 to-midnight-800",
                        "flex size-32 cursor-pointer transition-all duration-500",
                        isInSquare && "w-screen h-screen items-end cursor-default",
                        isContinueRoute && "cursor-grab"
                    )}
                    onClick={handleClick}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isInSquare &&
                            <motion.div
                                animate={{ opacity: [0, 0.6] }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.4,
                                    ease: "easeInOut"
                                }}
                                className="animate-pulse">
                                <LogoTextWhite />
                            </motion.div>
                        }
                    </AnimatePresence>

                    <AnimatePresence>
                        {router !== "home" && (
                            <OrbitingMenu
                                pauseOnHover
                                radius={50}
                            />
                        )}
                    </AnimatePresence>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <TheCircle
                        />
                    </div>
                    <BackStripe routesToHide={["home", "inSquare"]} route="inSquare" />
                </motion.div>
            </motion.div>
        </div >

    )
}
