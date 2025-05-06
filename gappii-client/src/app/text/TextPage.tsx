"use client"

import SwapCard from "./SwapCard"
import ContentScanner from "./SwapCard"

type TextPageProps = {
    text: string
}

export default function TextPage({ text }: TextPageProps) {
    // Container ref to control scrolling

    return (
        <div className="h-screen flex flex-col items-center justify-center text-3xl">
            <SwapCard
            />
        </div>
    )
}
