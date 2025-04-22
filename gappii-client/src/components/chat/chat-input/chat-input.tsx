"use client"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { ChatMenu } from "./chat-menu"
import { Command } from "cmdk"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "framer-motion"
import { useChatContext } from "@/app/ChatProvider"
import { mockChatMessages } from "../messages/artifact-mocks"
import { v4 as uuidv4 } from "uuid"
interface CommandMenuProps {
    setIsToggled?: (toggled: boolean) => void;
    isToggled?: boolean;
}

export function CommandMenu({ setIsToggled, isToggled = false }: CommandMenuProps) {
    const [open, setOpen] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const { addMessage } = useChatContext()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleOpenChange(!open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open])

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen) {
            setIsTransitioning(true)
            setOpen(true)
            setTimeout(() => {
                setIsTransitioning(false)
            }, 50)
        } else {
            setOpen(false)
            setIsTransitioning(false)
        }
    }

    const handleMenuSelect = () => {
        if (setIsToggled) {
            setIsToggled(true)
        }
        setOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputValue.trim()) {
            addMessage({
                id: uuidv4(),
                message: inputValue,
                type: "user",
                timestamp: new Date()
            })
            // Simulate a response after a short delay
            setTimeout(() => {
                addMessage({
                    id: uuidv4(),
                    message: `Response to: ${inputValue}`,
                    type: "system",
                    timestamp: new Date()
                })
            }, 1000)
            setInputValue("")
        }
    }

    return (
        <div className={cn("w-full", isToggled && "min-w-[300px]")}>
            <form onSubmit={handleSubmit}>
                <Command 
                    className={cn(
                        "border rounded-lg w-full transition-all duration-300 opacity-100",
                        open && "opacity-0"
                    )}
                    onClick={() => !isToggled && handleOpenChange(true)}
                >
                    <CommandInput 
                        placeholder={isToggled ? "Type a message..." : "Type a command or search..."} 
                        className="border-none" 
                        value={inputValue}
                        onValueChange={setInputValue}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                addMessage({
                                    id: uuidv4(),
                                    message: inputValue,
                                    type: "user",
                                    timestamp: new Date()
                                })
                                setInputValue("")
                            } else if (e.key === "+") {
                                addMessage({
                                    id: uuidv4(),
                                    message: inputValue,
                                    type: "system",
                                    timestamp: new Date()
                                })
                                setInputValue("")
                            } else if (e.key === "-") {
                                const randomArtifact = mockChatMessages[Math.floor(Math.random() * mockChatMessages.length)]
                                addMessage(randomArtifact)
                                setInputValue("")
                            }
                        }}
                    />
                </Command>
            </form>

            <AnimatePresence>
                {!isToggled && (
                    <div className={cn(
                        "transition-all duration-700",
                        isTransitioning && "opacity-0"
                    )}>
                        <CommandDialog 
                            open={open} 
                            onOpenChange={handleOpenChange}
                        >
                            <ChatMenu onSelect={handleMenuSelect} />
                            <CommandSeparator />
                            <CommandInput placeholder="Type a command or search..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup heading="Suggestions">
                                    <CommandItem>Calendar</CommandItem>
                                    <CommandItem>Search Emoji</CommandItem>
                                    <CommandItem>Calculator</CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </CommandDialog>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
