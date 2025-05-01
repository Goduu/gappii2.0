import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MenuOption, options } from "../menuOptionsList";
import { capitalize } from "lodash";

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
    onOptionHover: (option: MenuOption) => void;
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

export default function OrbitingMenu({
    radius = 50,
    pauseOnHover,
    backgroundClassName,
    containerClassName,
    onOptionHover,
    className,
}: OrbitingItemsProps) {
    const [lastHovered, setLastHovered] = useState<MenuOption>("continue");

    return (
        <AnimatePresence>
            <motion.div
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                transition={{
                    duration: 2.5,
                    ease: "easeInOut"
                }}
                className="absolute bottom-0 left-0 w-full h-full">

                <div
                    className={cn(
                        "storybook-fix group flex items-center justify-center py-32",
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
                            rotate: 360,
                        }}
                        transition={{
                            duration: 45,
                            ease: "linear",
                            repeat: Infinity,
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
                                <div
                                    key={index}
                                    onClick={() => onOptionHover(item.id)}
                                    className={cn("absolute flex size-14 items-center justify-center rounded-full bg-midnight-900 cursor-pointer",
                                        {
                                            "bg-midnight-800": lastHovered === item.id,
                                        }
                                    )}
                                    style={calculateItemStyle({
                                        index,
                                        radius,
                                        totalItems: options.length,
                                    })}
                                    onMouseEnter={() => setLastHovered(item.id)}
                                >
                                    <motion.div
                                        animate={{
                                            rotate: -360,
                                        }}
                                        transition={{
                                            duration: 45,
                                            ease: "linear",
                                            repeat: Infinity,
                                        }}
                                    >
                                        {item.icon}
                                    </motion.div>
                                </div>
                            );
                        })}

                        <div className={cn("absolute cursor-pointer h-1/2 w-1/2 rounded-full",
                            "border-8 border-gray-200 bg-gradient-to-b from-midnight-900 to-midnight-950",
                            "group-hover:border-8 group-hover:border-gray-200",
                            "flex items-center justify-center"
                        )}
                            onClick={() => onOptionHover(lastHovered)}
                        >
                            <div className="flex items-center justify-center ">
                                <motion.div
                                    animate={{
                                        rotate: -360,
                                    }}
                                    transition={{
                                        duration: 45,
                                        ease: "linear",
                                        repeat: Infinity,
                                    }}
                                    className="text-white font-black text-xl flex items-center justify-center"
                                >
                                    {capitalize(lastHovered)}
                                </motion.div>
                            </div>
                        </div>

                    </motion.div >
                </div >
            </motion.div>
        </AnimatePresence>

    );
}
