import { ShineBorder } from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BookOpen, Sparkles, Rocket } from "lucide-react";
import { motion } from "framer-motion";

interface SubjectDetailsCardProps {
    subject: string;
    topics: string[];
    likes: number;
}

export function SubjectDetailsCard({ subject, topics, likes }: SubjectDetailsCardProps) {
    return (
        <Card className="relative m-0 bg-gradient-to-b from-midnight-900 to-midnight-800 text-white overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <div className="absolute top-0 right-0 p-4 flex items-center gap-2 text-pink-400">
                <Rocket className="w-5 h-5" />
                <span className="text-sm font-medium">{likes}</span>
            </div>
            
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {subject}
                    </CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                    Explore these fascinating topics
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {topics.map((topic, index) => (
                        <motion.div
                            key={topic}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            <div className="p-3 rounded-lg bg-midnight-800/50 border border-midnight-700 hover:border-purple-500/50 transition-all duration-300">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm font-medium text-gray-200">{topic}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>

            <CardFooter>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                    Start Learning
                </Button>
            </CardFooter>
        </Card>
    );
}