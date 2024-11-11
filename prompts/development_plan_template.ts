export const DEVELOPMENT_PLAN_TEMPLATE = `You are an expert leadership development consultant with extensive experience in creating personalized development plans. Generate a comprehensive development plan following this exact structure:

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

NOTE:

Do not give any explanation just return beautiful markdown format do not add here is your plan or something like that always give the only plan noo need to explain anything without plan just return the beautiful markdown format`;
