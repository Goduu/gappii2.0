import { useRouterChange, useSquareRouter } from "../../RouterContext"
import { Play } from "lucide-react"
import { LearningSession } from "@/components/lesson-session/LearningSession"
import { PageWrapper } from "../PageWrapper"
import { useState } from "react"
import { SessionIntroduction } from "./Introduction"
import { NewSubjectSession } from "@/components/new-subject-session/NewSubjectSession"

export const Continue = () => {
    const { isLessonRoute, router } = useSquareRouter()
    const isAddLessonRoute = router === "session/new-subject"
    const [playIntro, setPlayIntro] = useState(true)

    useRouterChange((newRoute, oldRoute) => {
        if (oldRoute.includes("session")) {
            setPlayIntro(true)
        }
    });
    console.log('rerendered')

    return (
        <PageWrapper
            icon={<Play />}
            isThisRoute={isLessonRoute}
            showEverything={true}
        >
            {playIntro ?
                <SessionIntroduction
                    onIntroductionComplete={() => setPlayIntro(false)}
                />
                :
                isAddLessonRoute ?
                    <NewSubjectSession />
                    :
                    <LearningSession
                        isAddLessonRoute={isAddLessonRoute}
                        initialTime={600}
                    />
            }
        </PageWrapper>
    )

}

