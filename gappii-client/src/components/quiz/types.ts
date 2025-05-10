import { z } from "zod";

export interface QuizOption {
  id: string;
  text: string;
}

const QuizOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const ActivitySchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(QuizOptionSchema),
  topics: z.array(z.string()),
  correctOptionId: z.string(),
});

export const ActivitiesSchema = z.object({
  activities: z.array(ActivitySchema),
});

const UnderstandSubjectSchema = z.object({
  question: z.string(),
  options: z.array(QuizOptionSchema),
});

export const UnderstandSubjectsSchema = z.object({
  activities: z.array(UnderstandSubjectSchema),
});

export type Activity = z.infer<typeof ActivitySchema>;
export type UnderstandSubjectActivity = z.infer<typeof UnderstandSubjectSchema>;