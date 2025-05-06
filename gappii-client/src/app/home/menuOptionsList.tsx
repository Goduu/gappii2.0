import { Play, Plus, Replace, Telescope } from "lucide-react"
import { ReactNode } from "react"
import { Explore } from "./the-square/explore/Explore"

export type Option = {
    id: Route,
    name: string,
    icon: ReactNode,
}


export const options: Option[] = [
    {
        id: "continue",
        name: "Continue",
        icon: <Play />
    },
    {
        id: "change",
        name: "Change Topic",
        icon: <Replace />
    },
    {
        id: "explore",
        name: "Explore",
        icon: <Explore />
    },
    {
        id: "new",
        name: "New",
        icon: <Plus />
    }
]

export type Route = "home" | "inSquare" | "continue" | "new" | "change" | "explore"

export const titleOptions: Record<Route, string> = {
    "home": "Home",
    "inSquare": "In Square",
    "continue": "Continue",
    "new": "New",
    "change": "Change",
    "explore": "Explore",
}