export interface DevelopmentPlan {
  content?: string;
  sections?: {
    executive_summary?: {
      overall_assessment?: string;
    };
    // ... other sections as needed
  };
}
