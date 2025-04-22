"use client"
import TheSquare from "./TheSquare";
import { useState } from "react";
import MainContent from "./main-content/MainContent";
import { options, Title } from "./menuOptionsList";
import useRouting from "./useRouting";
import MenuOptions from "./MenuOptions";
import LogoText from "./LogoText";

export default function HomePage() {
    const [textInput, setTextInput] = useState("")
    const [selectedOptions, setSelectedOptions] = useState<Title[]>(["initial"])
    const [isOpen, setIsOpen] = useState(false)

    useRouting(selectedOptions)

    const handleItemSelect = (item: Title) => {
        setSelectedOptions([...selectedOptions, item])
    }

    const handleEnter = () => {
        const filteredOptions = options[selectedOptions.at(-1) || "initial"]
            .filter((option) => option.name.toLowerCase().includes(textInput.toLowerCase()))
        if (filteredOptions.length > 0) {
            handleItemSelect(filteredOptions[0].id)
            setTextInput("")
        }
    }

    const handleTextInputChange = (newTextInput: string) => {
        setTextInput(newTextInput)
    }

    const handleBackspace = () => {
        if (textInput.length === 0) {
            setSelectedOptions(["initial"])
        }
    }

    const handleCategoryClick = (category: Title) => {
        const selectedIndex = selectedOptions.findIndex((option) => option === category)
        setSelectedOptions(selectedOptions.slice(0, selectedIndex + 1))
    }

    const handleToggleSquare = () => {
        if (isOpen) {
            setSelectedOptions(["initial"])
        }
        setIsOpen(!isOpen)
    }

    // Define approximate height needed for the square when open + some margin

    return (
        // Main container: Full screen, flex column, relative for absolute children, overflow hidden
        <div className="relative flex flex-col h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 pb-44">

            {/* Content Slot: Renders only when isOpen. Takes remaining space, reserves space at bottom for the square */}
            {isOpen && (
                <div 
                    className="flex flex-col flex-1 w-full overflow-y-hidden" 
                >
                    {/* Top Area: Selected options / Topic Search */}
                    <div className="flex-shrink-0 w-full px-4 pt-36">
                        <MainContent
                            textInput={textInput}
                            selectedOptions={selectedOptions}
                            onCategoryClick={handleCategoryClick}
                        />
                    </div>

                    {/* Bottom Area: Menu options, scrollable */}
                    <div className="flex-1 w-full px-4 overflow-y-hidden">
                        <MenuOptions
                            textInput={textInput}
                            selectedOptions={selectedOptions}
                            onItemSelect={handleItemSelect}
                        />
                    </div>
                </div>
            )}

            <TheSquare
                setTextInput={handleTextInputChange}
                handleBackspace={handleBackspace}
                textInput={textInput}
                onEnter={handleEnter}
                isOpen={isOpen}
                setIsOpen={handleToggleSquare} 
            />
            <LogoText isOpen={isOpen} />
        </div>
    )
}