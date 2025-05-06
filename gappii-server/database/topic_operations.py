from .neo4j_client import get_driver
from uuid import UUID
def create_topic(topic: str):
    with get_driver().session() as session:
        records, = session.run("CREATE (t:Topic {name: $topic}) RETURN t", {
                        "topic": topic})

        return records[0]
    
def add_topic_to_topic(topicName: str, parentTopicName: str):
    with get_driver().session() as session:
        session.run("""
                    MATCH (t:Topic {name: $topicName})
                    MATCH (p:Topic {name: $parentTopicName})
                    CREATE (p)-[:HAS_TOPIC]->(t)
                    """, {"topicName": topicName, "parentTopicName": parentTopicName})
        
def add_activity_to_topic(activityId: UUID, topicName: str):
    with get_driver().session() as session:
        session.run("""
                    MATCH (t:Topic {name: $topicName})
                    MATCH (a:Activity {id: $activityId})
                    CREATE (t)-[:HAS_ACTIVITY]->(a)
                    """, {"topicName": topicName, "activityId": activityId})
    
def delete_all_topics():
    with get_driver().session() as session:
        session.run("MATCH (t:Topic) DETACH DELETE t")

def delete_topic(topic: str):
    with get_driver().session() as session:
        session.run("MATCH (t:Topic {name: $topic}) DETACH DELETE t", {
                        "topic": topic})
