"use client"

import { motion } from "framer-motion"
import { ChatMessage } from "@/app/ChatProvider"

interface UserMessageProps {
  message: ChatMessage
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 ml-auto max-w-[80%]"
    >
      <div className="bg-blue-100 p-3 rounded-lg">
        <p className="text-gray-800">{message.message}</p>
        {message.timestamp && (
          <p className="text-xs text-gray-500 mt-1 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </motion.div>
  )
} 