"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CommandMenu } from "./chat-input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useChatContext, ChatMessage } from "@/app/ChatProvider"
import { useEffect } from "react"
import { UserMessage } from "../messages/user-message"
import { SystemMessage } from "../messages/system-message"
import { ArtifactMessage } from "../messages/artifact-message"

export function StateAnimations() {
    const { messages, addMessage, isToggled, setIsToggled } = useChatContext();

    // Simulate some initial messages for testing
    useEffect(() => {
        if (messages.length === 0) {
            addMessage({
                id: "1",
                type: "system",
                message: "Hello! How can I help you today?",
                timestamp: new Date()
            });
        }
    }, [messages.length, addMessage]);

    const renderMessage = (msg: ChatMessage) => {
        switch (msg.type) {
            case "user":
                return <UserMessage key={msg.id} message={msg} />;
            case "system":
                return <SystemMessage key={msg.id} message={msg} />;
            case "artifact":
                return <ArtifactMessage key={msg.id} message={msg} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-full w-full">
            <AnimatePresence>
                {!isToggled ? (
                    <motion.div
                        className="absolute h-full w-full flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="border relative w-fit bg-white"
                            animate={{
                                width: "fit-content",
                                height: "96px"
                            }}
                            transition={{
                                damping: 15
                            }}
                        >
                            <motion.div className="p-2">
                                <CommandMenu setIsToggled={setIsToggled} isToggled={isToggled} />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="h-full w-full"
                        >
                            <ResizablePanel defaultSize={25} minSize={20}>
                                <div className="flex h-full flex-col">
                                    <div className="flex-1 overflow-y-auto p-4">
                                        {messages.map(renderMessage)}
                                    </div>
                                    <motion.div
                                        className="p-4 border-t"
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.3,
                                            damping: 15
                                        }}
                                    >
                                        <CommandMenu
                                            setIsToggled={setIsToggled}
                                            isToggled={isToggled}
                                        />
                                    </motion.div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={75}>
                                <div className="flex h-full items-center justify-center p-6">
                                    <span className="font-semibold">Canvas Content</span>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setIsToggled(!isToggled)}
                className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded z-50"
            >
                Toggle
            </button>
        </div>
    )
}
