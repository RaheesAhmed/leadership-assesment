export interface Question {
  id: string;
  type: "text" | "number" | "textarea" | "select" | "boolean";
  question: string;
  placeholder?: string;
  helperText?: string;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  additionalInfo?: {
    question: string;
    placeholder: string;
  };
}

export interface FormData {
  [key: string]: string | boolean | undefined;
  name?: string;
  industry?: string;
  "industry-additional"?: string;
  companySize?: string;
  department?: string;
  jobTitle?: string;
  directReports?: string;
  decisionLevel?: string;
  typicalProject?: string;
  levelsToCEO?: string;
  managesBudget?: string;
  "managesBudget-additional"?: string;
}

export interface AssessmentQuestion extends Question {
  capability: string;
  ratingQuestion?: string;
  reflection?: string;
}

export interface LevelTwoQuestion {
  id: string;
  capability: string;
  level: number;
  question: string;
  theme: string;
  type: string;
  requiresReflection: boolean;
}
