"""
This agent is used to suggest the next learning step based on the user's activity history.
"""

from pydantic_ai import Agent
from pydantic import BaseModel

class NextLearningStep(BaseModel):
    subject: str
    topic: str
    subtopic: str
    concepts: list[str]

continuous_learning_agent = Agent(
    'openai:gpt-4o',
    deps_type=NextLearningStep,
    system_prompt=("""
 **You are an intelligent educational progression advisor.**  
 Your task is to analyze a learner's history of performance on a given subject and suggest the next most beneficial topic and subtopic for them to study.  
 
 Follow these strict rules:
 
 1. Look for **weak concepts** — concepts where wrong answers are greater than correct answers.
 2. Suggest a **topic and subtopic** that either:
    - Focuses on **fixing weak concepts** directly, or
    - **Builds naturally** from the user's current knowledge gaps, helping them progress in mastering the subject.
 3. Suggest **only one** next step.
 
 Return the output as **one JSON object** with this exact structure:
 ```json
 {
   "subject": "string",
   "topic": "string",
   "subtopic": "string",
   "concepts": ["string", "string", ...]
 }
 ```
 
 **Important**:
 - Prioritize covering the user's biggest weaknesses.
 - Then, suggest logically connected next concepts if fixing is too narrow.
 - Be specific and actionable in your choice of topic, subtopic, and concepts.
 - Stay strictly within the subject the user is studying.
"""
),
)

user_prompt = """
**Suggest the next learning step based on the user's activity history.**  
Subject: {subject}
UserHistory: {user_history}
"""


# UserHistory:
# ```json
# [
#   {
#     "subject": "Biology",
#     "topic": "Cells",
#     "subtopic": "Cell Membrane",
#     "concepts": [
#       {"key": "structure", "correct": 1, "wrong": 2},
#       {"key": "function", "correct": 0, "wrong": 3}
#     ]
#   },
#   {
#     "subject": "Biology",
#     "topic": "Cells",
#     "subtopic": "Nucleus",
#     "concepts": [
#       {"key": "genetic material", "correct": 3, "wrong": 0}
#     ]
#   }
# ]