"use client"

import { Target } from "lucide-react"

export interface Goal {
  title: string
  description: string
}

export interface Goals {
  subject: string
  goals: Goal[]
  tasks: {
    id: string
    title: string
    completed: boolean
  }[]
}

export interface GoalsArtifactProps {
  goals: Goals
}

export function GoalsArtifact({ goals }: GoalsArtifactProps) {
  // Get first 2 goals for preview
  const goalsPreview = goals.goals.slice(0, 2).map(goal => goal.title).join(", ")
  const hasMoreGoals = goals.goals.length > 2
  
  return (
    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Target size={16} className="text-purple-600" />
        <h3 className="font-medium text-purple-800">Learning Goals</h3>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="font-semibold text-gray-700">Subject:</span>
          <span className="ml-2 text-gray-800">{goals.subject}</span>
        </div>
        
        <div>
          <span className="font-semibold text-gray-700">Goals:</span>
          <p className="text-gray-800">
            {goalsPreview}{hasMoreGoals ? "..." : ""}
          </p>
        </div>
      </div>
    </div>
  )
} 