import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { Input } from "@/components/ui/input"
import { useRef } from "react"

type TheSquareProps = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    setTextInput: (newTextInput: string) => void
    handleBackspace: () => void
    textInput: string
    onEnter: () => void
}

export default function TheSquare({ setTextInput, textInput, onEnter, isOpen, setIsOpen, handleBackspace }: TheSquareProps) {

    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (!isOpen) {
            inputRef.current?.focus()
        }
        setIsOpen(!isOpen)
    }

    return (
        <div className={cn(
            "absolute flex items-center gap-10 justify-center left-1/2 -translate-x-1/2 bottom-1/2 transition-all duration-300",
            isOpen && "bottom-10"
        )}>

                <motion.div
                    className="drop-shadow-lg"
                    animate={{
                        scale: isOpen ? [1] : [1,1,0.9, 0.80, 1, 1, 0.95, 1, 1, 1, 1, 1,],
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
                            "items-center justify-center bg-gradient-to-b from-neutral-200 to-neutral-50",
                            "flex size-32 cursor-pointer transition-all duration-500",
                            isOpen && "w-80 md:w-96"
                        )}
                        onClick={handleClick}
                    >
                        <motion.div
                            layout
                            className={cn(
                                "transition-all duration-300 size-16 rounded-4xl border-8 border-gray-950",
                                isOpen && "h-14 w-72 md:w-80 border-gray-900 text-gray-950"
                            )}
                        >
                            <Input
                                ref={inputRef}
                                onClick={(e) => isOpen && e.stopPropagation()}
                                onChange={(e) => setTextInput(e.target.value)}
                                value={textInput}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onEnter()
                                    }
                                    if (e.key === "Backspace") {
                                        handleBackspace()
                                    }
                                }}
                                onBlur={() => setTextInput("")}
                                className={cn(
                                    "bg-transparent h-10 rounded-4xl border-none font-bold",
                                    isOpen ? "w-full block" : "w-0"
                                )}
                            />
                            {/* {isOpen &&
                        <SendHorizontal className="size-6 absolute right-12 top-1/2 -translate-y-1/2 text-gray-950/60" />
                        } */}
                        </motion.div>
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