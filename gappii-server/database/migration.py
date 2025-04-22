#!/usr/bin/env python3
import os
import sys
import time
from neomodel import config, db, clear_neo4j_database
from datetime import datetime, timedelta
import argparse

def check_neo4j_version():
    """Check Neo4j version and return compatibility information"""
    try:
        query = "CALL dbms.components() YIELD name, versions, edition RETURN name, versions, edition"
        result, _ = db.cypher_query(query)
        version_info = {}
        
        for row in result:
            if row[0] == 'Neo4j Kernel':
                version_info['name'] = row[0]
                version_info['version'] = row[1][0] if row[1] else 'Unknown'
                version_info['edition'] = row[2]
                print(f"Neo4j version: {version_info['version']}, Edition: {version_info['edition']}")
                
                # Parse version
                version_parts = version_info['version'].split('.')
                major = int(version_parts[0]) if len(version_parts) > 0 and version_parts[0].isdigit() else 0
                
                # Set compatibility flags
                version_info['supports_show_indexes'] = major >= 4
                version_info['supports_fulltext_indexes'] = major >= 3 and int(version_parts[1]) >= 5 if len(version_parts) > 1 and version_parts[1].isdigit() else False
                
                return version_info
        
        print("Could not determine Neo4j version, assuming latest features available.")
        return {'version': 'Unknown', 'edition': 'Unknown', 'supports_show_indexes': True, 'supports_fulltext_indexes': True}
    except Exception as e:
        print(f"Error checking Neo4j version: {e}")
        print("Assuming basic Neo4j compatibility.")
        return {'version': 'Unknown', 'edition': 'Unknown', 'supports_show_indexes': False, 'supports_fulltext_indexes': False}

def setup_connection():
    """Set up the Neo4j connection using neomodel"""
    uri = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
    username = os.environ.get("NEO4J_USERNAME", "neo4j")
    password = os.environ.get("NEO4J_PASSWORD", "TxkDIMw0VulE7O")
    print(f"Connecting to Neo4j at {uri} with username {username} and password {password}")
    
    # Set up the connection
    connection_url = f"bolt://{username}:{password}@{uri.replace('bolt://', '')}"
    config.DATABASE_URL = connection_url
    
    # Test connection
    try:
        result, _ = db.cypher_query("MATCH (n) RETURN count(n) AS count")
        node_count = result[0][0]
        print(f"Connection successful. Database contains {node_count} nodes.")
        
        # Check Neo4j version
        version_info = check_neo4j_version()
        
        return True
    except Exception as e:
        print(f"Error connecting to Neo4j: {e}")
        return False

def apply_migration(migration_script=None, interactive=False):
    """Apply a Neo4j migration script using neomodel
    
    Args:
        migration_script (str): Cypher script to run
        interactive (bool): Whether to prompt for input on errors
    """
    if not migration_script:
        print("No migration script provided")
        return False
    
    print("Setting up Neo4j connection...")
    if not setup_connection():
        return False
    
    # Apply migration in chunks to avoid potential issues with large scripts
    statements = split_migration_script(migration_script)
    
    print(f"Applying migration with {len(statements)} statements...")
    start_time = time.time()
    
    # Run each statement and track progress
    success_count = 0
    error_count = 0
    for i, statement in enumerate(statements, 1):
        if not statement.strip():
            continue
            
        try:
            print(f"Executing statement {i}/{len(statements)}...")
            db.cypher_query(statement)
            success_count += 1
        except Exception as e:
            error_code = None
            error_message = str(e)
            
            # Check for specific Neo4j error codes that might be acceptable to continue
            if 'Neo.ClientError.Schema.EquivalentSchemaRuleAlreadyExists' in error_message:
                print(f"Warning: Index or constraint already exists, continuing: {error_message}")
                success_count += 1
                continue
            elif 'Neo.ClientError.Schema.IndexAlreadyExists' in error_message:
                print(f"Warning: Index already exists, skipping: {error_message}")
                success_count += 1
                continue
            
            print(f"Error executing statement {i}: {e}")
            print(f"Statement: {statement[:100]}...")
            error_count += 1
            
            if interactive:
                # Ask user if they want to continue despite the error
                response = input("Continue with migration despite error? (y/n): ")
                if response.lower() != 'y':
                    return False
            
    end_time = time.time()
    print(f"Migration completed with {success_count}/{len(statements)} successful statements in {end_time - start_time:.2f} seconds.")
    print(f"Errors: {error_count}")
    
    if error_count > 0:
        print("Warning: Migration completed with errors. Check logs for details.")
    
    # Verify the migration
    verify_migration()
    
    return error_count == 0

