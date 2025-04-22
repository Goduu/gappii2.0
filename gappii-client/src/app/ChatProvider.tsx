"use client";

import { Goals } from "@/components/chat/messages/goals-artifact";
import { Lesson } from "@/components/chat/messages/lesson-artifact";
import { LearningPlan } from "@/components/chat/messages/plan-artifact";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type MessageType = "user" | "system" | "artifact";

export type LessonArtifact = {
  kind: "lesson";
  metadata: Lesson;
}

export type PlanArtifact = {
  kind: "plan";
  metadata: LearningPlan;
}

export type GoalsArtifact = {
  kind: "goals";
  metadata: Goals;
}

export interface ChatMessage {
  id: string;
  message: string;
  type: MessageType;
  timestamp?: Date;
  data?: LessonArtifact | PlanArtifact | GoalsArtifact;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  isToggled: boolean;
  setIsToggled: (toggled: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isToggled, setIsToggled] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        isToggled,
        setIsToggled,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
