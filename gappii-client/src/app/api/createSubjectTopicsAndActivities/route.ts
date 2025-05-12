import { CreateSubjectTopicsAndActivitiesSchema } from "@/components/lesson-session/types";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createSubjectTopicsAndActivitiesPrompt } from "./prompt";

export const maxDuration = 60;

export async function POST(request: Request) {

    const { userPrompt } = await request.json();
    console.log(userPrompt)

    const result = streamObject({
        model: openai("gpt-4o-2024-08-06"),
        system: createSubjectTopicsAndActivitiesPrompt,
        prompt: userPrompt,
        schema: CreateSubjectTopicsAndActivitiesSchema,
        onFinish: (result) => {
            console.log(result)
        }
    })

    return result.toTextStreamResponse();

}

