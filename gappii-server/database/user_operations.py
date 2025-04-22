#!/usr/bin/env python3
import os
import sys
import time
from neomodel import config, db
from .migration import setup_connection
from .neo4j_client import get_driver


def create_user(email: str, password: str):
    with get_driver().session() as session:
        records, = session.run("CREATE (u:User {email: $email, password: $password}) RETURN u", {
                           "email": email, "password": password})
        user = records[0]
        return user


def add_topic_to_user(topicId: str, userId: str):
    with get_driver().session() as session:
        records = session.run("""
                           MATCH (u:User)
                           MATCH (t:Topic)
                           WHERE u.id = $id AND t.id = $topicId
                           CREATE (u)-[:HAS_TOPIC]->(t) 
                           RETURN u
                           """, {"id": userId, "topicId": topicId})

        user = records.value()
        print("user",user)

        return user
