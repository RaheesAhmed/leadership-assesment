import OpenAI from "openai";
import { AssessmentResponse } from "@/types/types";
import { PLAN_INSTRUCTIONS } from "@/prompts/plan_instructions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant_id = process.env.OPENAI_ASSISTANT_ID as string;

if (!assistant_id) {
  throw new Error("OPENAI_ASSISTANT_ID is not defined");
}

interface GenerateRequestBody {
  userInfo: {
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
    userId: string;
  };
  responsibilityLevel: {
    level: number;
    role: string;
    description: string;
  };
  assessmentAnswers?: AssessmentResponse[];
  assessmentCompleted: boolean;
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequestBody = await request.json();
    const {
      userInfo,
      responsibilityLevel,
      assessmentAnswers,
      assessmentCompleted,
    } = body;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const threadId = (await openai.beta.threads.create()).id;

    // Create different prompts based on assessment completion
    const promptContent = assessmentCompleted
      ? `Generate a comprehensive development plan following this exact structure:

[SECTION A: COVER PAGE]
• Title: "Personalized Development Plan"
• Participant's Name: {name}
• Date of Assessment: {date}

[SECTION B: EXECUTIVE SUMMARY]
• Brief overview of overall assessment results
• Key strengths across 8 capabilities
• Priority areas for improvement
• High-level development focus

[SECTION C: PERSONAL PROFILE]
• Demographic Information Analysis
  - Role/Title: {current_role}
  - Industry: {industry}
  - Years of Experience: {years_experience}
  - Company Size: {company_size}
• Assigned Responsibility Level
• Context within career stage

[SECTION D: ASSESSMENT OVERVIEW]
• Visual representation of capability scores
• Interpretation of results relative to role
• Overall performance patterns
• Skills vs confidence analysis

[SECTION E: DETAILED CAPABILITY ANALYSIS]
For each of the 8 capabilities:
1. Capability Overview
   • Importance for role
   • Current proficiency level
   • Confidence level

2. Focus Areas Analysis
   • Detailed breakdown of subcategories
   • Self-assessment interpretation
   • Role-specific importance

3. Strengths & Development Areas
   • Key strengths identified
   • Areas for improvement
   • Specific challenges noted

4. Recommendations
   • Personalized action steps
   • Relevant resources
   • Expected benefits

[SECTION F: PERSONAL DEVELOPMENT PLANNING]
• Development planning template
• Goal-setting framework
• Action planning guidance
• Progress tracking tools

[SECTION G: ADDITIONAL SUPPORT]
• Tips for development success
• Common challenges and solutions
• Additional learning resources
• Support networks and communities

[SECTION H: CONCLUSION]
• Motivational closing message
• Next steps outline
• Progress tracking suggestions
• Support contact information

CONTEXT:
Participant Profile:
- Name: {name}
- Current Role: {current_role} ({current_role_description})
- Industry: {industry}
- Experience: {years_experience} years
- Focus Areas: {focus_areas}
- Timeline: {timeline} months
- Competency Assessment: {competency_ratings}


Generate the development plan following these exact specifications, ensuring all content is highly personalized, actionable, and aligned with the participant's role level and development needs. The plan should be specific, actionable, and deeply personalized.
         here is the user profile: ${JSON.stringify(userInfo)}
         here is the assessment results: ${JSON.stringify(assessmentAnswers)}
         here is the responsibility level: ${JSON.stringify(
           responsibilityLevel
         )}
         NOTE:Do not include any other text than the required output structure. Only return the JSON object. No need any explnation at the start like here is your development plan ot based on information i will generete so on only Give the JSON back
        `
      : `Generate a comprehensive development plan following this exact structure:

[SECTION A: COVER PAGE]
• Title: "Personalized Development Plan"
• Participant's Name: {name}
• Date of Assessment: {date}

[SECTION B: EXECUTIVE SUMMARY]
• Brief overview of overall assessment results
• Key strengths across 8 capabilities
• Priority areas for improvement
• High-level development focus

[SECTION C: PERSONAL PROFILE]
• Demographic Information Analysis
  - Role/Title: {current_role}
  - Industry: {industry}
  - Years of Experience: {years_experience}
  - Company Size: {company_size}
• Assigned Responsibility Level
• Context within career stage

[SECTION D: ASSESSMENT OVERVIEW]
• Visual representation of capability scores
• Interpretation of results relative to role
• Overall performance patterns
• Skills vs confidence analysis

[SECTION E: DETAILED CAPABILITY ANALYSIS]
For each of the 8 capabilities:
1. Capability Overview
   • Importance for role
   • Current proficiency level
   • Confidence level

2. Focus Areas Analysis
   • Detailed breakdown of subcategories
   • Self-assessment interpretation
   • Role-specific importance

3. Strengths & Development Areas
   • Key strengths identified
   • Areas for improvement
   • Specific challenges noted

4. Recommendations
   • Personalized action steps
   • Relevant resources
   • Expected benefits

[SECTION F: PERSONAL DEVELOPMENT PLANNING]
• Development planning template
• Goal-setting framework
• Action planning guidance
• Progress tracking tools

[SECTION G: ADDITIONAL SUPPORT]
• Tips for development success
• Common challenges and solutions
• Additional learning resources
• Support networks and communities

[SECTION H: CONCLUSION]
• Motivational closing message
• Next steps outline
• Progress tracking suggestions
• Support contact information

CONTEXT:
Participant Profile:
- Name: {name}
- Current Role: {current_role} ({current_role_description})
- Industry: {industry}
- Experience: {years_experience} years
- Focus Areas: {focus_areas}
- Timeline: {timeline} months
- Competency Assessment: {competency_ratings}


Generate the development plan following these exact specifications, ensuring all content is highly personalized, actionable, and aligned with the participant's role level and development needs.
         here is the user profile: ${JSON.stringify(userInfo)}
         here is the responsibility level: ${JSON.stringify(
           responsibilityLevel
         )}

         NOTE:Do not include any other text than the required output structure. Only return the JSON object. No need any explnation at the start like here is your development plan ot based on information i will generete so on only Give the JSON back
        `;

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `${promptContent}
      
      `,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id,
      instructions: PLAN_INSTRUCTIONS,
    });

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    let attempts = 0;
    const maxAttempts = 30;

    while (
      (runStatus.status === "queued" || runStatus.status === "in_progress") &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      attempts++;
    }

    if (runStatus.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);
      const latestMessage = messages.data[0];

      if (latestMessage.content[0].type === "text") {
        const generatedPlan = latestMessage.content[0].text.value;

        // Save to DevelopmentPlan table instead
        const developmentPlan = await prisma.developmentPlan.create({
          data: {
            userId: session.user.id,
            plan: JSON.parse(generatedPlan), // Parse the plan as JSON since the field is Json type
          },
        });

        return Response.json({
          success: true,
          plan: generatedPlan,
          developmentPlanId: developmentPlan.id,
        });
      }
    }

    throw new Error(`Failed to generate plan. Status: ${runStatus.status}`);
  } catch (error) {
    console.error("Error in generate route:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate plan",
      },
      { status: 500 }
    );
  }
}