def split_migration_script(script):
    """Split a migration script into individual statements
    
    Args:
        script (str): The complete migration script
        
    Returns:
        list: List of individual Cypher statements
    """
    # Split on semicolon, but keep statements that are part of a string intact
    statements = []
    current_statement = ""
    
    lines = script.split('\n')
    for line in lines:
        stripped_line = line.strip()
        
        # Skip empty lines and comments
        if not stripped_line or stripped_line.startswith('//'):
            continue
            
        current_statement += line + "\n"
        
        # Check for statement end (;)
        if stripped_line.endswith(';'):
            statements.append(current_statement)
            current_statement = ""
    
    # Add any remaining statement
    if current_statement.strip():
        statements.append(current_statement)
    
    return statements

def verify_migration():
    """Run verification queries to validate the migration"""
    print("\nVerifying migration:")
    
    # Check node counts
    try:
        nodes_query = """
        MATCH (n)
        RETURN labels(n) AS type, count(n) AS count
        """
        result, _ = db.cypher_query(nodes_query)
        print("\nNode counts:")
        for row in result:
            print(f"  {row[0]}: {row[1]}")
    except Exception as e:
        print(f"Error checking node counts: {e}")
    
    # Check relationship counts
    try:
        rel_query = """
        MATCH ()-[r]->()
        RETURN type(r) AS type, count(r) AS count
        """
        result, _ = db.cypher_query(rel_query)
        print("\nRelationship counts:")
        for row in result:
            print(f"  {row[0]}: {row[1]}")
    except Exception as e:
        print(f"Error checking relationship counts: {e}")
    
    # Check indexes and constraints
    print("\nIndexes and constraints:")
    try:
        # Try Neo4j 4.x+ syntax first
        indexes_query = "SHOW INDEXES"
        result, _ = db.cypher_query(indexes_query)
        for row in result:
            if len(row) >= 2:  # Format varies by Neo4j version
                print(f"  {row[0]} - {row[1]}")
            else:
                print(f"  {row}")
    except Exception as e:
        print(f"  Error checking indexes with SHOW INDEXES: {e}")
        try:
            # Try Neo4j 3.x syntax
            indexes_query = "CALL db.indexes()"
            result, _ = db.cypher_query(indexes_query)
            for row in result:
                if isinstance(row, (list, tuple)) and len(row) >= 2:
                    print(f"  {row[0]} - {row[1]}")
                else:
                    print(f"  {row}")
        except Exception as e2:
            print(f"  Error checking indexes with db.indexes(): {e2}")
            try:
                # Last resort for older versions
                constraints_query = "CALL db.constraints()"
                result, _ = db.cypher_query(constraints_query)
                print("  Constraints:")
                for row in result:
                    print(f"    {row}")
            except Exception as e3:
                print(f"  Could not retrieve index or constraint information: {e3}")
    
    # Check mastery levels
    print("\nSample mastery levels:")
    try:
        mastery_query = """
        MATCH (u:User)-[m:HAS_MASTERY]->(t:Topic)
        RETURN u.name, t.name, m.weight AS mastery_level
        ORDER BY u.name, mastery_level DESC
        LIMIT 5
        """
        result, _ = db.cypher_query(mastery_query)
        for row in result:
            print(f"  {row[0]} - {row[1]}: {row[2]:.2f}")
    except Exception as e:
        print(f"Error checking mastery levels: {e}")

