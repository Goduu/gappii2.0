"use client"

import { ArtifactMessage } from "./artifact-message"
import { mockChatMessages } from "./artifact-mocks"

export function ArtifactDemo() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Artifact Message Types</h1>
      
      <div className="space-y-8">
        {mockChatMessages.map((message) => (
          <div key={message.id}>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {message.data ? `${message.data.kind.charAt(0).toUpperCase()}${message.data.kind.slice(1)} Artifact` : 'Artifact'}
            </h2>
            <ArtifactMessage message={message} />
          </div>
        ))}
      </div>
    </div>
  )
} 