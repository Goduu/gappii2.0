# from graph import run_as_cli
from database.user_operations import create_user, add_subject_to_user, delete_all_users, delete_user
from database.topic_operations import create_topic, delete_all_topics, add_topic_to_topic, add_activity_to_topic
from database.subject_operations import create_subject, delete_all_subjects, add_topic_to_subject, delete_subject
from database.activity_operations import create_activity
import fastapi
from fastapi import Request
from pathlib import Path
import sys, os
# from graph import Answer, End
from pydantic import BaseModel
from database.activity_operations import Activity

# Add the current directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

THIS_DIR = Path(__file__).parent

app = fastapi.FastAPI(
    title="Question Graph API",
    description="API for interacting with a question-answer graph system",
    version="1.0.0"
)

class User(BaseModel):
    id: int
    name: str
    email: str
    
@app.get('/xongas', response_model=User)
def xongas():
    return User(id="user_id", name="Alice", email="alice@example.com")

@app.post('/addSubjectToUser')
async def addSubjectToUser(request: Request):
    data = await request.json()
    subject = data.get('subject')
    user_email = data.get('email')
    subject = create_subject(subject)
    user = add_subject_to_user(subjectName=subject["name"], email=user_email)
    return {"message": f"Subject: {subject} added to user: {user}"}

@app.post('/deleteUser')
async def deleteUser(request: Request):
    data = await request.json()
    email = data.get('email')
    delete_user(email)
    return {"message": f"User: {email} deleted"}

@app.post('/addTopicToSubject')
async def addTopicToSubject(request: Request):
    print("addTopicToSubject", request.__dict__)
    data = await request.json()
    subject = data.get('subject')
    topic = data.get('topic')
    add_topic_to_subject(topicName=topic, subjectName=subject)
    return {"message": f"Topic: {topic} added to subject: {subject}"}

@app.post('/addTopicToTopic')
async def addTopicToTopic(request: Request):
    data = await request.json()
    topic = data.get('topic')
    parentTopic = data.get('parentTopic')
    add_topic_to_topic(topicName=topic["name"], parentTopicName=parentTopic["name"])
    return {"message": f"Topic: {topic} added to topic: {parentTopic}"}

@app.post('/addActivityToTopic')
async def addActivityToTopic(request: Request):
    data = await request.json()
    activity:Activity = data.get('activity')
    topic = data.get('topic')
    activity = create_activity(activity)
    add_activity_to_topic(activityId=activity["id"], topicName=topic["name"])
    return {"message": f"Activity: {activity} added to topic: {topic}"}

@app.post('/deleteSubject')
async def deleteSubject(request: Request):
    data = await request.json()
    subject = data.get('subject')
    delete_subject(subject)
    return {"message": f"Subject: {subject} deleted"}

@app.post('/signUp')
async def signUp(request: Request):
    data = await request.json()
    email = data.get('email')
    password = data.get('password')
    user = create_user(email, password)
    return {"message": f"User: {user} signed up"}

@app.post('/resetDb')
async def resetDb(request: Request):
    data = await request.json()
    if(data.get('password') == "xongaspaha"):
        delete_all_users()
        delete_all_topics()
        delete_all_subjects()
        return {"message": "Database reset"}
    
    return {"message": "Invalid password"}




if __name__ == '__main__':
    import uvicorn

    uvicorn.run(
        'api:app', reload=True, reload_dirs=[str(THIS_DIR)]
    )