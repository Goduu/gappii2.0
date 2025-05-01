"use client"
import TheSquare from "./the-square/TheSquare";
import { useState } from "react";
import { Title } from "./menuOptionsList";
import useRouting from "./useRouting";

export default function HomePage() {
    const [textInput, setTextInput] = useState("")
    const [selectedOption, setSelectedOption] = useState<string>("")
    const [isOpen, setIsOpen] = useState(false)

    const { handleRouteClick } = useRouting(selectedOption)


    // Define approximate height needed for the square when open + some margin

    return (
        // Main container: Full screen, flex column, relative for absolute children, overflow hidden
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
