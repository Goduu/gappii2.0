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

export const NewSubjectSchema = z.object({
  question: z.string(),
  options: z.array(QuizOptionSchema),
});

export const UnderstandSubjectsSchema = z.object({
  activities: z.array(NewSubjectSchema),
});

export type Activity = z.infer<typeof ActivitySchema>;
export type NewSubjectActivity = z.infer<typeof NewSubjectSchema>;


export const CreateSubjectTopicsAndActivitiesSchema = z.object({
  subject: z.string(),
  topics: z.array(z.string()),
  activities: z.array(ActivitySchema),
});

export type CreateSubjectTopicsAndActivities = z.infer<typeof CreateSubjectTopicsAndActivitiesSchema>;