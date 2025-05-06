"use client"

import HomePage from "./HomePage"
import { InputContextProvider } from "./InputContext"
import { RouterProvider } from "./RouterContext"

export default function Home() {
    return (
        <RouterProvider>
            <InputContextProvider>
                <HomePage />
            </InputContextProvider>
        </RouterProvider>
    )
} 