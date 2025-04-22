import { motion } from "framer-motion";

import { AnimatePresence } from "framer-motion";
import { Title, titleOptions } from "../menuOptionsList";

type SelectedOptionsProps = {
    selectedOptions: Title[],
    onCategoryClick: (category: Title) => void,
}

export default function SelectedOptions({ selectedOptions, onCategoryClick }: SelectedOptionsProps) {

    return (
        <AnimatePresence mode="wait">
            {selectedOptions.map((option, index) => {
                // Calculate scale and opacity based on position in the array
                // Last item has full opacity and scale, earlier items progressively decrease
                const itemsCount = selectedOptions.length;
                const isLastItem = index === itemsCount - 1;

                // Calculate scale: earlier items are smaller, last is 1
                const scale = isLastItem ? 1 : 0.8 - (itemsCount - index - 1) * 0.15;

                // Calculate opacity: earlier items are more transparent, last is 1
                const opacity = isLastItem ? 1 : 0.7 - (itemsCount - index - 1) * 0.2;

                return (
                    <motion.button
                        className="bg-white rounded-xl text-slate-800 text-2xl font-bold p-2"
                        variants={dropletVariants}
                        initial="initial"
                        animate={{
                            ...dropletVariants.animate,
                            scale,
                            opacity: Math.max(0.3, opacity), // Ensure opacity doesn't go below 0.3
                            zIndex: index, // Stack items with proper z-index
                        }}
                        exit="exit"
                        key={option}
                        onClick={() => onCategoryClick(option)}
                        style={{
                            position: "relative", // Position items relative to each other
                            marginTop: index > 0 ? "-0.5rem" : 0, // Create slight overlap between items
                        }}
                    >
                        {titleOptions[option]}
                    </motion.button>
                );
            })}
        </AnimatePresence>
    )
}

const dropletVariants = {
    initial: {
        opacity: 0,
        y: 200,
        scale: 0.1,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4
        },
        ease: "easeInOut"
    },
    exit: {
        opacity: 0,
        scale: 0.01,
        y: -200,
        transition: {
            duration: 0.3
        }
    }
}