import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { options, Title } from "./menuOptionsList"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils";

type OptionsProps = {
    textInput: string,
    selectedOptions: Title[],
    onItemSelect: (item: Title) => void;
}

export default function MenuOptions({
    textInput,
    selectedOptions,
    onItemSelect
}: OptionsProps) {
    const [highlightedOptionId, setHighlightedOptionId] = useState<Title | null>(null);

    const lastSelectedOption = selectedOptions.at(-1) || "initial"

    const currentOptions = options[lastSelectedOption]

    useEffect(() => {
        const query = textInput.toLowerCase().trim();
        if (!query) {
            setHighlightedOptionId(null);
            return;
        }
        const startWith = currentOptions.find(option =>
            option.name.toLowerCase().startsWith(query)
        );
        if (startWith) {
            setHighlightedOptionId(startWith.id);
            return;
        }
        const matchedOption = currentOptions.find(option =>
            option.name.toLowerCase().includes(query)
        );

        if (matchedOption) {
            setHighlightedOptionId(matchedOption.id);
            return;
        }
        setHighlightedOptionId(null);
    }, [textInput])


    return (
        <div className="flex flex-col items-center justify-center gap-2 h-1/2 text-xl font-bold">
            <LayoutGroup>
                <AnimatePresence>
                    {currentOptions.map((option) => (
                        <motion.button
                            className={cn(
                                "flex items-center gap-2 justify-center border-2 rounded-xl p-2 cursor-pointer",
                                option.id === highlightedOptionId ? 'border-blue-700 bg-blue-900' : 'border-white'
                            )}
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => onItemSelect(option.id)}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                transition: {
                                    duration: 0.1,
                                    ease: "easeInOut"
                                }
                            }}
                            layout
                            layoutId={`option-${option.id}`}
                            key={option.id}
                            transition={{
                                layout: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                },
                            }}
                        >
                            {option.icon}
                            <h3>{option.name}</h3>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </LayoutGroup>
        </div>
    )
}
