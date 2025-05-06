"use client"
import TheSquare from "./the-square/TheSquare";
import { useState } from "react";

export default function HomePage() {
    const [textInput, setTextInput] = useState("")
    const [selectedOption, setSelectedOption] = useState<string>("")
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative flex flex-col h-screen w-full overflow-hidden pb-44">
            <TheSquare
                setTextInput={setTextInput}
                onSelectOption={setSelectedOption}
                handleBackspace={() => { }}
                textInput={textInput}
                onEnter={() => { }}
                isOpen={isOpen}
                setIsOpen={(isOpen) => setIsOpen(isOpen)}
            />
        </div>
    )
}
