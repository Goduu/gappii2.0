"use client"

import { motion } from "framer-motion"
import { ChatMessage } from "@/app/ChatProvider"
import { Bot } from "lucide-react"

interface SystemMessageProps {
  message: ChatMessage
}

export function SystemMessage({ message }: SystemMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 max-w-[80%] flex gap-2"
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
        <Bot size={14} className="text-indigo-600" />
      </div>
      <div className="bg-gray-100 p-3 rounded-lg">
        <p className="text-gray-800">{message.message}</p>
        {message.timestamp && (
          <p className="text-xs text-gray-500 mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </motion.div>
  )
} 

