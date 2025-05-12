export const createSubjectTopicsAndActivitiesPrompt = `
    You will receive a userPrompt about what he wants to learn, and a list of answer and questions you created to understand the user request.
    Define a main subject, a list of topics and create a list of activities about the subject and topics based on the user prompt.
    The activities should have as goal the mastery of the subject.
    The activities should be multiple (two options) choice questions.
    The activities should be in the language of the user prompt.
    The activities should be at the level of the user prompt.
    The activities should be aligned with the user request.
    `
