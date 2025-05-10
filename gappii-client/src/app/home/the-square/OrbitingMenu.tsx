import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { Route, options } from "../menuOptionsList";
import { capitalize } from "lodash";
import { useSquareRouter } from "../RouterContext";
import OrbitingOption from "./OrbitingOption";
import { useInput } from "../InputContext";
import { useMediaQuery } from "usehooks-ts";

interface OrbitingItemsProps {
    radius: number;
    pauseOnHover?: boolean;
    backgroundClassName?: string;
    containerClassName?: string;
    className?: string;
}

export default function OrbitingMenu({
    radius = 50,
    pauseOnHover,
    backgroundClassName,
    containerClassName,
    className,
}: OrbitingItemsProps) {
    const [lastHovered, setLastHovered] = useState<Route>("continue");
    const { setRouter, isInSquareRoute } = useSquareRouter()
    const { focusInput } = useInput()

    const isDesktop = useMediaQuery("(min-width: 1024px)")

    const handleClick = () => {
        setRouter(lastHovered)
        if (lastHovered === "new") {
            console.log("focusing")
            setTimeout(() => {
                focusInput()
            }, 50)
        }
    }

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
                        rotate: isInSquareRoute ? [0, 360] : 0,
                    }}
                    transition={{
                        duration: isInSquareRoute ? 45 : 0,
                        ease: "linear",
                        repeat: isInSquareRoute ? Infinity : 0,
                        repeatType: "loop"
                    }}
                    className={cn(
                        "relative flex h-64 w-64 items-center justify-center",
                        pauseOnHover && "group-hover:[animation-play-state:paused]",
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
                                handleClick={handleClick}
                            />
                        );
                    })}
                    {isInSquareRoute &&
                        < motion.div
                            animate={{
                                scale: isDesktop ? 1 : [1, 1.05, 1, 1, 1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3.5,
                                ease: "linear",
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                            className={cn(
                                "absolute cursor-pointer h-1/2 w-1/2 rounded-full",
                                "border-8 border-gray-200 bg-gradient-to-b from-midnight-900 to-midnight-950",
                                "group-hover:border-8 group-hover:border-gray-200",
                                "flex items-center justify-center"
                            )}
                            onClick={handleClick}
                        >
                            <div className="flex items-center justify-center ">
                                <motion.div
                                    animate={{
                                        rotate: isInSquareRoute ? [0, -360] : 0,
                                    }}
                                    transition={{
                                        duration: isInSquareRoute ? 45 : 0,
                                        ease: "linear",
                                        repeat: isInSquareRoute ? Infinity : 0,
                                        repeatType: "loop"
                                    }}
                                    className={cn(
                                        "text-white font-black text-xl flex items-center justify-center select-none",
                                        !isInSquareRoute && "opacity-0",

                                    )}
                                >
                                    {capitalize(lastHovered)}
                                </motion.div>
                            </div>
                        </motion.div>
                    }
                </motion.div>
            </div >
        </motion.div >
    );
}
