import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useSquareRouter } from "../RouterContext"

type TheCircleProps = {
    inputRef: React.RefObject<HTMLInputElement | null>
    setTextInput: (newTextInput: string) => void
    textInput: string
    onEnter: () => void
    handleBackspace: () => void
}
export default function TheCircle({
    inputRef,
    setTextInput,
    textInput,
    onEnter,
    handleBackspace }: TheCircleProps) {
    const { router } = useSquareRouter()
    const isInSquare = router !== "home"

    return (
        <motion.div
            layout
            className={cn(
                "transition-all duration-300 size-16 rounded-4xl border-8 border-gray-200",
                isInSquare && "h-14 w-72 md:w-80 border-gray-200 text-gray-200 mx-10 my-20 cursor-auto z-10"
            )}
        >
            <Input
                ref={inputRef}
                onClick={(e) => isInSquare && e.stopPropagation()}
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
                    isInSquare ? "w-full block z-10" : "w-0"
                )}
            />
        </motion.div>
    )
}