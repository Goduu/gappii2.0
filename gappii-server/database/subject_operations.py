from .neo4j_client import get_driver


def create_subject(subject: str):
    with get_driver().session() as session:
        records, = session.run("CREATE (s:Subject {name: $subject}) RETURN s", {
            "subject": subject})

        return records[0]


def add_topic_to_subject(topicName: str, subjectName: str):
    with get_driver().session() as session:
        session.run("""
                    MATCH (s:Subject {name: $subjectName}) 
                    MATCH (t:Topic {name: $topicName}) 
                    CREATE (s)-[:HAS_TOPIC]->(t)
                    """, {"subjectName": subjectName, "topicName": topicName})


def delete_all_subjects():
    with get_driver().session() as session:
        session.run("MATCH (s:Subject) DETACH DELETE s")


def delete_subject(subject: str):
    with get_driver().session() as session:
        session.run("MATCH (s:Subject {name: $subject}) DETACH DELETE s", {
            "subject": subject})

