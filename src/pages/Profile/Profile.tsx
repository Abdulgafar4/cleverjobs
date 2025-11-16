import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ResumeUpload from '@/components/ResumeUpload';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Globe,
  Linkedin,
  ExternalLink,
  Edit,
  Award,
  FileText,
  Users,
  Sparkles,
  Globe as Portfolio,
  GraduationCap,
  Share2,
  Printer,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Calculate profile completion
const calculateProfileCompletion = (userType: 'jobseeker' | 'employer' | null, userMetadata: any): number => {
  if (!userType || !userMetadata) return 0;

  let completedFields = 0;
  let totalFields = 0;

  const isFieldFilled = (value: any, isArray: boolean = false, isBoolean: boolean = false, isObjectArray: boolean = false): boolean => {
    // Handle undefined or null
    if (value === undefined || value === null) {
      return false;
    }
    
    if (isBoolean) {
      return value === true;
    }
    
    // For arrays of objects (like experience, education)
    if (isObjectArray) {
      return Array.isArray(value) && value.length > 0 && value.some((item: any) => {
        // Check if at least one item has meaningful data
        if (typeof item === 'object' && item !== null) {
          // For experience: check if it has title or company
          if (item.title || item.company) return true;
          // For education: check if it has degree or school
          if (item.degree || item.school) return true;
        }
        return false;
      });
    }
    
    if (isArray) {
      return Array.isArray(value) && value.length > 0;
    }
    
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Check if it's a valid URL format
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed.length > 10; // Minimum valid URL length
      }
      return trimmed.length > 0;
    }
    
    // For other types, check if truthy
    return !!value;
  };

  type FieldDefinition = {
    key: string;
    weight: number;
    isArray?: boolean;
    isBoolean?: boolean;
    isObjectArray?: boolean;
  };

  if (userType === 'jobseeker') {
    // Required fields - Basic info (25 points total)
    const requiredFields: FieldDefinition[] = [
      { key: 'first_name', weight: 8 },
      { key: 'last_name', weight: 8 },
      { key: 'title', weight: 9 },
    ];

    // Essential resume fields - Professional Summary, Skills, Experience, Education (50 points total)
    const essentialFields: FieldDefinition[] = [
      { key: 'bio', weight: 15 }, // Professional Summary
      { key: 'skills', weight: 15, isArray: true }, // Skills
      { key: 'experience', weight: 10, isObjectArray: true }, // Work Experience
      { key: 'education', weight: 10, isObjectArray: true }, // Education
    ];

    // Additional fields - Contact and location (15 points total)
    const additionalFields: FieldDefinition[] = [
      { key: 'location', weight: 8 },
      { key: 'phone', weight: 7 },
    ];

    // Optional fields - Social links (10 points total)
    // NOTE: onboarding_completed should NOT count toward completion percentage
    const optionalFields: FieldDefinition[] = [
      { key: 'linkedin_url', weight: 5 },
      { key: 'portfolio_url', weight: 5 },
    ];

    // Check required fields
    requiredFields.forEach(field => {
      totalFields += field.weight;
      const value = userMetadata[field.key];
      if (isFieldFilled(value, false, false, false)) {
        completedFields += field.weight;
      }
    });

    // Check essential fields (Professional Summary, Skills, Experience, Education)
    essentialFields.forEach(field => {
      totalFields += field.weight;
      const value = userMetadata[field.key];
      if (isFieldFilled(value, field.isArray || false, field.isBoolean || false, field.isObjectArray || false)) {
        completedFields += field.weight;
      }
    });

    // Check additional fields
    additionalFields.forEach(field => {
      totalFields += field.weight;
      const value = userMetadata[field.key];
      if (isFieldFilled(value, field.isArray || false, field.isBoolean || false, field.isObjectArray || false)) {
        completedFields += field.weight;
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      totalFields += field.weight;
      const value = userMetadata[field.key];
      if (isFieldFilled(value, field.isArray || false, field.isBoolean || false, field.isObjectArray || false)) {
        completedFields += field.weight;
      }
    });
  } else if (userType === 'employer') {
    // Required fields - Basic company info (30 points total)
    // NOTE: onboarding_completed should NOT count toward completion percentage
    const requiredFields: FieldDefinition[] = [
      { key: 'company_name', weight: 30 },
    ];

    // Important fields - Company details (50 points total)
    const importantFields: FieldDefinition[] = [
      { key: 'industry', weight: 20 },
      { key: 'company_description', weight: 20 },
      { key: 'location', weight: 10 },
    ];

    // Optional fields - Additional info (20 points total)
    const optionalFields: FieldDefinition[] = [
      { key: 'company_website', weight: 10 },
      { key: 'company_size', weight: 5 },
      { key: 'phone', weight: 5 },
    ];

    // Check required fields
    requiredFields.forEach(field => {
      totalFields += field.weight;
      const value = userMetadata[field.key];
      if (isFieldFilled(value, false, false)) {
        completedFields += field.weight;
      }
    });

    // Check important fields
    importantFields.forEach(field => {
      totalFields += field.weight;
      const value = userMetadata[field.key];
      if (isFieldFilled(value, false, false)) {
        completedFields += field.weight;
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      totalFields += field.weight;
      const value = userMetadata[field.key];
      if (isFieldFilled(value, false, false)) {
        completedFields += field.weight;
      }
    });
  }

  if (totalFields === 0) return 0;
  const percentage = Math.round((completedFields / totalFields) * 100);
  return Math.min(100, Math.max(0, percentage));
};

const Profile = () => {
  const { user, userType, userMetadata, loading: userLoading, isAuthenticated, refresh } = useUser();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewingOwnProfile, setViewingOwnProfile] = useState(true);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [profileUserMetadata, setProfileUserMetadata] = useState<any>(null);
  const [profileUserType, setProfileUserType] = useState<'jobseeker' | 'employer' | null>(null);

  useEffect(() => {
    if (userLoading) return;

    // If viewing someone else's profile (via ID)
    if (id && id !== user?.id) {
      setViewingOwnProfile(false);
      // In a real app, you would fetch the profile user data here
      // For now, we'll just show the current user's profile
    } else {
      setViewingOwnProfile(true);
      setProfileUser(user);
      setProfileUserMetadata(userMetadata);
      setProfileUserType(userType);
    }

    // Redirect to auth if not logged in and viewing own profile
    if (!user && !id) {
      navigate('/auth');
      return;
    }
  }, [user, userMetadata, userType, userLoading, navigate, id]);

  if (userLoading || !profileUser) {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  const getUserDisplayName = () => {
    const metadata = profileUserMetadata || userMetadata;
    if (metadata?.first_name && metadata?.last_name) {
      return `${metadata.first_name} ${metadata.last_name}`;
    }
    if (metadata?.first_name) {
      return metadata.first_name;
    }
    if (metadata?.company_name) {
      return metadata.company_name;
    }
    return profileUser?.email?.split('@')[0] || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const metadata = profileUserMetadata || userMetadata;
    if (metadata?.first_name && metadata?.last_name) {
      return `${metadata.first_name[0]}${metadata.last_name[0]}`.toUpperCase();
    }
    if (metadata?.first_name) {
      return metadata.first_name[0].toUpperCase();
    }
    if (metadata?.company_name) {
      return metadata.company_name[0].toUpperCase();
    }
    if (profileUser?.email || user?.email) {
      return (profileUser?.email || user?.email)?.[0].toUpperCase() || 'U';
    }
    return 'U';
  };

  const currentMetadata = profileUserMetadata || userMetadata;
  const currentUserType = profileUserType || userType;
  const currentUser = profileUser || user;
  const profileCompletion = calculateProfileCompletion(currentUserType, currentMetadata);

  const handleResumeUploadComplete = async () => {
    // Refresh user data after resume upload
    if (refresh) {
      await refresh();
    }
    // Update local state after refresh
    setTimeout(() => {
      if (user && userMetadata) {
        setProfileUser(user);
        setProfileUserMetadata(userMetadata);
      }
    }, 500);
  };

  // Resume-style layout for jobseekers
  if (currentUserType === 'jobseeker') {
    return (
      <main className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Resume Upload Section (only for own profile) */}
          {viewingOwnProfile && (
            <div className="mb-6 no-print">
              <ResumeUpload onUpdateComplete={handleResumeUploadComplete} />
            </div>
          )}

          {/* Resume Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 mb-6 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-8 py-10 border-b border-border/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6 flex-1">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={currentMetadata?.avatar_url} alt={getUserDisplayName()} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 pt-2">
                    <h1 className="text-4xl font-bold mb-2 text-foreground">
                      {getUserDisplayName()}
                    </h1>
                    {currentMetadata?.title && (
                      <p className="text-xl text-muted-foreground mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        {currentMetadata.title}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {currentMetadata?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{currentMetadata.location}</span>
                        </div>
                      )}
                      {currentUser?.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{currentUser.email}</span>
                        </div>
                      )}
                      {currentMetadata?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{currentMetadata.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {viewingOwnProfile && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2 no-print" asChild>
                    <Link to="/settings">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(currentMetadata?.linkedin_url || currentMetadata?.portfolio_url) && (
              <div className="px-8 py-4 bg-muted/30 border-b border-border/50">
                <div className="flex items-center gap-4">
                  {currentMetadata?.linkedin_url && (
                    <a
                      href={currentMetadata.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {currentMetadata?.portfolio_url && (
                    <a
                      href={currentMetadata.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Portfolio className="h-4 w-4" />
                      Portfolio
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Resume Content */}
            <div className="px-8 py-8 space-y-8">
              {/* Professional Summary */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground border-b-2 border-primary/30 pb-2">
                  Professional Summary
                </h2>
                {currentMetadata?.bio ? (
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {currentMetadata.bio}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    {viewingOwnProfile 
                      ? 'Add a professional summary to help employers understand your background and goals.'
                      : 'No professional summary available.'}
                  </p>
                )}
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground border-b-2 border-primary/30 pb-2">
                  Skills & Expertise
                </h2>
                {currentMetadata?.skills && currentMetadata.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentMetadata.skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm px-3 py-1.5 bg-primary/10 text-primary border-primary/30 font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    {viewingOwnProfile 
                      ? 'Add your skills to showcase your expertise to employers.'
                      : 'No skills listed.'}
                  </p>
                )}
              </section>

              {/* Experience Section */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground border-b-2 border-primary/30 pb-2">
                  Work Experience
                </h2>
                {currentMetadata?.experience && currentMetadata.experience.length > 0 ? (
                  <div className="space-y-6">
                    {currentMetadata.experience.map((exp: any, index: number) => (
                      <div key={index} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                            <p className="text-base font-medium text-primary">{exp.company}</p>
                          </div>
                          {exp.period && (
                            <span className="text-sm text-muted-foreground whitespace-nowrap">{exp.period}</span>
                          )}
                        </div>
                        {exp.location && (
                          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                        )}
                        {exp.achievements && Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                            {exp.achievements.map((achievement: string, idx: number) => (
                              <li key={idx}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    {viewingOwnProfile 
                      ? 'Add your work experience to showcase your professional background and achievements.'
                      : 'No work experience listed.'}
                  </p>
                )}
              </section>

              {/* Education Section */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground border-b-2 border-primary/30 pb-2">
                  Education
                </h2>
                {currentMetadata?.education && currentMetadata.education.length > 0 ? (
                  <div className="space-y-5">
                    {currentMetadata.education.map((edu: any, index: number) => (
                      <div key={index} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                            <p className="text-base text-primary font-medium">{edu.school}</p>
                          </div>
                          {edu.period && (
                            <span className="text-sm text-muted-foreground whitespace-nowrap">{edu.period}</span>
                          )}
                        </div>
                        {edu.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {edu.location}
                          </p>
                        )}
                        {edu.gpa && (
                          <p className="text-sm text-muted-foreground mt-1">GPA: {edu.gpa}</p>
                        )}
                        {edu.honors && (
                          <p className="text-sm text-muted-foreground mt-1 italic">{edu.honors}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    {viewingOwnProfile 
                      ? 'Add your education details including degrees, certifications, and academic achievements.'
                      : 'No education information available.'}
                  </p>
                )}
              </section>

              {/* Profile Completion (only for own profile) */}
              {viewingOwnProfile && (
                <section className="bg-muted/30 rounded-lg p-6 border border-border/50 no-print">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Profile Completion</h3>
                    </div>
                    <Badge variant="outline" className="text-lg font-bold">
                      {profileCompletion}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 mb-4">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete your profile to increase your visibility to employers. {100 - profileCompletion}% remaining.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/settings">
                      Complete Profile
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </section>
              )}
            </div>
          </div>

          {/* Action Buttons (only for own profile) */}
          {viewingOwnProfile && (
            <div className="flex items-center justify-center gap-4 mt-6 no-print">
              <Button variant="outline" asChild>
                <Link to="/settings">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print Resume
              </Button>
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    const profileUrl = window.location.href;
                    await navigator.clipboard.writeText(profileUrl);
                    toast({
                      title: "Profile link copied!",
                      description: "Share this link with employers or others",
                    });
                  } catch (error) {
                    toast({
                      title: "Failed to copy link",
                      description: "Please try again",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Company Profile Layout for Employers
  return (
    <main className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-border/50 mb-6 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-8 py-10 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6 flex-1">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-white shadow-lg flex items-center justify-center">
                    {currentMetadata?.logo ? (
                      <img
                        src={currentMetadata.logo}
                        alt={getUserDisplayName()}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-full shadow-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h1 className="text-4xl font-bold mb-2 text-foreground">
                    {getUserDisplayName()}
                  </h1>
                  {currentMetadata?.industry && (
                    <p className="text-xl text-muted-foreground mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {currentMetadata.industry}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {currentMetadata?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{currentMetadata.location}</span>
                      </div>
                    )}
                    {currentMetadata?.company_size && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{currentMetadata.company_size} employees</span>
                      </div>
                    )}
                    {currentUser?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{currentUser.email}</span>
                      </div>
                    )}
                    {currentMetadata?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{currentMetadata.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {viewingOwnProfile && (
                <Button variant="outline" size="sm" className="flex items-center gap-2 no-print" asChild>
                  <Link to="/settings">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Company Links */}
          {currentMetadata?.company_website && (
            <div className="px-8 py-4 bg-muted/30 border-b border-border/50">
              <div className="flex items-center gap-4">
                <a
                  href={currentMetadata.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Company Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Company Content */}
          <div className="px-8 py-8 space-y-8">
            {/* About Company */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground border-b-2 border-primary/30 pb-2">
                About Company
              </h2>
              {currentMetadata?.company_description ? (
                <p className="text-muted-foreground leading-relaxed text-base">
                  {currentMetadata.company_description}
                </p>
              ) : (
                <p className="text-muted-foreground italic text-sm">
                  {viewingOwnProfile 
                    ? 'Add a company description to help candidates learn more about your organization.'
                    : 'No company description available.'}
                </p>
              )}
            </section>

            {/* Company Details */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground border-b-2 border-primary/30 pb-2">
                Company Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentMetadata?.industry && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Industry</p>
                    <p className="text-lg font-semibold">{currentMetadata.industry}</p>
                  </div>
                )}
                {currentMetadata?.company_size && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Company Size</p>
                    <p className="text-lg font-semibold">{currentMetadata.company_size}</p>
                  </div>
                )}
                {currentMetadata?.location && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {currentMetadata.location}
                    </p>
                  </div>
                )}
                {currentMetadata?.company_website && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Website</p>
                    <a
                      href={currentMetadata.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-primary hover:underline flex items-center gap-2"
                    >
                      {currentMetadata.company_website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Profile Completion (only for own profile) */}
            {viewingOwnProfile && (
              <section className="bg-muted/30 rounded-lg p-6 border border-border/50 no-print">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Profile Completion</h3>
                  </div>
                  <Badge variant="outline" className="text-lg font-bold">
                    {profileCompletion}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-3 mb-4">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your company profile to attract more candidates. {100 - profileCompletion}% remaining.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/settings">
                    Complete Profile
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </section>
            )}
          </div>
        </div>

        {/* Action Buttons (only for own profile) */}
        {viewingOwnProfile && (
          <div className="flex items-center justify-center gap-4 mt-6 no-print">
            <Button variant="outline" asChild>
              <Link to="/settings">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/post-job">
                <Briefcase className="mr-2 h-4 w-4" />
                Post a Job
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
