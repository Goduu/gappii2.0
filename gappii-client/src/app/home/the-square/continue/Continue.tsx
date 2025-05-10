import { useSquareRouter } from "../../RouterContext"
import { Play } from "lucide-react"
import { LearningSession } from "@/components/quiz/LearningSession"
import { PageWrapper } from "../PageWrapper"

export const Continue = () => {
    const { isLessonRoute, router } = useSquareRouter()

    const isAddLessonRoute = router === "add-lesson"

    return (
        <PageWrapper
            icon={<Play />}
            isThisRoute={isLessonRoute}
            showEverything={true}
        >
            <LearningSession
                isAddLessonRoute={isAddLessonRoute}
                initialTime={600}
            />
        </PageWrapper>
    )

}

