"use client"

import { ChatMessage, LessonArtifact as LessonArtifactType, PlanArtifact as PlanArtifactType, GoalsArtifact as GoalsArtifactType } from "@/app/ChatProvider"
import { Lesson } from "./lesson-artifact"
import { LearningPlan } from "./plan-artifact"
import { Goals } from "./goals-artifact"

// Creating the lesson data
const lessonData: Lesson = {
  topic: "Mathematics",
  subtopic: "Algebra Fundamentals",
  activities: [
    {
      question: "What is a variable in algebra?",
      answer: "A variable is a symbol (usually a letter) that represents an unknown number."
    },
    {
      question: "How do you solve the equation 2x + 3 = 7?",
      answer: "Subtract 3 from both sides: 2x = 4. Then divide both sides by 2: x = 2."
    },
    {
      question: "What is the quadratic formula?",
      answer: "x = (-b ± √(b² - 4ac)) / 2a, where ax² + bx + c = 0"
    }
  ]
}

// Creating the plan data
const planData: LearningPlan = {
  subject: "Computer Science",
  description: "This learning plan covers the fundamentals of computer programming, starting with basic concepts and progressing to more advanced topics. We'll begin with variables and control structures, then move on to functions, data structures, and object-oriented programming.",
  topics: ["Programming Basics", "Data Structures", "Algorithms", "Object-Oriented Programming"]
}

// Creating the goals data
const goalsData: Goals = {
  subject: "English Literature",
  goals: [
    {
      title: "Analyze Shakespearean sonnets",
      description: "Be able to identify key themes and literary devices in Shakespeare's sonnets"
    },
    {
      title: "Write a critical essay",
      description: "Compose a well-structured critical essay analyzing a literary work"
    },
    {
      title: "Develop close reading skills",
      description: "Develop the ability to perform close readings of complex texts"
    }
  ],
  tasks: [
    {
      id: "task-1",
      title: "Read Sonnet 18",
      completed: true
    },
    {
      id: "task-2",
      title: "Identify literary devices in Sonnet 29",
      completed: false
    },
    {
      id: "task-3",
      title: "Write 500-word analysis of Romeo and Juliet's use of metaphor",
      completed: false
    }
  ]
}

// Example of how to use these mocks in ChatMessages
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    message: "Here's a lesson on algebra fundamentals",
    type: "artifact",
    data: {
      kind: "lesson",
      metadata: lessonData
    } as LessonArtifactType
  },
  {
    id: "msg-2",
    message: "I've created a learning plan for your computer science studies",
    type: "artifact",
    data: {
      kind: "plan",
      metadata: planData
    } as PlanArtifactType
  },
  {
    id: "msg-3",
    message: "Here are your English literature learning goals",
    type: "artifact",
    data: {
      kind: "goals",
      metadata: goalsData
    } as GoalsArtifactType
  }
] 