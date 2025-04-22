# from graph import run_as_cli
from database.user_operations import create_user, add_topic_to_user
from database.topic_operations import create_topic
import fastapi
from fastapi import Request
from pathlib import Path
import sys, os
# from graph import Answer, End
from pydantic import BaseModel

# Add the current directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

THIS_DIR = Path(__file__).parent

app = fastapi.FastAPI(
    title="Question Graph API",
    description="API for interacting with a question-answer graph system",
    version="1.0.0"
)

# @app.post('/chat', response_model=Answer | End)
# async def chat(request: Request, ):
#     print("chat")
#     data = await request.json()
#     message = data.get('message')
#     execution_id = data.get('execution_id') or "test"
#     return await run_as_cli(answer=message, execution_id=execution_id)


class User(BaseModel):
    id: int
    name: str
    email: str
    
@app.get('/xongas', response_model=User)
def xongas():
    return User(id="user_id", name="Alice", email="alice@example.com")

@app.post('/addTopicToUser')
async def addTopicToUser(request: Request):
    data = await request.json()
    topic = data.get('topic')
    user_id = data.get('user_id')
    topic = create_topic(topic)
    print("xongas",topic)
    user = add_topic_to_user(topicId=topic["id"], userId=user_id)
    return {"message": f"Topic: {topic} added to user: {user}"}

@app.post('/signUp')
async def signUp(request: Request):
    data = await request.json()
    email = data.get('email')
    password = data.get('password')
    user = create_user(email, password)
    return {"message": f"User: {user} signed up"}




if __name__ == '__main__':
    import uvicorn

    uvicorn.run(
        'api:app', reload=True, reload_dirs=[str(THIS_DIR)]
    )