import OpenAI from 'openai';

export interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    period?: string;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    location?: string;
    period?: string;
    gpa?: string;
    honors?: string;
  }>;
  linkedin_url?: string;
  portfolio_url?: string;
}

type ExperienceEntry = NonNullable<ParsedResumeData['experience']>[number];
type EducationEntry = NonNullable<ParsedResumeData['education']>[number];

// Get OpenAI API key from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;

/**
 * AI-powered resume parser using OpenAI
 */
export async function parseResumeWithAI(text: string): Promise<ParsedResumeData> {
  // Check if API key is configured
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your environment variables.');
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Required for browser usage
  });

  const systemPrompt = `You are an expert at parsing resumes and extracting structured information. 
Extract all relevant information from the resume text and return it as a JSON object with the following structure:
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "fullName": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "location": "string (optional, format: City, State or City, Country)",
  "title": "string (optional, current job title)",
  "bio": "string (optional, professional summary/objective)",
  "skills": ["string array (optional, list all technical and soft skills)"],
  "experience": [
    {
      "title": "string (optional, job title)",
      "company": "string (optional, company name)",
      "location": "string (optional, work location)",
      "period": "string (optional, date range like '2020 - 2023' or 'Jan 2020 - Present')",
      "description": "string (optional, job description)",
      "achievements": ["string array (optional, key achievements/bullet points)"]
    }
  ],
  "education": [
    {
      "degree": "string (optional, degree name like 'Bachelor of Science in Computer Science')",
      "school": "string (optional, school/university name)",
      "location": "string (optional, school location)",
      "period": "string (optional, date range)",
      "gpa": "string (optional, GPA if mentioned)",
      "honors": "string (optional, honors or distinctions)"
    }
  ],
  "linkedin_url": "string (optional, LinkedIn profile URL)",
  "portfolio_url": "string (optional, portfolio or personal website URL)"
}

Important instructions:
1. Extract ALL work experience entries, even if they don't have all fields filled
2. Extract ALL education entries
3. Extract ALL skills mentioned anywhere in the resume
4. Parse dates in various formats (YYYY-YYYY, Month YYYY - Month YYYY, MM/YYYY, etc.)
5. Extract achievements/bullet points from job descriptions
6. If a field is not found or unclear, omit it (don't include null or empty strings)
7. Return ONLY valid JSON, no additional text or markdown
8. Be thorough and accurate - extract as much information as possible`;

  const userPrompt = `Please parse the following resume text and extract all information in the specified JSON format:

${text}

Return only the JSON object, no additional text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for cost efficiency, can upgrade to gpt-4o for better accuracy
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' }, // Force JSON output
      temperature: 0.1, // Low temperature for more consistent parsing
      max_tokens: 4000, // Enough for detailed resume data
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsedData = JSON.parse(content) as ParsedResumeData;

    // Validate and clean the data
    return validateAndCleanParsedData(parsedData);
  } catch (error) {
    console.error('Error parsing resume with AI:', error);
    if (error instanceof Error) {
      throw new Error(`AI parsing failed: ${error.message}`);
    }
    throw new Error('AI parsing failed: Unknown error');
  }
}

/**
 * Validate and clean parsed data from AI
 */
function validateAndCleanParsedData(data: any): ParsedResumeData {
  const cleaned: ParsedResumeData = {};

  // Basic fields
  if (data.firstName && typeof data.firstName === 'string') {
    cleaned.firstName = data.firstName.trim();
  }
  if (data.lastName && typeof data.lastName === 'string') {
    cleaned.lastName = data.lastName.trim();
  }
  if (data.fullName && typeof data.fullName === 'string') {
    cleaned.fullName = data.fullName.trim();
  }
  if (data.email && typeof data.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    cleaned.email = data.email.trim();
  }
  if (data.phone && typeof data.phone === 'string') {
    cleaned.phone = data.phone.trim();
  }
  if (data.location && typeof data.location === 'string') {
    cleaned.location = data.location.trim();
  }
  if (data.title && typeof data.title === 'string') {
    cleaned.title = data.title.trim();
  }
  if (data.bio && typeof data.bio === 'string') {
    cleaned.bio = data.bio.trim();
  }
  if (data.linkedin_url && typeof data.linkedin_url === 'string') {
    let url = data.linkedin_url.trim();
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    cleaned.linkedin_url = url;
  }
  if (data.portfolio_url && typeof data.portfolio_url === 'string') {
    let url = data.portfolio_url.trim();
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    cleaned.portfolio_url = url;
  }

  // Skills array
  if (Array.isArray(data.skills)) {
    cleaned.skills = data.skills
      .filter((skill: any) => typeof skill === 'string' && skill.trim().length > 0)
      .map((skill: string) => skill.trim())
      .filter((skill: string, index: number, arr: string[]) => arr.indexOf(skill) === index); // Remove duplicates
  }

  // Experience array
  if (Array.isArray(data.experience)) {
    cleaned.experience = data.experience
      .filter((exp: any) => exp && typeof exp === 'object')
      .map((exp: any) => {
        const cleanedExp: ExperienceEntry = {};
        if (exp.title && typeof exp.title === 'string') {
          cleanedExp.title = exp.title.trim();
        }
        if (exp.company && typeof exp.company === 'string') {
          cleanedExp.company = exp.company.trim();
        }
        if (exp.location && typeof exp.location === 'string') {
          cleanedExp.location = exp.location.trim();
        }
        if (exp.period && typeof exp.period === 'string') {
          cleanedExp.period = exp.period.trim();
        }
        if (exp.description && typeof exp.description === 'string') {
          cleanedExp.description = exp.description.trim();
        }
        if (Array.isArray(exp.achievements)) {
          cleanedExp.achievements = exp.achievements
            .filter((achievement: any) => typeof achievement === 'string' && achievement.trim().length > 0)
            .map((achievement: string) => achievement.trim());
        }
        // Only include if we have at least a title or company
        if (cleanedExp.title || cleanedExp.company) {
          return cleanedExp;
        }
        return null;
      })
      .filter((exp: any) => exp !== null) as ParsedResumeData['experience'];
  }

  // Education array
  if (Array.isArray(data.education)) {
    cleaned.education = data.education
      .filter((edu: any) => edu && typeof edu === 'object')
      .map((edu: any) => {
        const cleanedEdu: EducationEntry = {};
        if (edu.degree && typeof edu.degree === 'string') {
          cleanedEdu.degree = edu.degree.trim();
        }
        if (edu.school && typeof edu.school === 'string') {
          cleanedEdu.school = edu.school.trim();
        }
        if (edu.location && typeof edu.location === 'string') {
          cleanedEdu.location = edu.location.trim();
        }
        if (edu.period && typeof edu.period === 'string') {
          cleanedEdu.period = edu.period.trim();
        }
        if (edu.gpa && typeof edu.gpa === 'string') {
          cleanedEdu.gpa = edu.gpa.trim();
        }
        if (edu.honors && typeof edu.honors === 'string') {
          cleanedEdu.honors = edu.honors.trim();
        }
        // Only include if we have at least a degree or school
        if (cleanedEdu.degree || cleanedEdu.school) {
          return cleanedEdu;
        }
        return null;
      })
      .filter((edu: any) => edu !== null) as ParsedResumeData['education'];
  }

  return cleaned;
}

/**
 * Check if AI parsing is available (API key configured)
 */
export function isAIParsingAvailable(): boolean {
  return !!OPENAI_API_KEY;
}

