import { motion } from "motion/react"
import { Option, Route } from "../menuOptionsList"
import { useMediaQuery } from "usehooks-ts"
import { useSquareRouter } from "../RouterContext"
import { cn } from "@/lib/utils"

type OrbitingItemsProps = {
    item: Option
    index: number
    radius: number
    totalItems: number
    setLastHovered: (lastHovered: Route) => void
    lastHovered: Route
    handleClick: (option: Route) => void
}

export default function OrbitingOption({ item, index, radius, totalItems, setLastHovered, lastHovered, handleClick }: OrbitingItemsProps) {
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const { router, isInSquareRoute } = useSquareRouter()

    return (
        <div
            onClick={() => isDesktop ? handleClick(item.id) : setLastHovered(item.id)}
            className={cn(
                "absolute flex size-14 items-center justify-center rounded-full bg-midnight-900 cursor-pointer",
                lastHovered === item.id && "bg-midnight-800",
                router === item.id && "z-10"
            )}
            style={isInSquareRoute ? calculateItemStyle({
                index,
                radius,
                totalItems,
            }) : {}}
            onMouseEnter={() => setLastHovered(item.id)}
        >
            <motion.div
                className="relative items-center justify-center"
                animate={{
                    rotate: isInSquareRoute ? [0, -360] : 0,
                }}
                transition={{
                    duration: isInSquareRoute ? 45 : 0,
                    ease: "linear",
                    repeat: isInSquareRoute ? Infinity : 0,
                    repeatType: "loop"
                }}
            >
                {item.component}
            </motion.div>
        </div>
    )
}

const calculateItemStyle = ({
    index,
    radius,
    totalItems,
}: {
    radius: number;
    index: number;
    totalItems: number;
}) => {
    const angle = (index / totalItems) * 360;
    const radians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);
    return {
        left: `${50 + x}%`,
        top: `${50 + y}%`,
        transform: "translate(-50%, -50%)",
    };
};