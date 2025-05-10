import { CornerLeftUp } from "lucide-react"
import { useSquareRouter } from "./RouterContext"
import { Route } from "./menuOptionsList"
import { cn } from "@/lib/utils"

type BackStripeProps = {
    routesToHide: string[],
    route: Route,
}
export default function BackStripe({ routesToHide, route }: BackStripeProps) {
    const { router, setRouter } = useSquareRouter()

    if (routesToHide.includes(router)) {
        return
    }

    return (
        <div
            className="absolute h-10 w-full bottom-0 cursor-pointer group flex justify-center items-center"
            onClick={() => setRouter(route)}>
            <div className={cn(
                "group-hover:opacity-80 group-hover:animate-pulse transition-all duration-300",
                "opacity-40 md:opacity-0 animate-pulse md:animate-none"
            )}>
                <CornerLeftUp />
            </div>
        </div>
    )
}