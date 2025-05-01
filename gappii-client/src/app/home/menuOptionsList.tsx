import { Play, Plus, Replace, Telescope } from "lucide-react"
import { ReactNode } from "react"

export type Option = {
    id: MenuOption,
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
        id: "discover",
        name: "Discover",
        icon: <Telescope />
    },
    {
        id: "new",
        name: "New",
        icon: <Plus />
    }
]

export type MenuOption = "continue" | "new" | "change" | "discover"

export const titleOptions: Record<MenuOption, string> = {
    "continue": "Continue",
    "new": "New",
    "change": "Change",
    "discover": "Discover",
}