"use client"

import HomePage from "./HomePage"
import { InputContextProvider } from "./InputContext"
import { LessonSessionProvider } from "./LessonSessionContext"
import { RouterProvider } from "./RouterContext"

export default function Home() {
    return (
        <RouterProvider>
            <LessonSessionProvider>
                <InputContextProvider>
                    <HomePage />
                </InputContextProvider>
            </LessonSessionProvider>
        </RouterProvider>
    )
} 