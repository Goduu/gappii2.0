"use client"

import { Book } from "lucide-react"

export interface Lesson {
  topic: string
  subtopic: string
  activities: {
    question: string
    answer: string
  }[]
}

export interface LessonArtifactProps {
  lesson: Lesson
}

export function LessonArtifact({ lesson }: LessonArtifactProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Book size={16} className="text-blue-600" />
        <h3 className="font-medium text-blue-800">Lesson</h3>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="font-semibold text-gray-700">Topic:</span>
          <span className="ml-2 text-gray-800">{lesson.topic}</span>
        </div>
        
        <div>
          <span className="font-semibold text-gray-700">Subtopic:</span>
          <span className="ml-2 text-gray-800">{lesson.subtopic}</span>
        </div>
        
        <div>
          <span className="font-semibold text-gray-700">Activities:</span>
          <span className="ml-2 text-gray-800">{lesson.activities.length} activities</span>
        </div>
      </div>
    </div>
  )
} 