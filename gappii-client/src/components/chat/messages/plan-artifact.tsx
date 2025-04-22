"use client"

import { LayoutList } from "lucide-react"

export interface LearningPlan {
  subject: string
  description: string
  topics: string[] 
}

export interface PlanArtifactProps {
  plan: LearningPlan
}

export function PlanArtifact({ plan }: PlanArtifactProps) {
  // Get a preview of the description (first 50 characters)
  const descriptionPreview = plan.description.length > 50 
    ? `${plan.description.substring(0, 50)}...` 
    : plan.description

  return (
    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <LayoutList size={16} className="text-green-600" />
        <h3 className="font-medium text-green-800">Learning Plan</h3>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="font-semibold text-gray-700">Subject:</span>
          <span className="ml-2 text-gray-800">{plan.subject}</span>
        </div>
        
        <div>
          <span className="font-semibold text-gray-700">Plan:</span>
          <p className="text-gray-800">{descriptionPreview}</p>
        </div>
      </div>
    </div>
  )
} 