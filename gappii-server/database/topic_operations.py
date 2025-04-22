from .neo4j_client import get_driver

def create_topic(topic: str):
    with get_driver().session() as session:
        records, = session.run("CREATE (t:Topic {name: $topic}) RETURN t", {
                        "topic": topic})

        return records[0]
    