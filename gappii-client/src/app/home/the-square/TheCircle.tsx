import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

type TheCircleProps = {
    inputRef: React.RefObject<HTMLInputElement | null>
    isOpen: boolean
    setTextInput: (newTextInput: string) => void
    textInput: string
    onEnter: () => void
    handleBackspace: () => void
}
export default function TheCircle({
    inputRef,
    isOpen,
    setTextInput,
    textInput,
    onEnter,
    handleBackspace }: TheCircleProps) {
    return (
        <motion.div
            layout
            className={cn(
                "transition-all duration-300 size-16 rounded-4xl border-8 border-gray-200",
                isOpen && "h-14 w-72 md:w-80 border-gray-200 text-gray-200 m-10 cursor-auto z-10"
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
                    isOpen ? "w-full block z-10" : "w-0"
                )}
            />
            {/* {isOpen &&
        <SendHorizontal className="size-6 absolute right-12 top-1/2 -translate-y-1/2 text-gray-950/60" />
        } */}
        </motion.div>
    )
}