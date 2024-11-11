export interface MultiRaterAssessment {
  assessmentId: string;
  primaryUserId: string;
  raters: RaterInfo[];
  status: "pending" | "in_progress" | "completed";
  dueDate: Date;
}

export interface RaterInfo {
  id: string;
  email: string;
  relationship: "peer" | "manager" | "direct_report" | "self";
  status: "invited" | "accepted" | "completed";
  completedAt?: Date;
}

export interface ConsultantAccount {
  id: string;
  name: string;
  company: string;
  apiKey: string;
  whitelabelConfig: WhitelabelConfig;
  revenueShare: number;
}

export interface WhitelabelConfig {
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  customDomain?: string;
}

export interface CorporateSubscription {
  id: string;
  companyId: string;
  plan: "basic" | "professional" | "enterprise";
  features: string[];
  maxUsers: number;
  apiAccess: boolean;
  analyticsAccess: boolean;
}

export interface PartnerIntegration {
  id: string;
  partnerId: string;
  partnerType: "hris" | "lms" | "performance";
  apiConfig: {
    endpoint: string;
    authType: "oauth" | "apiKey";
    credentials: Record<string, string>;
  };
}
