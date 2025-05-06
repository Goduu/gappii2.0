import { Play, Plus, Replace, Telescope } from "lucide-react"
import { ReactNode } from "react"
import { Explore } from "./the-square/explore/Explore"
import { New } from "./the-square/new/New"
import { Change } from "./the-square/change/Change"
import { Continue } from "./the-square/continue/Continue"

export type Option = {
    id: Route,
    name: string,
    icon: ReactNode,
}


export const options: Option[] = [
    {
        id: "continue",
        name: "Continue",
        icon: <Continue />
    },
    {
        id: "change",
        name: "Change Topic",
        icon: <Change />
    },
    {
        id: "explore",
        name: "Explore",
        icon: <Explore />
    },
    {
        id: "new",
        name: "New",
        icon: <New />
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