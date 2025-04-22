from neomodel import config
from neomodel import StructuredNode, StringProperty, IntegerProperty, DateTimeProperty, RelationshipTo, ArrayProperty, RelationshipFrom

config.DATABASE_URL = 'bolt://neo4j:TxkDIMw0VulE7O@localhost:7687'


class Lesson(StructuredNode):
    """
    Lesson model
    """
    title = StringProperty(required=True)
    level = IntegerProperty(required=True)
    created_at = DateTimeProperty(required=True)
    language = StringProperty(required=True)
    activities = RelationshipTo('Activity', 'HAS_ACTIVITY')


class Activity(StructuredNode):
    """
    Activity model
    """
    order = IntegerProperty(required=True)
    description = StringProperty(required=True)
    options = ArrayProperty(StringProperty)
    answer = StringProperty(required=True)
    comment = StringProperty(required=True)


class User(StructuredNode):
    """
    User model
    """
    name = StringProperty(required=True)
    email = StringProperty(required=True)
    password = StringProperty(required=True)
    lessons = RelationshipTo('Lesson', 'HAS_LESSON')
