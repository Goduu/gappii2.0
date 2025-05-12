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
        id: "session/continue",
        name: "Continue",
        routesOpen: ["session/new-subject", "session/continue"],
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

export type Route = "home" | "inSquare" | "session/continue" | "new" | "session/new-subject" | "change" | "explore"

export const titleOptions: Record<Route, string> = {
    "home": "Home",
    "inSquare": "In Square",
    "session/continue": "Continue",
    "new": "New",
    "session/new-subject": "New Subject",
    "change": "Change",
    "explore": "Explore",
}