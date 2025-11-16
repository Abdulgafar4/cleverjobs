import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker for Vite
// Import the worker using Vite's ?url syntax for proper bundling
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  // Use the imported worker URL which Vite will properly handle
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
}

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

/**
 * Extract text from PDF file using PDF.js with better structure preservation
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts: string[] = [];

  // Extract text from all pages with better structure
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group text items by line (Y position)
    const items = textContent.items.map((item: any) => {
      const transform = item.transform || [1, 0, 0, 1, 0, 0];
      return {
        str: item.str || '',
        y: transform[5] || 0, // Y coordinate
        x: transform[4] || 0, // X coordinate
        fontSize: item.height || (transform[0] || 0), // Font size (approximate from transform)
      };
    }).filter(item => item.str && item.str.trim().length > 0);
    
    // Group items by Y position (within a threshold - typically 2-5px for same line)
    const lineGroups: { [key: number]: typeof items } = {};
    const yPositions: number[] = [];
    const Y_THRESHOLD = 3; // Pixels threshold for same line
    
    for (const item of items) {
      // Find closest Y position (within threshold)
      let matchedY: number | null = null;
      for (const y of yPositions) {
        if (Math.abs(item.y - y) < Y_THRESHOLD) {
          matchedY = y;
          break;
        }
      }
      
      if (matchedY === null) {
        matchedY = item.y;
        yPositions.push(matchedY);
        lineGroups[matchedY] = [];
      }
      
      lineGroups[matchedY].push(item);
    }
    
    // Sort Y positions (top to bottom - PDF Y starts from bottom, so reverse)
    yPositions.sort((a, b) => b - a);
    
    // Build page text line by line
    const pageLines: string[] = [];
    for (const y of yPositions) {
      const lineItems = lineGroups[y];
      // Sort items by X position (left to right)
      lineItems.sort((a, b) => a.x - b.x);
      
      // Build line text with proper spacing
      let lineText = '';
      let lastX = -1;
      const X_THRESHOLD = 5; // Pixels threshold for space between words
      
      for (const item of lineItems) {
        const itemText = item.str.trim();
        if (itemText.length === 0) continue;
        
        // Estimate item width (approximate: fontSize * character count * 0.6)
        const estimatedWidth = item.fontSize * itemText.length * 0.6;
        
        // Add space if items are far apart (likely separate words/fields)
        if (lastX >= 0 && (item.x - lastX) > X_THRESHOLD) {
          lineText += ' ';
        }
        
        lineText += itemText;
        lastX = item.x + estimatedWidth;
      }
      
      if (lineText.trim().length > 0) {
        pageLines.push(lineText.trim());
      }
    }
    
    pageTexts.push(pageLines.join('\n'));
  }

  return pageTexts.join('\n\n');
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Normalize text - clean up extra spaces, normalize line breaks
 */
function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Find section in resume text - more flexible detection
 */
