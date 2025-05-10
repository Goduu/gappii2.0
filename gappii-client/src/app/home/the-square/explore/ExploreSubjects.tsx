import { AnimatePresence, motion } from "framer-motion"
import { useInput } from "../../InputContext"
import { SubjectDialog } from "../subject/SubjectDialog"
import { cn } from "@/lib/utils"

export const ExploreSubjects = () => {
    const { inputValue } = useInput()

    const filteredSubjects = exampleSubjects.filter(item =>
        inputValue.length === 0 ||
        item.subject.toLowerCase().includes(inputValue.toLowerCase())
        || item.topics.some(topic => topic.toLowerCase().includes(inputValue.toLowerCase())))

    // Animation configuration
    const listAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const itemAnimation = {
        initial: { scale: 0.96, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.96, opacity: 0 },
        transition: { type: "spring", stiffness: 300, damping: 30 }
    };

    return (
        <motion.ul
            layout
            className={cn(
                "grid auto-cols-auto gap-2 auto-rows-auto items-center justify-center",
                "w-[90vw] md:w-[65vw] lg:w-[70vw] md:px-20 h-80 overflow-y-auto p-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={listAnimation}
        >
            <AnimatePresence initial={false} mode="popLayout">
                {filteredSubjects.map((item, index) => (
                    <motion.li
                        key={item.subject}
                        layout
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={itemAnimation}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                        <SubjectDialog subject={item.subject} topics={item.topics} index={index} />
                    </motion.li>
                ))}
            </AnimatePresence>
        </motion.ul>
    )
}


const exampleSubjects = [
    {
        subject: "Typescript",
        topics: ["Functions", "Typing", "Libraries",]
    },
    {
        subject: "Circuits",
        topics: ["Ohm Law", "Resistance", "Tension", "Current", "Generators"]
    },
    {
        subject: "React",
        topics: ["Components", "Props", "State", "Hooks", "Context"]
    },
    {
        subject: "Philosophy",
        topics: ["Existentialism", "Stoicism", "Nihilism", "Existentialism", "Stoicism", "Nihilism"]
    },
    {
        subject: "Math",
        topics: ["Algebra", "Geometry", "Calculus", "Algebra", "Geometry", "Calculus"]
    },
    {
        subject: "Music from Bach for Piano",
        topics: ["Allegro", "Andante", "Presto", "Allegro", "Andante", "Presto"]
    },
    {
        subject: "Religion",
        topics: ["Christianity", "Islam", "Buddhism", "Hinduism", "Judaism", "Christianity", "Islam", "Buddhism", "Hinduism", "Judaism"]
    },
    {
        subject: "History",
        topics: ["World War II", "World War I", "Ancient History", "Medieval History", "Modern History"]
    },
    {
        subject: "Art",
        topics: ["Painting", "Sculpture", "Architecture", "Painting", "Sculpture", "Architecture"]
    },
    {
        subject: "Physics",
        topics: ["Quantum Mechanics", "Relativity", "Quantum Mechanics", "Relativity", "Quantum Mechanics", "Relativity"]
    },
    {
        subject: "Chemistry",
        topics: ["Molecules", "H2O", "Chemical Reactions", "Chemical Interactions", "Chemical Bonds"]
    },
    {
        subject: "Biology",
        topics: ["Cellular Biology", "Genetics", "Molecular Biology", "Evolution", "Biochemistry"]
    }
]