def main(interactive=True, skip_drop=False):
    """Main function to run the migration"""
    # Connect to Neo4j and check version
    print("Setting up Neo4j connection...")
    if not setup_connection():
        print("Failed to connect to Neo4j. Aborting migration.")
        sys.exit(1)
    
    # Try to get version information
    try:
        version_info = check_neo4j_version()
    except:
        version_info = {
            'version': 'Unknown',
            'supports_show_indexes': False, 
            'supports_fulltext_indexes': False
        }
    
    if not skip_drop:
        # First drop any existing indexes and constraints
        # This makes the migration idempotent (can be run multiple times)
        try:
            # These specific drops target the problematic indexes
            print("Dropping specific indexes that might conflict with constraints...")
            db.cypher_query("DROP INDEX ON :User(id) IF EXISTS")
            db.cypher_query("DROP INDEX ON :Topic(id) IF EXISTS")
            db.cypher_query("DROP INDEX ON :Activity(id) IF EXISTS")
            print("Dropped specific indexes")
        except Exception as e:
            print(f"Error dropping specific indexes: {e}")
            
        drop_script = """
        // Drop all existing constraints and indexes to avoid conflicts
        CALL apoc.schema.assert({}, {}); 
        """
        
        # If APOC is not available, try alternative approaches
        try:
            db.cypher_query(drop_script)
            print("Dropped existing indexes and constraints using APOC")
        except Exception as e:
            print(f"APOC not available or error dropping schema: {e}")
            print("Attempting to drop indexes and constraints manually...")
            
            try:
                # Try to get all constraints and indexes
                if version_info.get('supports_show_indexes', False):
                    # Neo4j 4.x+
                    drop_constraints = "SHOW CONSTRAINTS YIELD name WITH name CALL db.constraintDrop(name) RETURN count(*)"
                    drop_indexes = "SHOW INDEXES YIELD name WITH name CALL db.indexDrop(name) RETURN count(*)"
                else:
                    # Neo4j 3.x
                    drop_constraints = "CALL db.constraints() YIELD description WITH description CALL db.dropConstraint(description) RETURN count(*)"
                    drop_indexes = "CALL db.indexes() YIELD description WITH description CALL db.dropIndex(description) RETURN count(*)"
                
                try:
                    db.cypher_query(drop_constraints)
                    print("Dropped existing constraints")
                except Exception as e1:
                    print(f"Error dropping constraints: {e1}")
                    
                try:
                    db.cypher_query(drop_indexes)
                    print("Dropped existing indexes")
                except Exception as e2:
                    print(f"Error dropping indexes: {e2}")
                    
            except Exception as e3:
                print(f"Error dropping schema: {e3}")
                print("You may need to drop indexes and constraints manually before running the migration.")
    else:
        print("Skipping index and constraint drop as requested")
    
    # Base migration script
    migration = """
    // Clear existing data (use carefully in production)
MATCH (n) DETACH DELETE n;
// Create User node with unique email constraint
CREATE CONSTRAINT user_email_unique IF NOT EXISTS
FOR (u:User)
REQUIRE u.email IS UNIQUE;
// Create Subject node
CREATE CONSTRAINT subject_title_unique IF NOT EXISTS
FOR (s:Subject)
REQUIRE s.title IS UNIQUE;
// Create Topic node
CREATE CONSTRAINT topic_title_unique IF NOT EXISTS
FOR (t:Topic)
REQUIRE t.title IS UNIQUE;
// Create Activity node
CREATE CONSTRAINT activity_description_unique IF NOT EXISTS
FOR (a:Activity)
REQUIRE a.description IS UNIQUE;
// Relationships:
// User -[:HAS_SUBJECT]-> Subject
// Subject -[:HAS_TOPIC]-> Topic
// Activity -[:RELATED_TO]-> Topic
// User -[:ATTEMPTED {correct: boolean, timestamp: datetime}]-> Activity

// Create Topics
CREATE (t0:Topic {title: 'Algebra'});
WITH t0
CREATE (t1:Topic {title: 'Geometry'});
WITH t1
CREATE (t2:Topic {title: 'Calculus'});
WITH t2
CREATE (t3:Topic {title: 'Photosynthesis'});
WITH t3
CREATE (t4:Topic {title: 'Electricity'});
WITH t4
CREATE (t5:Topic {title: 'World War II'});
WITH t5
CREATE (t6:Topic {title: 'Renaissance'});
WITH t6
CREATE (t7:Topic {title: 'Shakespeare'});
WITH t7
CREATE (t8:Topic {title: 'Algorithms'});
WITH t8
CREATE (t9:Topic {title: 'Data Structures'});
WITH t9
CREATE (t10:Topic {title: 'Thermodynamics'});
WITH t10
CREATE (t11:Topic {title: 'Quantum Physics'});
WITH t11
CREATE (t12:Topic {title: 'Grammar'});
WITH t12
CREATE (t13:Topic {title: 'Biology'});
WITH t13
CREATE (t14:Topic {title: 'Cybersecurity'});
WITH t14
// Create Subjects and relate to Topics
CREATE (s0:Subject {title: 'Mathematics'})
WITH s0
MERGE (s0)-[:HAS_TOPIC]->(t6)
MERGE (s0)-[:HAS_TOPIC]->(t5)
MERGE (s0)-[:HAS_TOPIC]->(t14);

CREATE (s1:Subject {title: 'Science'})
WITH s1
MERGE (s1)-[:HAS_TOPIC]->(t1)
MERGE (s1)-[:HAS_TOPIC]->(t2)
MERGE (s1)-[:HAS_TOPIC]->(t5);

CREATE (s2:Subject {title: 'History'})
WITH s2
MERGE (s2)-[:HAS_TOPIC]->(t11)
MERGE (s2)-[:HAS_TOPIC]->(t14)
MERGE (s2)-[:HAS_TOPIC]->(t6);

CREATE (s3:Subject {title: 'Literature'})
WITH s3
MERGE (s3)-[:HAS_TOPIC]->(t2)
MERGE (s3)-[:HAS_TOPIC]->(t5)
MERGE (s3)-[:HAS_TOPIC]->(t11);

CREATE (s4:Subject {title: 'Computer Science'})
WITH s4
MERGE (s4)-[:HAS_TOPIC]->(t13)
MERGE (s4)-[:HAS_TOPIC]->(t5)
MERGE (s4)-[:HAS_TOPIC]->(t9);

// Create Activities and relate to Topics
CREATE (a0:Activity {description: 'Activity 1', options: ['A', 'B', 'C', 'D'], answer: 'B'})
WITH a0
MERGE (a0)-[:RELATED_TO]->(t8)
MERGE (a0)-[:RELATED_TO]->(t3);

CREATE (a1:Activity {description: 'Activity 2', options: ['A', 'B', 'C', 'D'], answer: 'D'})
WITH a1
MERGE (a1)-[:RELATED_TO]->(t11)
MERGE (a1)-[:RELATED_TO]->(t4);

// Continue for all other Activities, following the same pattern:

CREATE (a2:Activity {description: 'Activity 3', options: ['A', 'B', 'C', 'D'], answer: 'C'})
WITH a2
MERGE (a2)-[:RELATED_TO]->(t2)
MERGE (a2)-[:RELATED_TO]->(t14);

CREATE (a3:Activity {description: 'Activity 4', options: ['A', 'B', 'C', 'D'], answer: 'C'})
WITH a3
MERGE (a3)-[:RELATED_TO]->(t2)
MERGE (a3)-[:RELATED_TO]->(t6);

// ... (repeat for remaining activities)

// Create Users and Assign Subjects
CREATE (u0:User {email: 'user0@example.com', password: 'hashed_password_0'})
WITH u0
MERGE (u0)-[:HAS_SUBJECT]->(s0)
MERGE (u0)-[:HAS_SUBJECT]->(s1)
MERGE (u0)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-03-05T10:00:00')}]->(a0)
MERGE (u0)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-03-05T10:15:00')}]->(a1)
MERGE (u0)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-03-05T10:30:00')}]->(a2);

CREATE (u1:User {email: 'user1@example.com', password: 'hashed_password_1'})
WITH u1
MERGE (u1)-[:HAS_SUBJECT]->(s2)
MERGE (u1)-[:HAS_SUBJECT]->(s3)
MERGE (u1)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-02-15T08:00:00')}]->(a3)
MERGE (u1)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-02-15T08:30:00')}]->(a4)
MERGE (u1)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-02-15T09:00:00')}]->(a5);

CREATE (u2:User {email: 'user2@example.com', password: 'hashed_password_2'})
WITH u2
MERGE (u2)-[:HAS_SUBJECT]->(s4)
MERGE (u2)-[:HAS_SUBJECT]->(s1)
MERGE (u2)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-01-10T14:00:00')}]->(a6)
MERGE (u2)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-01-10T14:30:00')}]->(a7)
MERGE (u2)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-01-10T15:00:00')}]->(a8);

CREATE (u3:User {email: 'user3@example.com', password: 'hashed_password_3'})
WITH u3
MERGE (u3)-[:HAS_SUBJECT]->(s0)
MERGE (u3)-[:HAS_SUBJECT]->(s4)
MERGE (u3)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-05-01T12:00:00')}]->(a9)
MERGE (u3)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-05-01T12:30:00')}]->(a10)
MERGE (u3)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-05-01T13:00:00')}]->(a11);

CREATE (u4:User {email: 'user4@example.com', password: 'hashed_password_4'})
WITH u4
MERGE (u4)-[:HAS_SUBJECT]->(s2)
MERGE (u4)-[:HAS_SUBJECT]->(s1)
MERGE (u4)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-04-20T15:00:00')}]->(a12)
MERGE (u4)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-04-20T15:30:00')}]->(a13)
MERGE (u4)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-04-20T16:00:00')}]->(a14);

CREATE (u5:User {email: 'user5@example.com', password: 'hashed_password_5'})
WITH u5
MERGE (u5)-[:HAS_SUBJECT]->(s3)
MERGE (u5)-[:HAS_SUBJECT]->(s4)
MERGE (u5)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-03-15T18:00:00')}]->(a15)
MERGE (u5)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-03-15T18:30:00')}]->(a16)
MERGE (u5)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-03-15T19:00:00')}]->(a17);

CREATE (u6:User {email: 'user6@example.com', password: 'hashed_password_6'})
WITH u6
MERGE (u6)-[:HAS_SUBJECT]->(s0)
MERGE (u6)-[:HAS_SUBJECT]->(s1)
MERGE (u6)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-01-25T09:00:00')}]->(a18)
MERGE (u6)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-01-25T09:30:00')}]->(a19)
MERGE (u6)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-01-25T10:00:00')}]->(a20);

CREATE (u7:User {email: 'user7@example.com', password: 'hashed_password_7'})
WITH u7
MERGE (u7)-[:HAS_SUBJECT]->(s2)
MERGE (u7)-[:HAS_SUBJECT]->(s3)
MERGE (u7)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-04-12T14:00:00')}]->(a0)
MERGE (u7)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-04-12T14:30:00')}]->(a1)
MERGE (u7)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-04-12T15:00:00')}]->(a2);

CREATE (u8:User {email: 'user8@example.com', password: 'hashed_password_8'})
WITH u8
MERGE (u8)-[:HAS_SUBJECT]->(s4)
MERGE (u8)-[:HAS_SUBJECT]->(s0)
MERGE (u8)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-02-10T11:00:00')}]->(a3)
MERGE (u8)-[:ATTEMPTED {correct: 'true', timestamp: datetime('2024-02-10T11:30:00')}]->(a4)
MERGE (u8)-[:ATTEMPTED {correct: 'false', timestamp: datetime('2024-02-10T12:00:00')}]->(a5);

    """
    
    # Add constraints first (they automatically create indexes)
    constraints_script = """
    // Create constraints (these automatically create indexes)
    CREATE CONSTRAINT FOR (u:User) REQUIRE u.email IS UNIQUE;
    CREATE CONSTRAINT FOR (u:User) REQUIRE u.id IS UNIQUE;
    CREATE CONSTRAINT FOR (t:Topic) REQUIRE t.id IS UNIQUE;
    CREATE CONSTRAINT FOR (a:Activity) REQUIRE a.id IS UNIQUE;
    CREATE CONSTRAINT FOR ()-[r:ATTEMPTED]-() REQUIRE r.timestamp IS NOT NULL;
    """
    
    # Adapt constraint syntax for older Neo4j versions
    if version_info.get('version', '').startswith('3'):
        constraints_script = """
        // Create constraints (these automatically create indexes)
        CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE;
        CREATE CONSTRAINT ON (u:User) ASSERT u.id IS UNIQUE;
        CREATE CONSTRAINT ON (t:Topic) ASSERT t.id IS UNIQUE;
        CREATE CONSTRAINT ON (a:Activity) ASSERT a.id IS UNIQUE;
        """
        # Note: relationship property constraints not supported in Neo4j 3.x
    
    migration += constraints_script
    
    # Add indexes (only for properties not already indexed by constraints)
    migration += """
    // Create additional indexes (only for properties not already indexed by constraints)
    CREATE INDEX FOR (t:Topic) ON (t.weight);
    CREATE INDEX FOR (s:Subject) ON (s.id);
    """
    
    # Adapt index syntax for older Neo4j versions
    if version_info.get('version', '').startswith('3'):
        migration = migration.replace("CREATE INDEX FOR (t:Topic) ON (t.weight);", 
                                      "CREATE INDEX ON :Topic(weight);")
        migration = migration.replace("CREATE INDEX FOR (s:Subject) ON (s.id);", 
                                      "CREATE INDEX ON :Subject(id);")
    
    # Add fulltext index if supported
    if version_info.get('supports_fulltext_indexes', False):
        migration += """
        // Create fulltext index
        CREATE FULLTEXT INDEX activitySearch FOR (a:Activity) ON EACH [a.description];
        """
    
    # Apply the migration
    success = apply_migration(migration, interactive=interactive)
    
    if success:
        print("Migration completed successfully!")
        sys.exit(0)
    else:
        print("Migration failed.")
        sys.exit(1)

