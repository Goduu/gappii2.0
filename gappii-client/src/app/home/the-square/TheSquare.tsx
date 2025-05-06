import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useRef } from "react"
import OrbitingMenu from "./OrbitingMenu"
import TheCircle from "./TheCircle"
import { Route } from "../menuOptionsList"
import { useSquareRouter } from "../RouterContext"

type TheSquareProps = {
    isOpen: boolean
    onSelectOption: (option: Route) => void
    setIsOpen: (isOpen: boolean) => void
    setTextInput: (newTextInput: string) => void
    handleBackspace: () => void
    textInput: string
    onEnter: () => void
}

export default function TheSquare({
    setTextInput,
    textInput,
    onEnter,
    handleBackspace,
    onSelectOption
}: TheSquareProps) {
    const { router, setRouter } = useSquareRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (router === "home") {
            inputRef.current?.focus()
            setRouter("inSquare")
        } if (router !== "inSquare") {
            setRouter("inSquare")
        }
    }

    const isInSquare = router !== "home"

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
                        "rounded-4xl drop-shadow-lg",
                        "items-center justify-center bg-gradient-to-b from-midnight-950 to-midnight-800",
                        "flex size-32 cursor-pointer transition-all duration-500",
                        isInSquare && "w-screen h-screen items-end cursor-default"
                    )}
                    onClick={handleClick}
                >
                    <AnimatePresence>
                        {(router === "inSquare" || router === "explore") && (
                            <OrbitingMenu
                                onOptionHover={onSelectOption}
                                pauseOnHover
                                radius={50}
                            />
                        )}
                    </AnimatePresence>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <TheCircle
                            inputRef={inputRef}
                            setTextInput={setTextInput}
                            textInput={textInput}
                            onEnter={onEnter}
                            handleBackspace={handleBackspace}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div >

    )
}
