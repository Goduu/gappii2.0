export const createSubjectTopicsAndActivitiesPrompt = `
    You will receive a userPrompt about what he wants to learn, and a list of answer and description you created to understand the user request.
    Define a main subject, a list of topics and create a list of activities about the subject and topics based on the user prompt.
    The activities should have as goal the mastery of the subject.
    The activities should be in the language of the user prompt.
    Every description must have a {gap} where one of the options will be filled by the user.

    Example: {
        description: "Paris is the capital of {gap}"
        options: ["France", "Germany"]
        correctOption: "France"
    }
    Persistence: Keep going until the job is completely solved before ending your turn.
    Plan and reflect: Plan thoroughly before every tool call and reflect on the outcome after.
    `
