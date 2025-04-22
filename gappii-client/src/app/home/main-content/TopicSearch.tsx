import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up the timeout to update the debounced value after the specified delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timeout if the value changes before the delay expires
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Mock topic data
const mockTopics = [
    { id: "topic-1", name: "JavaScript Fundamentals", category: "Programming" },
    { id: "topic-2", name: "React Hooks", category: "Frontend" },
    { id: "topic-3", name: "TypeScript Advanced Types", category: "Programming" },
    { id: "topic-4", name: "CSS Grid Layout", category: "Design" },
    { id: "topic-5", name: "Node.js API Design", category: "Backend" },
    { id: "topic-6", name: "GraphQL Queries", category: "Data" },
    { id: "topic-7", name: "State Management", category: "Frontend" },
    { id: "topic-8", name: "Docker Containers", category: "DevOps" },
    { id: "topic-9", name: "Test-Driven Development", category: "Testing" },
    { id: "topic-10", name: "Responsive Web Design", category: "Design" },
    { id: "topic-11", name: "Data Structures", category: "Computer Science" },
    { id: "topic-12", name: "Algorithms", category: "Computer Science" },
]

type TopicSearchProps = {
    textInput: string;
    onSelectTopic: (topicId: string) => void;
}

export default function TopicSearch({ textInput = "", onSelectTopic }: TopicSearchProps) {
    const [filteredTopics, setFilteredTopics] = useState(mockTopics)
    const [highlightedTopicId, setHighlightedTopicId] = useState<string | null>(null)

    // Debounce the text input to avoid excessive filtering
    const debouncedTextInput = useDebounce(textInput, 300);

    // Filter topics based on debounced text input
    useEffect(() => {
        const query = debouncedTextInput.toLowerCase().trim();

        if (!query) {
            setFilteredTopics(mockTopics);
            setHighlightedTopicId(null);
            return;
        }

        // First check for exact matches at the beginning
        const startsWithTopics = mockTopics.filter(topic =>
            topic.name.toLowerCase().startsWith(query) ||
            topic.category.toLowerCase().startsWith(query)
        );

        if (startsWithTopics.length > 0) {
            setFilteredTopics(startsWithTopics);
            setHighlightedTopicId(startsWithTopics[0].id);
            return;
        }

        // Then check for partial matches
        const matchedTopics = mockTopics.filter(topic =>
            topic.name.toLowerCase().includes(query) ||
            topic.category.toLowerCase().includes(query)
        );

        setFilteredTopics(matchedTopics);
        setHighlightedTopicId(matchedTopics.length > 0 ? matchedTopics[0].id : null);
    }, [debouncedTextInput]); // Changed from textInput to debouncedTextInput

    // Enhanced item animation variants with more dynamic effects
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.9,
            rotateX: 15,
            filter: "blur(4px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
        },
        exit: {
            opacity: 0,
            scale: 0.8, // Make exit scale slightly less drastic
            y: 50, // Change exit direction to fall down slightly
            rotateX: -10,
            filter: "blur(2px)",
            transition: {
                duration: 0.3, // Slightly longer exit duration
                ease: "easeOut"
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="topic-search"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="w-full absolute top-0 left-0 h-[calc(100% - 100px)] overflow-hidden"
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >

                <div className="w-screen max-w-2xl mx-auto">
                    <motion.h2
                        className="text-2xl font-bold text-white mb-4 text-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {debouncedTextInput ? (
                            <motion.span
                                key={debouncedTextInput}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                Topics matching <span className="text-blue-300">&quot;{debouncedTextInput}&quot;</span>
                            </motion.span>
                        ) : "Explore Topics"}
                    </motion.h2>

                    {filteredTopics.length === 0 ? (
                        <motion.div
                            key="no-results"
                            className="text-center py-8 text-white/80"
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                            }}
                        >
                            No topics found matching <span className="text-blue-300">&quot;{debouncedTextInput}&quot;</span>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1">
                            <AnimatePresence initial={false} mode="popLayout">
                                {filteredTopics.map((topic, index) => (
                                    <motion.div
                                        layout // Keep layout for positioning
                                        key={topic.id}
                                        variants={itemVariants} // Keep variants on the item itself
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        custom={index}
                                        className="relative hover:z-10"
                                    >
                                        <motion.button
                                            onClick={() => onSelectTopic(topic.id)}
                                            className={cn(
                                                "bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left border-2 transition-colors w-80 md:w-full",
                                                "hover:bg-white/20", // CSS hover for background
                                                topic.id === highlightedTopicId
                                                    ? "border-blue-400 bg-blue-900/30"
                                                    : "border-white/30"
                                            )}
                                            whileHover={{
                                                scale: 1.1, // Apply scale on hover directly to button
                                                transition: { duration: 0.2, ease: "easeOut" }
                                            }}
                                            whileTap={{ scale: 0.97 }}
                                            style={{ transformStyle: "preserve-3d" }} // Apply 3D context
                                        >
                                            <motion.h3
                                                className="text-xl font-bold text-white mb-1"
                                                layout="position"
                                            >
                                                {topic.name}
                                            </motion.h3>
                                            <motion.span
                                                className="text-sm text-blue-300 font-medium px-2 py-1 bg-blue-900/40 rounded-md inline-block"
                                                layout="position"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.05 * index }}
                                            >
                                                {topic.category}
                                            </motion.span>
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
} 