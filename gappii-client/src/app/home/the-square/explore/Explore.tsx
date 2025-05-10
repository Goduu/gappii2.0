import { TelescopeIcon } from "@/components/ui/telescope"
import { AnimatePresence } from "framer-motion"
import { useSquareRouter } from "../../RouterContext"
import { ExploreSubjects } from "./ExploreSubjects"
import { TextAnimate } from "@/components/magicui/text-animate"
import { PageWrapper } from "../PageWrapper"


export const Explore = () => {
    const { router } = useSquareRouter()

    const isExploreRoute = router === "explore"

    return (
        <PageWrapper
            icon={<TelescopeIcon />}
            isThisRoute={isExploreRoute}
            showEverything={true}
        >
            <>
                <div className="flex flex-col gap-2 items-center justify-center">
                    <TextAnimate animation="slideLeft" by="character" className="text-xl md:text-3xl font-black w-80 md:w-fit" duration={0.7} delay={0.4}>
                        Explore
                    </TextAnimate>
                    <TextAnimate animation="slideLeft" by="character" className="text-xl md:text-3xl font-black w-80 md:w-fit" duration={0.7} delay={0.4}>
                        what the community is learning
                    </TextAnimate>
                </div>
                <AnimatePresence>
                    <ExploreSubjects />
                </AnimatePresence>
            </>
        </PageWrapper>
    )
}