# Alternative approach using neomodel's OGM features
def create_models_and_apply_migration():
    """
    An alternative approach that defines models and relationships using neomodel's OGM.
    This shows how you could structure data for a more typical neomodel application.
    """
    from neomodel import (StructuredNode, StringProperty, FloatProperty, IntegerProperty,
                         DateTimeProperty, RelationshipTo, RelationshipFrom, DateProperty,
                         BooleanProperty, StructuredRel, One, ZeroOrMore)
    
    # Relationship classes
    class RequiresRel(StructuredRel):
        pass
    
    class BelongsToRel(StructuredRel):
        pass
    
    class TestsRel(StructuredRel):
        pass
    
    class AttemptedRel(StructuredRel):
        timestamp = DateTimeProperty(required=True)
        correct = BooleanProperty(default=False)
        duration = IntegerProperty()
        score = FloatProperty()
    
    class MasteryRel(StructuredRel):
        weight = FloatProperty(required=True)
        last_updated = DateTimeProperty(default=datetime.now)
    
    # Node classes
    class Subject(StructuredNode):
        id = StringProperty(unique_index=True, required=True)
        name = StringProperty(required=True)
        description = StringProperty()
        created_at = DateTimeProperty(default=datetime.now)

    class Topic(StructuredNode):
        id = StringProperty(unique_index=True, required=True)
        name = StringProperty(required=True)
        description = StringProperty()
        weight = FloatProperty(index=True)
        
        # Relationships
        belongs_to = RelationshipTo('Subject', 'BELONGS_TO', model=BelongsToRel)
        requires = RelationshipTo('Topic', 'REQUIRES', model=RequiresRel)
        required_by = RelationshipFrom('Topic', 'REQUIRES', model=RequiresRel)
    
    class Activity(StructuredNode):
        id = StringProperty(unique_index=True, required=True)
        name = StringProperty(required=True)
        type = StringProperty()
        max_attempts = IntegerProperty(default=1)
        description = StringProperty()
        created_at = DateTimeProperty(default=datetime.now)
        
        # Relationships
        tests = RelationshipTo('Topic', 'TESTS', model=TestsRel)
        attempted_by = RelationshipFrom('User', 'ATTEMPTED', model=AttemptedRel)
    
    class User(StructuredNode):
        id = StringProperty(unique_index=True, required=True)
        name = StringProperty(required=True)
        email = StringProperty(unique_index=True, required=True)
        joined = DateProperty(default=datetime.now)
        
        # Relationships
        attempted = RelationshipTo('Activity', 'ATTEMPTED', model=AttemptedRel)
        has_mastery = RelationshipTo('Topic', 'HAS_MASTERY', model=MasteryRel)
    
    print("This function demonstrates how to use neomodel's OGM features.")
    print("To implement the migration, you would create instances and relationships using these models.")
    print("For example:")
    print("  math = Subject(id='math', name='Mathematics', description='Study of numbers').save()")
    print("  arithmetic = Topic(id='arithmetic', name='Arithmetic', weight=0.75).save()")
    print("  arithmetic.belongs_to.connect(math)")
    print("\nFor bulk operations, directly using Cypher as in the main approach is more efficient.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run Neo4j database migration')
    parser.add_argument('--non-interactive', action='store_true', 
                        help='Run in non-interactive mode (don\'t prompt for input on errors)')
    parser.add_argument('--skip-drop', action='store_true',
                        help='Skip dropping existing indexes and constraints')
    args = parser.parse_args()
    
    # Set global flag for interactive mode
    interactive_mode = not args.non_interactive
    
    main(interactive_mode, args.skip_drop)
    
    # Uncomment the following line to see the alternative OGM approach
    # create_models_and_apply_migration()