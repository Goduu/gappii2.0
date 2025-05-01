import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useRef } from "react"
import OrbitingMenu from "./OrbitingMenu"
import TheCircle from "./TheCircle"
import { MenuOption } from "../menuOptionsList"
import AnimatedBeam from "./AnimatedBeam"

type TheSquareProps = {
    isOpen: boolean
    onSelectOption: (option: MenuOption) => void
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
    isOpen,
    setIsOpen,
    handleBackspace,
    onSelectOption
}: TheSquareProps) {

    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (!isOpen) {
            inputRef.current?.focus()
            setIsOpen(!isOpen)
        }
    }

    return (

        <div className={cn(
            "absolute flex items-center gap-10 justify-center left-1/2 -translate-x-1/2 bottom-1/2 transition-all duration-300",
            isOpen && "bottom-10"
        )}>
            <motion.div
                className="drop-shadow-lg"
                animate={{
                    scale: isOpen ? [1] : [1, 1, 0.9, 0.80, 1, 1, 0.95, 1, 1, 1, 1, 1,],
                    rotate: isOpen ? [0] : [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 135, 45]
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}>

                <motion.div
                    layout
                    data-expanded={isOpen}
                    className={cn(
                        "rounded-4xl drop-shadow-lg",
                        "items-center justify-center bg-gradient-to-b [background:radial-gradient(125%_125%_at_50%_10%,#030637_30%,#10439F_100%)]",
                        "flex size-32 cursor-pointer transition-all duration-500",
                        isOpen && "w-screen h-screen items-end cursor-default"
                    )}
                    onClick={handleClick}
                >
                        {isOpen && (
                            <OrbitingMenu
                                onOptionHover={onSelectOption}
                                pauseOnHover
                                radius={50}
                            />
                        )}

                        <TheCircle
                            inputRef={inputRef}
                            isOpen={isOpen}
                            setTextInput={setTextInput}
                            textInput={textInput}
                            onEnter={onEnter}
                            handleBackspace={handleBackspace}
                        />
                </motion.div>
            </motion.div>
        </div >

    )
}

export const SquarePlaceholder = () => {
    return (
        <div className="h-14 w-full">
        </div>
    )
}
