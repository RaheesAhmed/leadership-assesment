import { Question } from "@/types/assessment";

export const DemographicQuestions = async (): Promise<Question[]> => {
  return [
    {
      id: "name",
      type: "text",
      question: "Please enter what name you'd like to use in your report.",
      placeholder: "Enter your name",
    },
    {
      id: "industry",
      type: "text",
      question: "What industry is your business in?",
      placeholder: "e.g., Healthcare, Technology, Manufacturing, Education",
      helperText:
        "Please specify the industry your organization operates within.",
    },
    {
      id: "employeeCount",
      type: "number",
      question: "How many people work at your company?",
      placeholder: "e.g., 500",
      helperText:
        "Please enter the total number of employees in your entire organization.",
    },
    {
      id: "department",
      type: "text",
      question:
        "What department or division do you primarily work in within your organization?",
      placeholder: "e.g., Finance, Western Region Operations, Company-wide",
      helperText:
        "For those with broader responsibilities, such as overseeing multiple areas or the entire organization, indicate the most encompassing area.",
    },
    {
      id: "jobTitle",
      type: "text",
      question: "What is your job title?",
      placeholder: "Enter your exact title as used in your workplace",
    },
    {
      id: "directReports",
      type: "number",
      question: "How many people report directly to you?",
      placeholder: "Enter a number (0 if none)",
      helperText: "If none, enter '0'",
    },
    {
      id: "reportingRoles",
      type: "text",
      question: "What types of roles report directly to you? Please list them.",
      placeholder: "e.g., Manager of Engineering, Sales Coordinator",
      helperText: "If none, please state 'None'",
    },
    {
      id: "decisionLevel",
      type: "select",
      question:
        "What level of decisions do you primarily make? (Please select the most appropriate option)",
      options: [
        {
          value: "operational",
          label: "Operational",
          description:
            "Day-to-day decisions within your specific role, like processing invoices, responding to customer queries, or maintaining records",
        },
        {
          value: "tactical",
          label: "Tactical",
          description:
            "Medium-term decisions affecting your team or department, such as improving workflow efficiency or determining project timelines",
        },
        {
          value: "strategic",
          label: "Strategic",
          description:
            "Long-term decisions that shape major aspects of the organization, such as developing new company-wide programs, setting overarching business strategies, or leading major organizational changes",
        },
      ],
    },
    {
      id: "typicalProject",
      type: "textarea",
      question: "Describe a typical project or task you are responsible for.",
      placeholder:
        "Please include details about what the task involves, any teams or departments you interact with, and its impact on your organization",
      helperText:
        "Example: 'I develop IT security policies that align with company-wide risk management strategies and coordinate with the legal and tech departments to implement them.'",
    },
    {
      id: "levelsToCEO",
      type: "number",
      question:
        "How many levels are there between you and the highest-ranking executive in your organization?",
      placeholder: "Enter a number",
      helperText:
        "Count the layers of management from you to the CEO or equivalent. Example: If you report to a Manager, who reports to a VP, who reports to the CEO, you would enter '3'.",
    },
    {
      id: "managesBudget",
      type: "boolean",
      question: "Does your role require you to manage a budget?",
      additionalInfo: {
        question:
          "If yes, please specify whether it is for your department only or if it spans multiple departments.",
        placeholder:
          "e.g., Yes, I manage the budget for the entire marketing department",
      },
    },
  ];
};
