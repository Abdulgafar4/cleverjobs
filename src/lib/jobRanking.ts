import type { Job } from '@/lib/data';

type UserMeta = {
  title?: string;
  skills?: string[];
  location?: string;
  preferences?: {
    jobType?: string[];
    remote?: boolean;
    salary?: { min?: number; max?: number };
  };
};

/**
 * Normalize text for comparison
 */
const normalize = (s?: string): string => (s || '').toLowerCase().trim();

/**
 * Tokenize text into words
 */
const tokenize = (s?: string): string[] => {
  if (!s) return [];
  return normalize(s)
    .split(/[\s,\/\-]+/)
    .filter(Boolean)
    .filter(w => w.length > 2); // Filter out very short words
};

/**
 * Compute match score between user profile and job
 * Returns a score from 0-100
 */
export function computeJobScore(user: UserMeta, job: Job): number {
  let score = 0;

  // 1) Skill overlap (max ~60 points)
  const userSkills = new Set((user.skills || []).map(normalize));
  const jobText = `${job.title} ${job.description} ${job.requirements?.join(' ') || ''}`.toLowerCase();
  const jobTokens = new Set(tokenize(jobText));
  
  const skillOverlap = [...userSkills].filter(skill => {
    // Check if skill appears in job text (exact or partial match)
    return jobTokens.has(skill) || 
           Array.from(jobTokens).some(token => token.includes(skill) || skill.includes(token));
  }).length;
  
  const skillScore = Math.min(60, skillOverlap * 12); // ~12 points per matching skill
  score += skillScore;

  // 2) Title similarity (max ~20 points)
  if (user.title) {
    const userTitleTokens = tokenize(user.title);
    const jobTitleTokens = tokenize(job.title);
    
    // Check for keyword matches (e.g., "developer", "engineer", "manager")
    const titleOverlap = userTitleTokens.filter(token => 
      jobTitleTokens.some(jobToken => 
        token === jobToken || 
        token.includes(jobToken) || 
        jobToken.includes(token)
      )
    ).length;
    
    score += Math.min(20, titleOverlap * 7);
  }

  // 3) Location affinity (max ~15 points)
  if (user.location) {
    const userLoc = normalize(user.location);
    const jobLoc = normalize(job.location);
    
    // Exact match or contains
    if (userLoc === jobLoc || jobLoc.includes(userLoc) || userLoc.includes(jobLoc)) {
      score += 15;
    } else if (/remote/i.test(jobLoc) || /remote/i.test(job.description)) {
      // Remote jobs get partial points if user location is set
      score += 8;
    }
  } else {
    // If no user location, favor remote jobs
    if (/remote/i.test(job.location) || /remote/i.test(job.description)) {
      score += 10;
    }
  }

  // 4) Job type preference (max ~5 points)
  if (user.preferences?.jobType?.length) {
    const preferredTypes = user.preferences.jobType.map(normalize);
    if (preferredTypes.includes(normalize(job.type))) {
      score += 5;
    }
  }

  return Math.min(100, Math.round(score));
}

/**
 * Check if job is eligible for user (basic filters)
 */
export function eligibleForUser(user: UserMeta, job: Job): boolean {
  // Basic eligibility - can be expanded later
  // For now, all jobs are eligible unless explicitly filtered out
  
  // Check remote preference
  if (user.preferences?.remote === true && !/remote/i.test(job.location) && !/remote/i.test(job.description)) {
    // User wants remote only, but job is not remote
    return false;
  }
  
  return true;
}

/**
 * Rank and filter jobs for a user
 */
export function rankJobsForUser(
  jobs: Job[],
  user: UserMeta,
  options: {
    minScore?: number;
    limit?: number;
  } = {}
): Job[] {
  const { minScore = 20, limit } = options;
  
  const scored = jobs
    .filter(job => eligibleForUser(user, job))
    .map(job => ({
      job,
      score: computeJobScore(user, job)
    }))
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .map(item => item.job);
  
  return limit ? scored.slice(0, limit) : scored;
}

/**
 * Generate suggested search terms from user profile
 */
export function generateSuggestedSearches(user: UserMeta): string[] {
  const suggestions: string[] = [];
  
  if (user.title) {
    suggestions.push(user.title);
  }
  
  if (user.skills && user.skills.length > 0) {
    // Add top skills as suggestions
    const topSkills = user.skills.slice(0, 3);
    topSkills.forEach(skill => {
      suggestions.push(`${skill} developer`);
      suggestions.push(`${skill} engineer`);
    });
  }
  
  if (user.location) {
    suggestions.push(`Remote ${user.title || 'jobs'}`);
    suggestions.push(`${user.location} jobs`);
  } else {
    suggestions.push('Remote jobs');
  }
  
  // Remove duplicates and limit
  return [...new Set(suggestions)].slice(0, 5);
}

