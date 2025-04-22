import { ListCheck, StepForward } from "lucide-react"
import { ReactNode } from "react"

export type Option = {
    id: Title,
    name: string,
    icon: ReactNode,
}

export const options: Record<Title, Option[]> = {
    "initial": [
        {
            id: "learn",
            name: "Learn",
            icon: <StepForward />
        },
    ],
    "learn": [
        {
            id: "resume-last-session",
            name: "Resume Last Session",
            icon: <StepForward />
        },
        {
            id: "change-topic",
            name: "Change Topic",
            icon: <ListCheck />
        },
    ],
    "something-new": [],
    "change-topic": [],
    "resume-last-session": [],
}

export type Title = "initial" | "learn" | "something-new" | "change-topic" | "resume-last-session"

export const titleOptions: Record<Title, string> = {
    "initial": "Gappii",
    "learn": "Continue Learning",
    "something-new": "Describe what you want to learn",
    "change-topic": "Search for a topic",
    "resume-last-session": "Resume Last Session",
}