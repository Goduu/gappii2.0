import { ReactNode } from "react"
import { Explore } from "./the-square/explore/Explore"
import { New } from "./the-square/new/New"
import { Change } from "./the-square/change/Change"
import { Continue } from "./the-square/continue/Continue"

export type Option = {
    id: Route,
    name: string,
    component: ReactNode,
    routesOpen: Route[],
}


export const options: Option[] = [
    {
        id: "continue",
        name: "Continue",
        routesOpen: ["add-lesson", "continue"],
        component: <Continue />
    },
    {
        id: "change",
        name: "Change Topic",
        routesOpen: ["change"],
        component: <Change />
    },
    {
        id: "explore",
        name: "Explore",
        routesOpen: ["explore"],
        component: <Explore />
    },
    {
        id: "new",
        name: "New",
        routesOpen: ["new"],
        component: <New />
    }
]

export type Route = "home" | "inSquare" | "continue" | "new" | "add-lesson" | "change" | "explore"

export const titleOptions: Record<Route, string> = {
    "home": "Home",
    "inSquare": "In Square",
    "continue": "Continue",
    "new": "New",
    "add-lesson": "Add Lesson",
    "change": "Change",
    "explore": "Explore",
}