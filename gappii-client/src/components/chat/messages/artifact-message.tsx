"use client"

import { motion } from "framer-motion"
import { ChatMessage } from "@/app/ChatProvider"
import { FileCode, ExternalLink } from "lucide-react"
import { LessonArtifact } from "./lesson-artifact"
import { PlanArtifact } from "./plan-artifact"
import { GoalsArtifact } from "./goals-artifact"

export function ArtifactMessage({ message }: { message: ChatMessage }) {
  const renderArtifactContent = () => {
    if (!message.data) {
      return (
        <div className="bg-amber-100 rounded p-2 text-sm font-mono text-gray-800 overflow-x-auto">
          <code>No artifact data available</code>
        </div>
      )
    }

    switch (message.data.kind) {
      case "lesson":
        return <LessonArtifact lesson={message.data.metadata} />
      case "plan":
        return <PlanArtifact plan={message.data.metadata} />
      case "goals":
        return <GoalsArtifact goals={message.data.metadata} />
      default:
        return (
          <div className="bg-amber-100 rounded p-2 text-sm font-mono text-gray-800 overflow-x-auto">
            <code>Unknown artifact type</code>
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 max-w-[80%] flex gap-2"
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mt-1">
        <FileCode size={14} className="text-amber-600" />
      </div>
      <div>
        <div className="flex justify-between items-start mb-2">
          <p className="text-gray-800">{message.message}</p>
          <button className="text-amber-600 hover:text-amber-800 p-1">
            <ExternalLink size={16} />
          </button>
        </div>
        
        {renderArtifactContent()}
        
        {message.timestamp && (
          <p className="text-xs text-gray-500 mt-2">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </motion.div>
  )
}