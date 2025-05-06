import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { Route, options } from "../menuOptionsList";
import { capitalize } from "lodash";
import { useSquareRouter } from "../RouterContext";
import OrbitingOption from "./OrbitingOption";

interface OrbitingItemsProps {
    /**
     * The radius of the circle in percentage, relative to the container.
     */
    radius: number;

    /**
     * Pause the animation when the parent element is hovered.
     */
    pauseOnHover?: boolean;

    /**
     * Class name for the background element.
     */
    backgroundClassName?: string;

    /**
     * Class name for the container element.
     */
    containerClassName?: string;

    /**
     * Additional classes for the item container.
     */
    className?: string;

    /**
     * The function to call when an item is selected.
     */
    onOptionHover: (option: Route) => void;
}

export default function OrbitingMenu({
    radius = 50,
    pauseOnHover,
    backgroundClassName,
    containerClassName,
    className,
}: OrbitingItemsProps) {
    const [lastHovered, setLastHovered] = useState<Route>("continue");
    const { router, setRouter } = useSquareRouter()

    const isInSquare = router === "inSquare"

    return (
        <motion.div
            layout
            animate={{
                opacity: [0, 1],
                scale: [0, 1]
            }}
            exit={{
                opacity: [1, 0],
                scale: [1, 0]
            }}
            transition={{
                duration: 0.5,
                ease: "linear",
            }}
            className="absolute bottom-0 left-0 w-full h-full"
        >
            <div
                className={cn(
                    "storybook-fix group flex items-center justify-center py-56",
                    containerClassName,
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 h-full w-full items-center ",
                        backgroundClassName,
                    )}
                />
                <motion.div
                    animate={{
                        rotate: isInSquare ? [0, 360] : 0,
                    }}
                    transition={{
                        duration: isInSquare ? 45 : 0,
                        ease: "linear",
                        repeat: isInSquare ? Infinity : 0,
                        repeatType: "loop"
                    }}
                    className={cn(
                        "relative flex h-64 w-64 items-center justify-center",
                        {
                            "group-hover:[animation-play-state:paused]": pauseOnHover,
                        },
                        className,
                    )}
                >
                    <div className="absolute h-full w-full rounded-full border-2 border-gray-500" />
                    {options.map((item, index) => {
                        return (
                            <OrbitingOption
                                key={item.id}
                                index={index}
                                item={item}
                                lastHovered={lastHovered}
                                setLastHovered={setLastHovered}
                                totalItems={options.length}
                                radius={radius}
                            />
                        );
                    })}

                    <div className={cn(
                        "absolute cursor-pointer h-1/2 w-1/2 rounded-full",
                        "border-8 border-gray-200 bg-gradient-to-b from-midnight-900 to-midnight-950",
                        "group-hover:border-8 group-hover:border-gray-200",
                        "flex items-center justify-center"
                    )}
                        onClick={() => setRouter(lastHovered)}
                    >
                        <div className="flex items-center justify-center ">
                            <motion.div
                                animate={{
                                    rotate: isInSquare ? [0, -360] : 0,
                                }}
                                transition={{
                                    duration: isInSquare ? 45 : 0,
                                    ease: "linear",
                                    repeat: isInSquare ? Infinity : 0,
                                    repeatType: "loop"
                                }}
                                className="text-white font-black text-xl flex items-center justify-center"
                            >
                                {capitalize(lastHovered)}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
