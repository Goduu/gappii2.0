import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useSquareRouter } from "../RouterContext"
import { useInput } from "../InputContext"
import TypingInput from "./TypingInput"

export default function TheCircle() {
    const { router, isInSquareRoute, isLessonRoute } = useSquareRouter()
    const isInSquare = router !== "home"

    const { inputValue, setInputValue, inputRef, submit } = useInput()

    return (
        <motion.div
            layout
            className={cn(
                "transition-all duration-300 size-16 rounded-full border-8 opacity-100 flex justify-center items-center",
                isInSquare && !isLessonRoute && "h-14 w-72 md:w-80 border-gray-200 text-gray-200 mx-10 my-20 cursor-auto z-10",
                isLessonRoute && "h-0 w-0 my-[130px] z-10 opacity-0"
            )}
        >
            {isInSquareRoute ?
                <TypingInput />
                :
                isLessonRoute ?
                    <></>
                    :
                    <Input
                        ref={inputRef}
                        onClick={(e) => isInSquare && e.stopPropagation()}
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                        onBlur={() => setInputValue("")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                submit({ userPrompt: inputValue })
                            }
                        }}
                        className={cn(
                            "bg-transparent h-10 rounded-full border-none font-bold",
                            isInSquare ? "w-full block z-10" : "w-0",
                            isLessonRoute && "w-0"
                        )}
                    />
            }
        </motion.div>
    )
}