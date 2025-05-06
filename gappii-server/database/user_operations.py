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


def add_subject_to_user(subjectName: str, email: str):
    with get_driver().session() as session:
        records = session.run("""
                           MATCH (u:User {email: $email})
                           MATCH (s:Subject {name: $subjectName})
                           CREATE (u)-[:HAS_SUBJECT]->(s) 
                           RETURN u
                           """, {"email": email, "subjectName": subjectName})

        user = records.value()
        print("user",user)

        return user

def delete_all_users():
    with get_driver().session() as session:
        session.run("MATCH (u:User) DETACH DELETE u")

def delete_user(email: str):
    with get_driver().session() as session:
        session.run("MATCH (u:User {email: $email}) DETACH DELETE u", {"email": email})
        