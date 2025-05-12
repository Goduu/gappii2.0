"use client"

import { DebugBox } from "@/components/debug/DebugBox"
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
                    {process.env.NODE_ENV === 'development' && (
                        <DebugBox />
                    )}
                </InputContextProvider>
            </LessonSessionProvider>
        </RouterProvider>
    )
} 