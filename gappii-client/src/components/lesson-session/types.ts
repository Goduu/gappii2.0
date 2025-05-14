import { z } from "zod";

export interface QuizOption {
  id: string;
  text: string;
}

export const ActivitySchema = z.object({
  id: z.string(),
  description: z.string(),
  options: z.array(z.string()).min(2).max(2),
  topics: z.array(z.string()),
  correctOption: z.string(),
});

export const ActivitiesSchema = z.object({
  activities: z.array(ActivitySchema),
});

export const NewSubjectSchema = z.object({
  description: z.string(),
  options: z.array(z.string()).min(2).max(2),
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