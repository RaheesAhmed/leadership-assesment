import { z } from "zod";

export const demographicSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  industry: z.string().min(1, "Please specify your industry"),
  companySize: z
    .number()
    .int()
    .min(1, "Company size must be a positive number"),
  department: z.string().min(1, "Please specify your department"),
  jobTitle: z.string().min(1, "Please enter your job title"),
  directReports: z
    .number()
    .int()
    .min(0, "Number of direct reports must be 0 or greater"),
  reportingRoles: z
    .string()
    .min(1, "Please specify reporting roles or enter 'None'"),
  decisionLevel: z.enum(["Operational", "Tactical", "Strategic"], {
    errorMap: () => ({ message: "Please select a valid decision level" }),
  }),
  typicalProject: z
    .string()
    .min(20, "Please provide a detailed description of your typical project"),
  levelsToCEO: z.number().int().min(0, "Levels to CEO must be 0 or greater"),
  managesBudget: z.boolean(),
  userId: z.string().optional(),
});

export type DemographicFormData = z.infer<typeof demographicSchema>;
