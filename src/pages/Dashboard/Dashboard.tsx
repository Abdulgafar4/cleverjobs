import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import { jobs, employerJobListings } from '@/lib/data';
import { 
  Briefcase, 
  Plus, 
  ChevronRight, 
  PlusCircle, 
  ListFilter,
  Bookmark,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  Users,
  Activity,
  Calendar,
  Target,
  Award,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Star,
  MapPin,
  Building2,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Calculate profile completion percentage based on filled fields
 * Returns a value between 0 and 100
 */
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

  // Calculate percentage, ensuring it's between 0 and 100
  if (totalFields === 0) return 0;
  const percentage = Math.round((completedFields / totalFields) * 100);
  return Math.min(100, Math.max(0, percentage));
};

const Dashboard = () => {
  const { user, userType, userMetadata, loading: userLoading } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if onboarding is completed
    if (!userMetadata?.onboarding_completed) {
      navigate('/onboarding');
      return;
    }

    // Calculate actual profile completion
    const profileCompletion = calculateProfileCompletion(userType, userMetadata);

    // Load dashboard data based on user type
    if (userType === 'jobseeker') {
      setDashboardData({
        totalApplications: 12,
        savedJobs: 8,
        profileCompletion,
        responseRate: 42,
        interviews: 3,
        recentApplications: [
          { id: '1', title: 'Senior Frontend Developer', company: 'TechCorp', status: 'under-review', date: '2 days ago' },
          { id: '2', title: 'UI/UX Designer', company: 'DesignHub', status: 'interview', date: '5 days ago' },
          { id: '3', title: 'Product Manager', company: 'GrowthCo', status: 'applied', date: '1 week ago' },
        ],
        recommendedJobs: jobs.slice(0, 3),
        activity: [
          { type: 'application', message: 'Applied to Senior Frontend Developer at TechCorp', time: '2 days ago' },
          { type: 'saved', message: 'Saved UI/UX Designer at DesignHub', time: '3 days ago' },
          { type: 'interview', message: 'Interview scheduled with GrowthCo', time: '5 days ago' },
        ],
        stats: {
          applicationsThisWeek: 5,
          applicationsLastWeek: 7,
          responseRate: 42,
          avgResponseTime: '3 days',
        }
      });
    } else if (userType === 'employer') {
      const activeJobs = employerJobListings.filter(job => job.status === 'active');
      const totalApplicants = employerJobListings.reduce((sum, job) => sum + job.applicants, 0);
      const avgApplicantsPerJob = activeJobs.length > 0 ? Math.round(totalApplicants / activeJobs.length) : 0;
      
      setDashboardData({
        activeJobs: activeJobs.length,
        totalApplicants: totalApplicants,
        profileCompletion,
        avgApplicantsPerJob: avgApplicantsPerJob,
        views: 1240,
        recentApplicants: [
          { id: '1', name: 'John Doe', job: 'Senior Frontend Developer', status: 'new', date: '1 hour ago' },
          { id: '2', name: 'Jane Smith', job: 'UI/UX Designer', status: 'reviewed', date: '3 hours ago' },
          { id: '3', name: 'Mike Johnson', job: 'Backend Engineer', status: 'interview', date: '1 day ago' },
        ],
        recentJobs: employerJobListings.slice(0, 3),
        activity: [
          { type: 'applicant', message: 'New applicant for Senior Frontend Developer', time: '1 hour ago' },
          { type: 'job', message: 'New job posted: DevOps Engineer', time: '2 days ago' },
          { type: 'view', message: 'Job views increased by 15%', time: '3 days ago' },
        ],
        stats: {
          applicantsThisWeek: 24,
          applicantsLastWeek: 18,
          viewsThisWeek: 340,
          viewsLastWeek: 285,
        }
      });
    }
  }, [user, userType, userMetadata, userLoading, navigate]);

  if (userLoading || !dashboardData) {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  const getUserDisplayName = () => {
    if (userMetadata?.first_name && userMetadata?.last_name) {
      return `${userMetadata.first_name} ${userMetadata.last_name}`;
    }
    if (userMetadata?.first_name) {
      return userMetadata.first_name;
    }
    if (userMetadata?.company_name) {
      return userMetadata.company_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {getUserDisplayName()}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                {userType === 'jobseeker' 
                  ? 'Here\'s what\'s happening with your job search'
                  : 'Here\'s an overview of your job postings and applicants'}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userType === 'jobseeker' ? (
          <>
            <StatCard
              title="Applications"
              value={dashboardData.totalApplications}
              change={+2}
              icon={<FileText className="h-5 w-5" />}
              description="Total applications"
              color="blue"
              onClick={() => navigate('/applications')}
            />
            <StatCard
              title="Saved Jobs"
              value={dashboardData.savedJobs}
              change={+3}
              icon={<Bookmark className="h-5 w-5" />}
              description="Jobs bookmarked"
              color="purple"
              onClick={() => navigate('/saved-jobs')}
            />
            <StatCard
              title="Response Rate"
              value={`${dashboardData.responseRate}%`}
              change={+5}
              icon={<TrendingUp className="h-5 w-5" />}
              description="Applications responded"
              color="green"
            />
            <StatCard
              title="Interviews"
              value={dashboardData.interviews}
              change={+1}
              icon={<MessageSquare className="h-5 w-5" />}
              description="Upcoming interviews"
              color="orange"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Active Jobs"
              value={dashboardData.activeJobs}
              change={+1}
              icon={<Briefcase className="h-5 w-5" />}
              description="Job postings"
              color="blue"
              onClick={() => navigate('/jobs/manage')}
            />
            <StatCard
              title="Total Applicants"
              value={dashboardData.totalApplicants}
              change={+12}
              icon={<Users className="h-5 w-5" />}
              description="All applicants"
              color="purple"
            />
            <StatCard
              title="Avg per Job"
              value={dashboardData.avgApplicantsPerJob}
              change={+3}
              icon={<Target className="h-5 w-5" />}
              description="Applicants per job"
              color="green"
            />
            <StatCard
              title="Total Views"
              value={dashboardData.views}
              change={+15}
              icon={<Eye className="h-5 w-5" />}
              description="Job views"
              color="orange"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Completion Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Profile Completion
                  </CardTitle>
                  <CardDescription>Complete your profile to increase your chances</CardDescription>
                </div>
                <Badge variant="outline" className="text-lg font-bold">
                  {dashboardData.profileCompletion}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={dashboardData.profileCompletion} className="h-3 mb-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {100 - dashboardData.profileCompletion}% remaining
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/settings">
                    Complete Profile
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Jobs / Recent Jobs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    {userType === 'jobseeker' ? 'Recommended for You' : 'Recent Job Postings'}
                  </CardTitle>
                  <CardDescription>
                    {userType === 'jobseeker' 
                      ? 'Jobs matching your profile and preferences'
                      : 'Your latest job postings'}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={userType === 'jobseeker' ? '/jobs' : '/jobs/manage'}>
                    View All
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userType === 'jobseeker' ? (
                  dashboardData.recommendedJobs && dashboardData.recommendedJobs.length > 0 ? (
                    dashboardData.recommendedJobs.map((job: any) => (
                      <JobItem key={job.id} job={job} userType={userType} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recommended jobs yet</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link to="/jobs">Browse Jobs</Link>
                      </Button>
                    </div>
                  )
                ) : (
                  dashboardData.recentJobs && dashboardData.recentJobs.length > 0 ? (
                    dashboardData.recentJobs.map((job: any) => (
                      <JobItem key={job.id} job={job} userType={userType} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No job postings yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate('/post-job')}>
                        Post Your First Job
                      </Button>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications / Applicants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {userType === 'jobseeker' ? 'Recent Applications' : 'Recent Applicants'}
                  </CardTitle>
                  <CardDescription>
                    {userType === 'jobseeker' 
                      ? 'Track your application status'
                      : 'Latest candidates who applied'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userType === 'jobseeker' ? (
                  dashboardData.recentApplications.map((app: any) => (
                    <ApplicationItem key={app.id} application={app} />
                  ))
                ) : (
                  dashboardData.recentApplicants.map((applicant: any) => (
                    <ApplicantItem key={applicant.id} applicant={applicant} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {userType === 'jobseeker' ? (
                <>
                  <Button className="w-full justify-start" asChild>
                    <Link to="/jobs">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Browse Jobs
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/settings">
                      <FileText className="mr-2 h-4 w-4" />
                      Update Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/saved-jobs">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Saved Jobs
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full justify-start" onClick={() => navigate('/post-job')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post New Job
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/jobs/manage">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Manage Jobs
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/companies/profile">
                      <Building2 className="mr-2 h-4 w-4" />
                      Company Profile
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.activity.map((item: any, index: number) => (
                  <ActivityItem key={index} activity={item} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userType === 'jobseeker' ? (
                <>
                  <StatRow
                    label="Applications This Week"
                    value={dashboardData.stats.applicationsThisWeek}
                    change={dashboardData.stats.applicationsThisWeek - dashboardData.stats.applicationsLastWeek}
                  />
                  <StatRow
                    label="Avg Response Time"
                    value={dashboardData.stats.avgResponseTime}
                  />
                </>
              ) : (
                <>
                  <StatRow
                    label="Applicants This Week"
                    value={dashboardData.stats.applicantsThisWeek}
                    change={dashboardData.stats.applicantsThisWeek - dashboardData.stats.applicantsLastWeek}
                  />
                  <StatRow
                    label="Views This Week"
                    value={dashboardData.stats.viewsThisWeek}
                    change={dashboardData.stats.viewsThisWeek - dashboardData.stats.viewsLastWeek}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
  onClick?: () => void;
}

const StatCard = ({ title, value, change, icon, description, color, onClick }: StatCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-600 dark:text-purple-400',
    green: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-600 dark:text-green-400',
    orange: 'from-orange-500/10 to-orange-500/5 border-orange-500/20 text-orange-600 dark:text-orange-400',
  };

  return (
    <Card 
      className={cn(
        "border bg-gradient-to-br cursor-pointer hover:shadow-lg transition-all duration-300",
        colorClasses[color],
        onClick && "hover:scale-105"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={cn("p-2 rounded-lg bg-current/10", colorClasses[color])}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              change > 0 ? "text-green-600" : "text-red-600"
            )}>
              {change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Job Item Component
interface JobItemProps {
  job: any;
  userType: 'jobseeker' | 'employer' | null;
}

const JobItem = ({ job, userType }: JobItemProps) => {
  const jobUrl = userType === 'jobseeker' ? `/jobs/${job.id}` : `/jobs/${job.id}`;
  
  return (
    <Link to={jobUrl}>
      <div className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold group-hover:text-primary transition-colors">
            {job.title || job.name}
          </h4>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {job.salary}
              </span>
            )}
            {job.type && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.type}
              </span>
            )}
            {userType === 'employer' && job.applicants !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {job.applicants} applicants
              </span>
            )}
            {userType === 'employer' && job.status && (
              <Badge variant="outline" className="text-xs">
                {job.status}
              </Badge>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
};

// Application Item Component
interface ApplicationItemProps {
  application: any;
}

const ApplicationItem = ({ application }: ApplicationItemProps) => {
  const statusColors = {
    'applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'under-review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'accepted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold">{application.title}</h4>
          <Badge className={cn("text-xs", statusColors[application.status as keyof typeof statusColors] || statusColors.applied)}>
            {application.status.replace('-', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{application.company}</p>
        <p className="text-xs text-muted-foreground mt-1">{application.date}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

// Applicant Item Component
interface ApplicantItemProps {
  applicant: any;
}

const ApplicantItem = ({ applicant }: ApplicantItemProps) => {
  const statusColors = {
    'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'reviewed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'hired': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold">{applicant.name}</h4>
          <Badge className={cn("text-xs", statusColors[applicant.status as keyof typeof statusColors] || statusColors.new)}>
            {applicant.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{applicant.job}</p>
        <p className="text-xs text-muted-foreground mt-1">{applicant.date}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

// Activity Item Component
interface ActivityItemProps {
  activity: any;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const icons = {
    application: <FileText className="h-4 w-4" />,
    saved: <Bookmark className="h-4 w-4" />,
    interview: <MessageSquare className="h-4 w-4" />,
    applicant: <Users className="h-4 w-4" />,
    job: <Briefcase className="h-4 w-4" />,
    view: <Eye className="h-4 w-4" />,
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icons[activity.type as keyof typeof icons] || <Activity className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{activity.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

// Stat Row Component
interface StatRowProps {
  label: string;
  value: string | number;
  change?: number;
}

const StatRow = ({ label, value, change }: StatRowProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{value}</span>
        {change !== undefined && (
          <span className={cn(
            "text-xs",
            change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-muted-foreground"
          )}>
            {change > 0 ? '+' : ''}{change}
          </span>
        )}
      </div>
    </div>
  );
};

export default Dashboard;