import { useSquareRouter } from "../../RouterContext"
import { ChangeSubjects } from "./ChangeSubjects"
import { Replace } from "lucide-react"
import { PageWrapper } from "../PageWrapper"

export const Change = () => {
    const { router } = useSquareRouter()

    const isChangeRoute = router === "change"

    return (
        <PageWrapper
            icon={<Replace />}
            isThisRoute={isChangeRoute}
            showEverything={true}
        >
            <ChangeSubjects />
        </PageWrapper>
    )
}

