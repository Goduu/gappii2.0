"""
This agent is used to switch between different agents based on the user's query.
"""
from pydantic_ai import Agent, RunContext
from lesson_agent import lesson_agent
from dotenv import load_dotenv
from database.schema import User

load_dotenv()

switcher_agent = Agent(
    'openai:gpt-4o',
    deps_type=str,
    system_prompt=(
        "You are a switcher agent. You are given a list of agents and a user query. "
        "You should use the most appropriate agent to answer the user's query. "
    ),
)


@switcher_agent.tool_plain
async def call_lesson_agent(prompt: str):
    """
    Create a new lesson for the user.
    """
    results = await lesson_agent.run(prompt)
    return results.data


@switcher_agent.tool_plain
def get_all_lessons(user_id: str):
    """
    Get all lessons form a user.
    """
    user = User.nodes.get(email=user_id)
    return "all lessons"



print(switcher_agent.run_sync("how much is 1 +3 /3?'"))
# print(switcher_agent.run_sync("Create me a lesson on the topic of 'Python'"))
