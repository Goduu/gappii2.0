"use client"

import HomePage from "./HomePage"
import { RouterProvider } from "./RouterContext"

export default function Home() {
    return (
        <RouterProvider>
            <HomePage />
        </RouterProvider>
    )
} 