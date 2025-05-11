import { useRouterChange, useSquareRouter } from "../../RouterContext"
import { Play } from "lucide-react"
import { LearningSession } from "@/components/quiz/LearningSession"
import { PageWrapper } from "../PageWrapper"
import { useState } from "react"
import { Introduction } from "./Introduction"

export const Continue = () => {
    const { isLessonRoute, router } = useSquareRouter()
    const isAddLessonRoute = router === "add-lesson"
    const [playIntro, setPlayIntro] = useState(true)

    useRouterChange((newRoute, oldRoute) => {
        if (oldRoute === "continue" || oldRoute === "add-lesson") {
            setPlayIntro(true)
        }
    });

    return (
        <PageWrapper
            icon={<Play />}
            isThisRoute={isLessonRoute}
            showEverything={true}
        >
            {playIntro ?
                <Introduction
                    onIntroductionComplete={() => setPlayIntro(false)}
                />
                :
                <LearningSession
                    isAddLessonRoute={isAddLessonRoute}
                    initialTime={600}
                />
            }
        </PageWrapper>
    )

}

