import { useRouterChange, useSquareRouter } from "../../RouterContext"
import { Plus } from "lucide-react"
import { TextAnimate } from "@/components/magicui/text-animate"
import { PageWrapper } from "../PageWrapper"

export const New = () => {
    const { isNewRoute } = useSquareRouter()

    return (
        <PageWrapper
            icon={<Plus />}
            isThisRoute={isNewRoute}
            showEverything={true}
        >
            <TextAnimate animation="slideLeft" by="character" className="text-2xl md:text-3xl font-black" duration={0.7} delay={0.4}>
                What do you want to learn?
            </TextAnimate>
        </PageWrapper>
    )
}