function findSection(text: string, sectionKeywords: string[], caseSensitive = false): { start: number; end: number; title: string } | null {
  const lines = text.split('\n');
  
  // First, try to find exact section headers (all caps or title case, short lines)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const lineLower = trimmedLine.toLowerCase();
    
    // Check if line looks like a section header
    const isHeader = trimmedLine.length > 0 && trimmedLine.length < 80 && 
                     (trimmedLine === trimmedLine.toUpperCase() || 
                      /^[A-Z]/.test(trimmedLine) ||
                      /^[A-Z][a-z]+\s/.test(trimmedLine));
    
    if (isHeader) {
      for (const keyword of sectionKeywords) {
        const keywordLower = keyword.toLowerCase();
        // Check if keyword is in the line (as whole word or part of phrase)
        if (lineLower.includes(keywordLower)) {
          // Find the start position of this section (include the header)
          const sectionStart = text.indexOf(lines[i]);
          if (sectionStart === -1) continue;
          
          // Find the end of this section (look for next major section)
          let end = text.length;
          const commonSectionHeaders = [
            'experience', 'education', 'skills', 'summary', 'objective', 
            'employment', 'work', 'projects', 'certifications', 'awards',
            'publications', 'references', 'contact', 'profile', 'about'
          ];
          
          // Look for next section header
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j].trim();
            if (nextLine.length === 0) continue;
            
            const nextLineLower = nextLine.toLowerCase();
            // Check if this looks like a section header
            const looksLikeHeader = (nextLine.length < 80 && 
                                     (nextLine === nextLine.toUpperCase() || 
                                      /^[A-Z]/.test(nextLine))) &&
                                     // And it's a different section
                                     !lineLower.includes(nextLineLower) &&
                                     !nextLineLower.includes(keywordLower);
            
            if (looksLikeHeader) {
              // Check if it matches any common section header
              const isCommonSection = commonSectionHeaders.some(header => 
                nextLineLower.includes(header) && !nextLineLower.includes(keywordLower)
              );
              
              if (isCommonSection || (nextLine.length < 50 && /^[A-Z]/.test(nextLine))) {
                // Found next section, set end to start of this line
                const nextSectionStart = text.indexOf(lines[j], sectionStart + lines[i].length);
                if (nextSectionStart !== -1 && nextSectionStart > sectionStart) {
                  end = nextSectionStart;
                  break;
                }
              }
            }
          }
          
          return {
            start: sectionStart,
            end,
            title: trimmedLine,
          };
        }
      }
    }
  }
  
  // Fallback: search for keywords anywhere in lines (less strict)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const lineLower = trimmedLine.toLowerCase();
    
    // Skip if line is too long (likely not a header)
    if (trimmedLine.length > 100) continue;
    
    for (const keyword of sectionKeywords) {
      const keywordLower = keyword.toLowerCase();
      // Check if keyword appears as a standalone word or phrase
      const keywordRegex = new RegExp(`\\b${keywordLower.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (keywordRegex.test(trimmedLine)) {
        // Found potential section - find boundaries
        const sectionStart = text.indexOf(lines[i]);
        if (sectionStart === -1) continue;
        
        // Find end by looking for next section or significant break
        let end = text.length;
        for (let j = i + 1; j < Math.min(i + 100, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine.length === 0) continue;
          
          const nextLineLower = nextLine.toLowerCase();
          // Look for other section keywords
          const otherSections = ['experience', 'education', 'skills', 'summary', 'objective', 
                                'employment', 'projects', 'certifications'];
          const isOtherSection = otherSections.some(sec => 
            sec !== keywordLower && nextLineLower.includes(sec) &&
            (nextLine.length < 80 || nextLine === nextLine.toUpperCase())
          );
          
          if (isOtherSection) {
            const nextSectionStart = text.indexOf(lines[j]);
            if (nextSectionStart !== -1 && nextSectionStart > sectionStart) {
              end = nextSectionStart;
              break;
            }
          }
        }
        
        return {
          start: sectionStart,
          end,
          title: trimmedLine,
        };
      }
    }
  }
  
  return null;
}

/**
 * Extract date ranges from text
 */
function extractDateRange(text: string): string | null {
  // Multiple date patterns
  const patterns = [
    // YYYY - YYYY or YYYY–YYYY
    /\d{4}\s*[-–—]\s*(\d{4}|Present|Current|Now)/gi,
    // Month YYYY - Month YYYY
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—]\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|Present|Current|Now)/gi,
    // MM/YYYY - MM/YYYY
    /\d{1,2}\/\d{4}\s*[-–—]\s*(\d{1,2}\/\d{4}|Present|Current|Now)/gi,
    // MM-YYYY - MM-YYYY
    /\d{1,2}-\d{4}\s*[-–—]\s*(\d{1,2}-\d{4}|Present|Current|Now)/gi,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      return match[0].trim();
    }
  }
  
  return null;
}

/**
 * Extract location from text
 */
function extractLocation(text: string): string | null {
  // City, State pattern
  const cityStatePattern = /([A-Z][a-zA-Z\s]+),\s*([A-Z]{2})\b/g;
  const match = cityStatePattern.exec(text);
  if (match) {
    return `${match[1].trim()}, ${match[2]}`;
  }
  
  // City, Country pattern
  const cityCountryPattern = /([A-Z][a-zA-Z\s]+),\s*([A-Z][a-zA-Z\s]+)\b/g;
  const match2 = cityCountryPattern.exec(text);
  if (match2) {
    return `${match2[1].trim()}, ${match2[2].trim()}`;
  }
  
  return null;
}

/**
 * Parse experience section - improved parsing
 */
function parseExperienceSection(sectionText: string): ParsedResumeData['experience'] {
  const experience: ParsedResumeData['experience'] = [];
  const lines = sectionText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentExp: ParsedResumeData['experience'][0] | null = null;
  let descriptionLines: string[] = [];
  let lineIndex = 0;
  
  // Skip section header(s)
  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    const lineLower = line.toLowerCase();
    if (lineLower.includes('experience') || lineLower.includes('employment') || 
        lineLower.includes('work history') || lineLower.includes('professional')) {
      lineIndex++;
      continue;
    }
    break;
  }
  
  for (let i = lineIndex; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    // Skip empty lines
    if (!line || line.length === 0) continue;
    
    // Check if line contains a date range
    const dateRange = extractDateRange(line);
    
    // Check if line contains location
    const location = extractLocation(line);
    
    // Check if this looks like a job title
    // Job titles are usually: capitalized, not too long, don't contain email/phone
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(line);
    const hasPhone = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/.test(line);
    const looksLikeTitle = line.length > 3 && line.length < 100 && 
                          /^[A-Z]/.test(line.trim()) && 
                          !hasEmail && !hasPhone &&
                          !line.includes('://');
    
    // Check if line contains company indicators
    const hasCompanyIndicators = line.includes('Inc.') || line.includes('LLC') || 
                                 line.includes('Corp') || line.includes('Ltd') ||
                                 line.includes('Company') || line.includes('Technologies');
    
    // If we have a date range on a line, it's likely part of an experience entry
    if (dateRange && !currentExp) {
      // Start new entry - date might be on same line as title or company
      currentExp = { period: dateRange };
      if (location) currentExp.location = location;
      
      // Check previous line for title
      if (i > 0 && lines[i - 1].length > 3 && lines[i - 1].length < 100) {
        const prevLine = lines[i - 1];
        if (/^[A-Z]/.test(prevLine.trim()) && !extractDateRange(prevLine)) {
          currentExp.title = prevLine;
        }
      }
      
      // Check if title is on same line
      if (!currentExp.title && looksLikeTitle) {
        currentExp.title = line.replace(dateRange, '').trim();
        if (currentExp.title.length === 0) {
          delete currentExp.title;
        }
      }
      
      // Check if company is on same line
      if (location) {
        const lineWithoutDateAndLocation = line.replace(dateRange, '').replace(location, '').trim();
        if (lineWithoutDateAndLocation.length > 0 && lineWithoutDateAndLocation.length < 100) {
          currentExp.company = lineWithoutDateAndLocation;
        }
      }
      
      descriptionLines = [];
      continue;
    }
    
    // If we find a title-like line and no current entry, start one
    if (looksLikeTitle && !currentExp && !dateRange) {
      currentExp = { title: line };
      descriptionLines = [];
      continue;
    }
    
    // If we have a current entry
    if (currentExp) {
      // Check if this is a company name
      if (!currentExp.company && (hasCompanyIndicators || 
          (line.length > 2 && line.length < 100 && !dateRange && !location && 
           !looksLikeTitle && !line.toLowerCase().includes('experience')))) {
        // Might be company - check if it's not a description
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const nextHasDate = extractDateRange(nextLine);
          // If next line has date, this is likely company
          if (nextHasDate || line.length < 60) {
            currentExp.company = line;
            continue;
          }
        } else if (line.length < 80) {
          currentExp.company = line;
          continue;
        }
      }
      
      // Check for date range
      if (dateRange && !currentExp.period) {
        currentExp.period = dateRange;
        if (location && !currentExp.location) {
          currentExp.location = location;
        }
      }
      
      // Check for location
      if (location && !currentExp.location) {
        currentExp.location = location;
      }
      
      // Check if this is description content
      // Description lines are usually longer, contain action words, or are bullet points
      const isDescription = line.length > 15 || 
                           line.trim().match(/^[•\-\*•]\s+/) ||
                           /^\d+\.\s+/.test(line.trim()) ||
                           /^(Developed|Created|Implemented|Managed|Led|Designed|Built|Improved)/i.test(line);
      
      if (isDescription && !dateRange && !location && !looksLikeTitle) {
        descriptionLines.push(line);
      } else if (looksLikeTitle && currentExp.title && currentExp.title !== line) {
        // New entry detected - save current one
        if (descriptionLines.length > 0) {
          currentExp.description = descriptionLines.join('\n');
          const bullets = descriptionLines.filter(l => 
            l.trim().match(/^[•\-\*•]\s+/) || /^\d+\.\s+/.test(l.trim())
          ).map(l => l.replace(/^[•\-\*•]\s*|\d+\.\s*/, '').trim());
          if (bullets.length > 0) {
            currentExp.achievements = bullets;
          }
        }
        experience.push(currentExp);
        
        // Start new entry
        currentExp = { title: line };
        descriptionLines = [];
      }
    }
  }
  
  // Save last entry
  if (currentExp) {
    if (descriptionLines.length > 0) {
      currentExp.description = descriptionLines.join('\n');
      const bullets = descriptionLines.filter(l => 
        l.trim().match(/^[•\-\*•]\s+/) || /^\d+\.\s+/.test(l.trim())
      ).map(l => l.replace(/^[•\-\*•]\s*|\d+\.\s*/, '').trim());
      if (bullets.length > 0) {
        currentExp.achievements = bullets;
      }
    }
    // Only add if we have at least a title or company
    if (currentExp.title || currentExp.company) {
      experience.push(currentExp);
    }
  }
  
  return experience;
}

/**
 * Parse education section - improved parsing
 */
function parseEducationSection(sectionText: string): ParsedResumeData['education'] {
  const education: ParsedResumeData['education'] = [];
  const lines = sectionText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentEdu: ParsedResumeData['education'][0] | null = null;
  let lineIndex = 0;
  
  // Skip section header(s)
  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    const lineLower = line.toLowerCase();
    if (lineLower.includes('education') || lineLower.includes('academic') || 
        lineLower.includes('qualifications')) {
      lineIndex++;
      continue;
    }
    break;
  }
  
  for (let i = lineIndex; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    // Skip empty lines
    if (!line || line.length === 0) continue;
    
    // Check for degree keywords (more comprehensive)
    const degreePattern = /\b(Bachelor|Master|PhD|Doctorate|Associate|Diploma|Certificate|B\.?S\.?|B\.?A\.?|B\.?E\.?|B\.?Eng\.?|M\.?S\.?|M\.?A\.?|M\.?B\.?A\.?|M\.?Eng\.?|Ph\.?D\.?|Doctor of|BS|BA|BE|MS|MA|MBA|PhD|MD|JD)\b/i;
    const degreeMatch = line.match(degreePattern);
    
    // Check for date range
    const dateRange = extractDateRange(line);
    
    // Check for GPA
    const gpaPattern = /\bGPA[:\s]*(\d+\.?\d*)\b/i;
    const gpaMatch = line.match(gpaPattern);
    
    // Check for honors
    const honorsPattern = /\b(Magna Cum Laude|Summa Cum Laude|Cum Laude|Honors|Honors|Dean's List|Phi Beta Kappa|With Distinction|With Honors)\b/i;
    const honorsMatch = line.match(honorsPattern);
    
    // Check for location
    const location = extractLocation(line);
    
    // Check for school indicators
    const hasSchoolIndicators = line.includes('University') || line.includes('College') || 
                                line.includes('Institute') || line.includes('School') ||
                                line.includes('Academy');
    
    // If we find a degree, start or update entry
    if (degreeMatch) {
      // Save previous entry if exists
      if (currentEdu) {
        education.push(currentEdu);
      }
      
      // Extract degree (might be part of larger line)
      const degreeText = line;
      currentEdu = { degree: degreeText };
      
      // Check if date is on same line
      if (dateRange) {
        currentEdu.period = dateRange;
      }
      
      // Check if location is on same line
      if (location) {
        currentEdu.location = location;
      }
      
      // Check if GPA is on same line
      if (gpaMatch) {
        currentEdu.gpa = gpaMatch[1];
      }
      
      // Check if honors is on same line
      if (honorsMatch) {
        currentEdu.honors = honorsMatch[0];
      }
      
      continue;
    }
    
    // If we have a current education entry
    if (currentEdu) {
      // Check if this is a school name
      if (!currentEdu.school && (hasSchoolIndicators || 
          (line.length > 3 && line.length < 150 && 
           !dateRange && !gpaMatch && !honorsMatch &&
           !degreeMatch && !line.includes('@')))) {
        // Likely school name
        currentEdu.school = line;
        continue;
      }
      
      // Check for date range
      if (dateRange && !currentEdu.period) {
        currentEdu.period = dateRange;
      }
      
      // Check for location
      if (location && !currentEdu.location) {
        currentEdu.location = location;
      }
      
      // Check for GPA
      if (gpaMatch && !currentEdu.gpa) {
        currentEdu.gpa = gpaMatch[1];
      }
      
      // Check for honors
      if (honorsMatch && !currentEdu.honors) {
        currentEdu.honors = honorsMatch[0];
      }
      
      // If we find another degree pattern, save current and start new
      if (degreeMatch && currentEdu.degree !== line) {
        education.push(currentEdu);
        currentEdu = { degree: line };
        if (dateRange) currentEdu.period = dateRange;
        if (location) currentEdu.location = location;
        if (gpaMatch) currentEdu.gpa = gpaMatch[1];
        if (honorsMatch) currentEdu.honors = honorsMatch[0];
      }
    } else {
      // No current entry, but check if this line might contain degree info
      // Some resumes put degree and school on same line
      if (hasSchoolIndicators && line.length < 150) {
        // Might be school name, check if previous line had degree
        if (i > 0) {
          const prevLine = lines[i - 1];
          const prevDegreeMatch = prevLine.match(degreePattern);
          if (prevDegreeMatch) {
            currentEdu = { 
              degree: prevLine,
              school: line
            };
            continue;
          }
        }
      }
    }
  }
  
  // Save last entry
  if (currentEdu) {
    // Only add if we have at least a degree or school
    if (currentEdu.degree || currentEdu.school) {
      education.push(currentEdu);
    }
  }
  
  return education;
}

/**
 * Parse skills section
 */
function parseSkillsSection(sectionText: string): string[] {
  const skills: string[] = [];
  const lines = sectionText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Skip section header
  const contentLines = lines.filter((l, i) => 
    i > 0 || !l.toLowerCase().includes('skill')
  );
  
  // Join all content and split by common delimiters
  const content = contentLines.join(' ');
  
  // Split by commas, semicolons, pipes, or bullet points
  const skillItems = content.split(/[,;|•\-\*]|\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 100);
  
  // Also check for skills in original lines (one per line)
  for (const line of contentLines) {
    if (line.length > 2 && line.length < 50 && !line.includes(':')) {
      skills.push(line);
    }
  }
  
  // Add items from split content
  skills.push(...skillItems);
  
  // Remove duplicates and clean up
  const uniqueSkills = [...new Set(skills)]
    .map(s => s.replace(/^[•\-\*]\s*|\s*[•\-\*]$/, '').trim())
    .filter(s => s.length > 0 && s.length < 100);
  
  return uniqueSkills;
}

/**
 * Parse summary/bio section
 */
function parseSummarySection(sectionText: string): string {
  const lines = sectionText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Skip section header
  const contentLines = lines.filter((l, i) => 
    i > 0 || !l.toLowerCase().match(/\b(summary|objective|about|profile|professional summary)\b/i)
  );
  
  // Extract paragraphs (lines longer than 20 characters)
  const paragraphs = contentLines
    .filter(l => l.length > 20)
    .slice(0, 5); // Limit to 5 paragraphs
  
  return paragraphs.join(' ').trim();
}

/**
 * Parse resume file and extract data
 * Uses AI parsing if available, falls back to rule-based parsing
 */
export async function parseResume(file: File): Promise<ParsedResumeData> {
  let text = '';

  try {
    // Extract text from file
    if (file.type === 'application/pdf') {
      text = await extractTextFromPDF(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      text = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }

    // Normalize text
    text = normalizeText(text);
    
    // Try AI parsing first if available
    try {
      const { parseResumeWithAI, isAIParsingAvailable } = await import('./aiResumeParser');
      if (isAIParsingAvailable()) {
        console.log('Using AI to parse resume...');
        const aiParsedData = await parseResumeWithAI(text);
        // Validate that we got meaningful data
        if (aiParsedData && (
          aiParsedData.firstName || 
          aiParsedData.email || 
          aiParsedData.experience?.length || 
          aiParsedData.education?.length ||
          aiParsedData.skills?.length
        )) {
          console.log('AI parsing successful');
          return aiParsedData;
        } else {
          console.log('AI parsing returned insufficient data, falling back to rule-based parsing');
        }
      }
    } catch (aiError) {
      console.warn('AI parsing failed, falling back to rule-based parsing:', aiError);
      // Continue with rule-based parsing
    }
    
    // Fallback to rule-based parsing
    console.log('Using rule-based parsing...');
    return parseResumeText(text);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error(`Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse resume text and extract structured data
 */
function parseResumeText(text: string): ParsedResumeData {
  const data: ParsedResumeData = {};
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = text.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    data.email = emailMatches[0];
  }

  // Extract phone (multiple formats)
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches && phoneMatches.length > 0) {
    data.phone = phoneMatches[0].replace(/\s+/g, ' ').trim();
  }

  // Extract LinkedIn URL
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/gi;
  const linkedinMatches = text.match(linkedinRegex);
  if (linkedinMatches && linkedinMatches.length > 0) {
    const linkedinUrl = linkedinMatches[0];
    data.linkedin_url = linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`;
  }

  // Extract Portfolio/Website URL (exclude common email domains and social media)
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;
  const portfolioMatches = text.match(portfolioRegex);
  if (portfolioMatches) {
    const filtered = portfolioMatches.filter(url => {
      const lowerUrl = url.toLowerCase();
      return !lowerUrl.includes('linkedin.com') && 
             !lowerUrl.includes('github.com') &&
             !lowerUrl.includes('gmail.com') &&
             !lowerUrl.includes('yahoo.com') &&
             !lowerUrl.includes('outlook.com') &&
             !lowerUrl.includes('hotmail.com') &&
             !lowerUrl.includes('email') &&
             !/\b[A-Za-z0-9._%+-]+@/.test(url);
    });
    if (filtered.length > 0) {
      const portfolioUrl = filtered[0];
      data.portfolio_url = portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`;
    }
  }

  // Extract name from header (usually first 1-2 lines)
  // Skip if it looks like email, phone, or URL
  const headerLines = lines.slice(0, 3);
  for (const line of headerLines) {
    if (!emailRegex.test(line) && 
        !phoneRegex.test(line) && 
        !linkedinRegex.test(line) &&
        !line.includes('://') &&
        line.length > 2 && 
        line.length < 100) {
      const nameParts = line.split(/\s+/);
      if (nameParts.length >= 2) {
        data.firstName = nameParts[0];
        data.lastName = nameParts.slice(1).join(' ');
        data.fullName = line;
        break;
      } else if (nameParts.length === 1 && nameParts[0].length > 1) {
        data.fullName = line;
        data.firstName = line;
        break;
      }
    }
  }

  // Extract location from header area
  const headerText = lines.slice(0, 5).join(' ');
  const location = extractLocation(headerText);
  if (location) {
    data.location = location;
  }

  // Extract current job title (look in first 10 lines)
  const titleKeywords = [
    'Engineer', 'Developer', 'Designer', 'Manager', 'Analyst',
    'Specialist', 'Consultant', 'Director', 'Lead', 'Senior',
    'Architect', 'Programmer', 'Coordinator', 'Executive'
  ];
  
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    // Skip header lines (name, contact info)
    if (i < 3) continue;
    
    // Check if line contains a title keyword and is reasonably short
    if (line.length > 5 && line.length < 100 && 
        titleKeywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(line)) &&
        !emailRegex.test(line) &&
        !phoneRegex.test(line)) {
      data.title = line;
      break;
    }
  }

  // Find and parse sections
  const experienceSection = findSection(text, [
    'experience', 'work experience', 'employment', 'work history', 
    'professional experience', 'employment history', 'career history',
    'work', 'positions', 'career', 'professional'
  ]);
  
  if (experienceSection) {
    const sectionText = text.substring(experienceSection.start, experienceSection.end);
    const experience = parseExperienceSection(sectionText);
    if (experience.length > 0) {
      data.experience = experience;
      // If we don't have a title yet, use the first experience entry's title
      if (!data.title && experience[0]?.title) {
        data.title = experience[0].title;
      }
    }
  } else {
    // Fallback: Try to find experience entries without explicit section header
    // Look for date patterns that might indicate work experience
    const textLines = text.split('\n');
    const experienceKeywords = ['engineer', 'developer', 'manager', 'analyst', 'specialist', 
                                'consultant', 'director', 'lead', 'senior', 'architect', 
                                'designer', 'coordinator', 'executive', 'assistant'];
    
    // Try to find blocks that look like experience entries
    let fallbackExperience: ParsedResumeData['experience'] = [];
    let currentBlock: string[] = [];
    
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i].trim();
      if (!line) continue;
      
      const dateRange = extractDateRange(line);
      const hasExperienceKeyword = experienceKeywords.some(kw => 
        line.toLowerCase().includes(kw.toLowerCase())
      );
      
      // If we find a date range or experience keyword, start collecting
      if (dateRange || (hasExperienceKeyword && line.length < 100 && /^[A-Z]/.test(line))) {
        if (currentBlock.length > 0) {
          // Parse the block we collected
          const blockText = currentBlock.join('\n');
          const parsed = parseExperienceSection(blockText);
          if (parsed.length > 0) {
            fallbackExperience.push(...parsed);
          }
          currentBlock = [];
        }
        currentBlock.push(line);
      } else if (currentBlock.length > 0 && currentBlock.length < 10) {
        // Continue collecting if we're in a block
        currentBlock.push(line);
      } else if (currentBlock.length >= 10) {
        // Parse and reset
        const blockText = currentBlock.join('\n');
        const parsed = parseExperienceSection(blockText);
        if (parsed.length > 0) {
          fallbackExperience.push(...parsed);
        }
        currentBlock = [];
      }
    }
    
    // Parse last block
    if (currentBlock.length > 0) {
      const blockText = currentBlock.join('\n');
      const parsed = parseExperienceSection(blockText);
      if (parsed.length > 0) {
        fallbackExperience.push(...parsed);
      }
    }
    
    if (fallbackExperience.length > 0) {
      data.experience = fallbackExperience;
      if (!data.title && fallbackExperience[0]?.title) {
        data.title = fallbackExperience[0].title;
      }
    }
  }

  const educationSection = findSection(text, [
    'education', 'academic', 'academic background', 'qualifications',
    'degree', 'degrees', 'university', 'college'
  ]);
  
  if (educationSection) {
    const sectionText = text.substring(educationSection.start, educationSection.end);
    const education = parseEducationSection(sectionText);
    if (education.length > 0) {
      data.education = education;
    }
  } else {
    // Fallback: Try to find education entries without explicit section header
    // Look for degree patterns and school names
    const textLines = text.split('\n');
    const degreePattern = /\b(Bachelor|Master|PhD|Doctorate|Associate|Diploma|Certificate|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|M\.?B\.?A\.?|Ph\.?D\.?)\b/i;
    const schoolPattern = /\b(University|College|Institute|School|Academy)\b/i;
    
    let fallbackEducation: ParsedResumeData['education'] = [];
    let currentBlock: string[] = [];
    
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i].trim();
      if (!line) continue;
      
      const hasDegree = degreePattern.test(line);
      const hasSchool = schoolPattern.test(line);
      const dateRange = extractDateRange(line);
      
      // If we find degree, school, or date range, start collecting
      if (hasDegree || (hasSchool && line.length < 150) || dateRange) {
        if (currentBlock.length > 0) {
          // Parse the block we collected
          const blockText = currentBlock.join('\n');
          const parsed = parseEducationSection(blockText);
          if (parsed.length > 0) {
            fallbackEducation.push(...parsed);
          }
          currentBlock = [];
        }
        currentBlock.push(line);
      } else if (currentBlock.length > 0 && currentBlock.length < 5) {
        // Continue collecting if we're in a block
        currentBlock.push(line);
      } else if (currentBlock.length >= 5) {
        // Parse and reset
        const blockText = currentBlock.join('\n');
        const parsed = parseEducationSection(blockText);
        if (parsed.length > 0) {
          fallbackEducation.push(...parsed);
        }
        currentBlock = [];
      }
    }
    
    // Parse last block
    if (currentBlock.length > 0) {
      const blockText = currentBlock.join('\n');
      const parsed = parseEducationSection(blockText);
      if (parsed.length > 0) {
        fallbackEducation.push(...parsed);
      }
    }
    
    if (fallbackEducation.length > 0) {
      data.education = fallbackEducation;
    }
  }

  const skillsSection = findSection(text, [
    'skills', 'technical skills', 'core competencies', 'competencies',
    'key skills', 'technologies', 'tools', 'expertise'
  ]);
  
  if (skillsSection) {
    const sectionText = text.substring(skillsSection.start, skillsSection.end);
    const skills = parseSkillsSection(sectionText);
    if (skills.length > 0) {
      data.skills = skills;
    }
  } else {
    // If no skills section, try to extract common skills from the entire text
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
      'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
      'HTML', 'CSS', 'SCSS', 'SASS', 'Tailwind', 'Bootstrap',
      'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git',
      'Agile', 'Scrum', 'Project Management', 'UI/UX', 'Design',
      'Machine Learning', 'AI', 'Data Science', 'Analytics'
    ];
    
    const foundSkills: string[] = [];
    const textLower = text.toLowerCase();
    for (const skill of commonSkills) {
      if (textLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }
    if (foundSkills.length > 0) {
      data.skills = foundSkills;
    }
  }

  const summarySection = findSection(text, [
    'summary', 'objective', 'about', 'profile', 'professional summary',
    'executive summary', 'career objective'
  ]);
  
  if (summarySection) {
    const sectionText = text.substring(summarySection.start, summarySection.end);
    const bio = parseSummarySection(sectionText);
    if (bio) {
      data.bio = bio;
    }
  }

  return data;
}



