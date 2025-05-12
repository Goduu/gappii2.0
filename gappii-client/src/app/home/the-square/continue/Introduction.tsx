import { TextAnimate } from "@/components/magicui/text-animate"
import { AnimatePresence } from "framer-motion"
import { useEffect } from "react"

type SessionIntroductionProps = {
    onIntroductionComplete: () => void
}
export const SessionIntroduction = ({ onIntroductionComplete }: SessionIntroductionProps) => {

    useEffect(() => {
        const timeout = setTimeout(() => {
            onIntroductionComplete()
        }, 3200)
        return () => clearTimeout(timeout)
    }, [onIntroductionComplete])

    return (
        <AnimatePresence>
            <TextAnimate
                animation="slideLeft"
                by="character"
                className="text-2xl md:text-3xl font-black"
                duration={0.7}
            >
                Let&apos;s understand better what you want to learn
            </TextAnimate>
        </AnimatePresence>
    )
}