import { BorderBeam } from "@/components/magicui/border-beam"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export const ExploreSubjects = () => {
    return (
        <div className="flex items-center justify-center gap-4 w-96 flex-wrap">
            {exampleSubjects.map((item, index) => (
                <motion.div key={item.subject}
                    className="w-40"
                    animate={{
                        opacity: [0, 1],
                        y: [-430, 0],
                        x: [200, 0]
                    }}
                    exit={{
                        opacity: [1, 0],
                        y: [0, -330],
                        x: [0, 175]
                    }}
                    transition={{
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: "easeInOut",
                    }}>
                    <Card
                        className="relative bg-inherit text-white max-w-40 border-teal-800 cursor-pointer"
                    >
                        <CardContent>
                            <div className="text-sm font-black">
                                {item.subject}
                            </div>
                            <div className="text-xs flex gap-1 truncate text-ellipsis">
                                {item.topics.join(", ")}
                            </div>
                        </CardContent>
                        <BorderBeam delay={index * 0.5} />
                    </Card>
                </motion.div>
            ))
            }
        </div>
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
    }
]