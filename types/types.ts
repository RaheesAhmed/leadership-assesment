export interface Question {
  id: string;
  question: string;
  type: "text" | "number" | "textarea" | "select" | "boolean";
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
  additionalInfo?: {
    question: string;
    placeholder: string;
  };
}

export interface UserInfo {
  name: string;
  industry: string;
  companySize: string;
  department: string;
  jobTitle: string;
  directReports: string;
  decisionLevel: string;
  typicalProject: string;
  levelsToCEO: string;
  managesBudget: string;
}

export interface ResponsibilityLevel {
  level: number;
  description: string;
}

export interface AssessmentResponse {
  questionId?: string;
  rating?: number;
  response: string;
  reflectionRating?: number;
  reflection?: string;
  question: {
    ratingQuestion?: string;
    reflection?: string;
    question?: string;
  };
  area: string;
}

export interface AssessmentData {
  responses: any[];
  completedAt: string;
  timeSpent: number;
  status: "pending" | "completed";
  userInfo: {
    name: string;
    email: string;
    avatar: string;
  };
  responsibilityLevel: {
    role: number;
    title: string;
  };
  assessmentId: string;
}

export interface DevelopmentPlan {
  content: string;
  goals: {
    title: string;
    description: string;
    progress: number;
  }[];
  skills: {
    name: string;
    level: number;
    description: string;
  }[];
}

export interface Question {
  id: string;
  question: string;
  type: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  additionalInfo?: {
    question: string;
    placeholder: string;
  };
}

export interface ClassificationResult {
  responsibilityLevel: number;
  role: string;
  description: string;
  versionInfo: {
    "v1.0": string;
    "v2.0": string;
  };
  nextStep: string;
}

export interface ClassificationProps {
  onComplete: (
    userInfo: Record<string, string>,
    classificationResult: ClassificationResult
  ) => void;
}
