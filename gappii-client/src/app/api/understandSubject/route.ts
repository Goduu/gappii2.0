import { UnderstandSubjectsSchema } from "@/components/quiz/types";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { understandSubjectPrompt } from "./prompt";

export const maxDuration = 60;

export async function POST(request: Request) {

    const { userPrompt } = await request.json();
    console.log(userPrompt)

    const result = streamObject({
        model: openai("gpt-4o-2024-08-06"),
        system: understandSubjectPrompt,
        prompt: userPrompt,
        schema: UnderstandSubjectsSchema,
        onFinish: (result) => {
            console.log(result)
        }
    })

    return result.toTextStreamResponse();

}