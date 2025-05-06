import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useSquareRouter } from "../RouterContext"
import { useInput } from "../InputContext"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import TypingInput from "./TypingInput"

export default function TheCircle() {
    const { router } = useSquareRouter()
    const isInSquare = router !== "home" && router !== "continue"
    const isInSquareRoute = router === "inSquare"
    const isContinueRoute = router === "continue"

    const { inputValue, setInputValue, inputRef } = useInput()

    return (
        <motion.div
            layout
            transition={{ duration: 1 }}
            className={cn(
                "transition-all duration-300 size-16 rounded-full border-8 opacity-100 flex justify-center items-center",
                isInSquare && "h-14 w-72 md:w-80 border-gray-200 text-gray-200 mx-10 my-20 cursor-auto z-10",
                isContinueRoute && "h-20 w-20 my-[130px] z-10 opacity-0"
            )}
        >
            {isInSquareRoute ?
                <TypingInput />
                :
                <Input
                    ref={inputRef}
                    onClick={(e) => isInSquare && e.stopPropagation()}
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    onBlur={() => setInputValue("")}
                    className={cn(
                        "bg-transparent h-10 rounded-full border-none font-bold",
                        isInSquare ? "w-full block z-10" : "w-0",
                        isContinueRoute && "w-0"
                    )}
                />
            }
        </motion.div>
    )
}