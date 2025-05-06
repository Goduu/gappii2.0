from .neo4j_client import get_driver
from pydantic import BaseModel
import pydantic
from typing_extensions import Self
from uuid import UUID, uuid4

class Activity(BaseModel):
    id: UUID
    question: str
    answer: str
    options: list[str]
    topic: str
    subject: str
    
    # validate with pydantic that answer is in options
    @pydantic.model_validator(mode='after')
    def check_answer(self) -> Self:
        if self.answer not in self.options:
            raise ValueError('Answer must be in options')
        return self

def create_activity(activity: Activity) -> Activity:
    with get_driver().session() as session:
        records, = session.run("""
                                MATCH (t:Topic {name: $topic})
                                MATCH (s:Subject {name: $subject})
                                CREATE (a:Activity 
                                {id: $id, question: $question, answer: $answer, options: $options})
                                CREATE (a)-[:BELONGS_TO]->(t)
                                CREATE (a)-[:BELONGS_TO]->(s)
                                RETURN a, t as topic, s as subject
                                """, 
                    {
                        "id": uuid4(), 
                        "question": activity.question,
                        "answer": activity.answer,
                        "options": activity.options,
                        "topic": activity.topic,
                        "subject": activity.subject,
                      })
        return records[0]

def delete_activity(activity: Activity):
    with get_driver().session() as session:
        session.run("MATCH (a:Activity {question: $question}) DETACH DELETE a", {"question": activity.question})

def delete_all_activities():
    with get_driver().session() as session:
        session.run("MATCH (a:Activity) DETACH DELETE a")