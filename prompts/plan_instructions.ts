export const PLAN_INSTRUCTIONS = `
# Development Plan Instructions

## Overview
Please generate a comprehensive professional development plan based on the provided data. The plan should follow our structured format and include specific, actionable recommendations.

## Required Sections

### 1. Cover Page
- Title: "Personalized Development Plan"
- Participant's name prominently displayed
- Assessment date
- Professional formatting

### 2. Executive Summary
*One concise paragraph including:*
- Overall assessment of capabilities
- Top 2-3 strengths with scores
- Key 2-3 development areas with scores
- Clear link to career aspirations

### 3. Personal Profile
- Professional background summary
- Current role context
- Target role implications
- Industry-specific considerations
- Development journey context

### 4. Assessment Overview
- Visual/descriptive representation of capability scores
- Pattern analysis of strengths and development areas
- Skill vs. confidence comparison
- Impact analysis for target role

### 5. Detailed Capability Analysis
*For each of the 8 capabilities, include:*
- Capability importance for current/target role
- Score analysis with context
- Strengths identification
- Development areas
- Specific, actionable recommendations
- Relevant resources and learning opportunities

### 6. Development Planning Template
- Goal-setting framework with examples
- Action planning structure
- Timeline recommendations
- Progress tracking methods
- Success metrics

### 7. Additional Support
- Success strategies
- Challenge mitigation approaches
- Resource recommendations
- Learning pathways

### 8. Conclusion
- Motivational summary
- Clear next steps
- Progress review recommendations
- Support contact information

## Special Requirements

### Tone & Style
- Professional yet encouraging
- Future-focused and growth-oriented
- Personalized references throughout
- Clear and actionable language

### Recommendations
- Must be specific and achievable
- Aligned with role and industry
- Include timeline suggestions
- Provide success metrics

### Formatting
- Clear section headers
- Consistent bullet points
- Professional spacing
- Easy-to-read structure

### Personalization Requirements
- Reference specific role challenges
- Include industry context
- Link to career aspirations
- Consider company size context

### Validation Rules
- All capability scores must be between 1-5
- All sections must be completed
- Recommendations must be role-specific
- Resources must be relevant and current

### Output Expectations
- Comprehensive coverage of all sections
- Clear, actionable recommendations
- Professional formatting
- Consistent cross-referencing between sections
- Personalized content throughout

## Important Implementation Notes

### Data Usage
- Use provided scores and responses consistently
- Make logical inferences where appropriate
- Maintain data accuracy throughout

### Recommendation Structure
- Progressive and buildable steps
- Include both short and long-term actions
- Provide clear success indicators
- Link to specific capabilities

### Resource Requirements
- Relevant to role and industry
- Mix of formats (books, courses, workshops)
- Specified time investments
- Associated costs indicated

### Timeline Planning
- Realistic implementation schedules
- Clear milestone markers
- Account for role demands
- Allow for flexibility

## Quality Checklist
✓ All sections complete
✓ Recommendations specific and actionable  
✓ Professional and encouraging tone
✓ Accurate data usage
✓ Maintained cross-references
✓ Professional formatting
✓ Evident personalization
✓ Resources relevant and practical

REQUIRED OUTPUT STRUCTURE:
{
"development_plan": {
"metadata": {
"version": "1.0",
"generated_date": "CURRENT_DATE",
"participant_id": "PARTICIPANT_NAME"
},
"sections": {
"cover_page": {
"title": "Personalized Development Plan",
"participant_name": "",
"assessment_date": ""
},
"executive_summary": {
"overall_assessment": "",
"key_strengths": [
{
"strength": "",
"score": 0
}
],
"development_areas": [
{
"area": "",
"score": 0
}
]
},
"personal_profile": {
"professional_background_summary": "",
"current_role_context": "",
"target_role_implications": "",
"industry_specific_considerations": "",
"development_journey_context": ""
},
"assessment_overview": {
"capability_scores": {},
"pattern_analysis": "",
"skill_vs_confidence_comparison": "",
"impact_analysis_for_target_role": ""
},
"detailed_capability_analysis": {
[FOR EACH CAPABILITY]: {
"importance": "",
"score_analysis": "",
"strengths": "",
"development_areas": "",
"recommendations": [],
"resources": ""
}
},
"development_planning": {
"goal_setting_framework": {
"examples": []
},
"action_planning_structure": {
"short_term_actions": [],
"long_term_actions": []
},
"timeline_recommendations": "",
"progress_tracking_methods": "",
"success_metrics": []
},
"support_resources": {
"success_strategies": "",
"challenge_mitigation_approaches": "",
"resource_recommendations": [],
"learning_pathways": ""
},
"conclusion": {
"motivational_summary": "",
"clear_next_steps": "",
"progress_review_recommendations": "",
"support_contact_information": ""
}
}
}
}

NOTE:Do not include any other text than the required output structure. Only return the JSON object. No need any explnation at the start like here is your development plan ot based on information i will generete so on only Give the JSON back
`;
