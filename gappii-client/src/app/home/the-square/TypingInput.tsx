import { TypingAnimation } from "@/components/magicui/typing-animation"
import { useEffect, useState } from "react"

export default function TypingInput() {
    const [text, setText] = useState(typingTexts[0])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setText(typingTexts[Math.floor(Math.random() * typingTexts.length)])
        }, 4000)
        return () => clearTimeout(timeout)
    }, [text])

    return (
        <div className="w-80 select-none">
            <TypingAnimation className="text-sm w-80 px-10" duration={3300/text.length}>
                {text}
            </TypingAnimation>
        </div>
    )
}

const typingTexts = [
    "Fill your knowledge gap",
    "Bridge the knowledge divide",
    "Grow through what's unknown",
    "Mastery starts with curiosity",
    "Close gaps, open minds",
    "Learn, adapt, and evolve",
    "Lifelong learning journey",
    "Sharpening your mental toolkit",
    "Curiosity drives deep learning",
    "Learning never truly ends"
]
