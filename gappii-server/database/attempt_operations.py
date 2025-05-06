from uuid import UUID
from .neo4j_client import get_driver
from datetime import datetime

def create_attempt(activityId: UUID, user_email: str, timestamp: datetime, correct: bool):
    with get_driver().session() as session:
        session.run("""
                    MATCH (a:Activity {id: $activityId})
                    MATCH (u:User {email: $user_email})
                    CREATE (u)-[:ATTEMPTED {timestamp: $timestamp, correct: $correct}]->(a)
                    """, {"activityId": activityId, "user_email": user_email, "timestamp": timestamp, "correct": correct})
