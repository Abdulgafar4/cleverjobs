import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { jobs, employerJobListings } from '@/lib/data';
import { 
  Briefcase, 
  ChevronRight, 
  PlusCircle, 
  Bookmark,
  FileText,
  TrendingUp,
  Clock,
  Eye,
  Users,
  Activity,
  Target,
  Award,
  MessageSquare,
  Sparkles,
  Zap,
  MapPin,
  Building2,
  HelpCircle,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateProfileCompletion } from './utils';
import { StatCard } from './components/StatCard';
import { JobItem } from './components/JobItem';
import { ApplicationItem } from './components/ApplicationItem';
import { ApplicantItem } from './components/ApplicantItem';
import { StatRow } from './components/StatRow';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import JobCardSkeleton from '@/components/JobCardSkeleton';
import { rankJobsForUser, generateSuggestedSearches } from '@/lib/jobRanking';
import { SuggestedChips } from './components/SuggestedChips';
import { QuickActions } from './components/QuickActions';
import { SuggestedSearches } from './components/SuggestedSearches';
import { RecentActivity } from './components/RecentActivity';

const Dashboard = () => {
  const { user, userType, userMetadata, loading: userLoading } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [personalized, setPersonalized] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [displayedJobs, setDisplayedJobs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
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
      // Set default personalization based on profile completeness
      const hasProfileData = !!(userMetadata?.skills?.length || userMetadata?.title);
      setPersonalized(hasProfileData);
      
      setDashboardData({
        totalApplications: 12,
        savedJobs: 8,
        profileCompletion,
        responseRate: 42,
        interviews: 3,
        recentApplications: [
          { id: '1', title: 'Senior Frontend Developer', company: 'TechCorp', status: 'under-review', date: '2 days ago', time: '2 days ago' },
          { id: '2', title: 'UI/UX Designer', company: 'DesignHub', status: 'interview', date: '5 days ago', time: '5 days ago' },
          { id: '3', title: 'Product Manager', company: 'GrowthCo', status: 'applied', date: '1 week ago', time: '1 week ago' },
        ],
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

  // Load and rank jobs for jobseekers
  useEffect(() => {
    if (userType !== 'jobseeker' || !dashboardData) return;

    setIsLoadingJobs(true);
    
    // Simulate async operation
    setTimeout(() => {
      let filteredJobs = [...jobs];
      
      // Apply search filters
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(queryLower) ||
          job.company.toLowerCase().includes(queryLower) ||
          job.description.toLowerCase().includes(queryLower)
        );
      }
      
      if (searchLocation && searchLocation !== 'any') {
        filteredJobs = filteredJobs.filter(job =>
          job.location.toLowerCase().includes(searchLocation.toLowerCase())
        );
      }
      
      if (searchType && searchType !== 'any') {
        filteredJobs = filteredJobs.filter(job => job.type === searchType);
      }
      
      // Apply personalization if enabled and user has profile data
      if (personalized && (userMetadata?.skills?.length || userMetadata?.title)) {
        const ranked = rankJobsForUser(filteredJobs, userMetadata || {}, {
          minScore: 20,
          limit: 15
        });
        setDisplayedJobs(ranked.length > 0 ? ranked : filteredJobs.slice(0, 15));
      } else {
        // Show recent jobs if not personalized
        setDisplayedJobs(filteredJobs.slice(0, 15));
      }
      
      setIsLoadingJobs(false);
    }, 300);
  }, [userType, dashboardData, personalized, userMetadata, searchQuery, searchLocation, searchType]);

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

  const handleSearch = (values: { query: string; location: string; type: string }) => {
    setSearchQuery(values.query);
    setSearchLocation(values.location);
    setSearchType(values.type);
  };

  const handleChipClick = (term: string) => {
    setSearchQuery(term);
    // Trigger search
    handleSearch({ query: term, location: searchLocation, type: searchType });
  };

  const handleSuggestedSearchClick = (query: string) => {
    setSearchQuery(query);
    handleSearch({ query, location: searchLocation, type: searchType });
  };

  // Generate suggested chips and searches
  const suggestedChips = userMetadata ? generateSuggestedSearches(userMetadata).slice(0, 5) : [];
  const suggestedSearches = userMetadata ? generateSuggestedSearches(userMetadata) : [];

  // Render jobseeker dashboard
  if (userType === 'jobseeker') {
    const hasProfileData = !!(userMetadata?.skills?.length || userMetadata?.title);
    
    return (
      <main className="min-h-screen">
        {/* Top Section with Search */}
        <div className="pt-28 pb-8 bg-secondary/30">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Welcome back, {getUserDisplayName()}
                </h1>
                <p className="text-muted-foreground">
                  {displayedJobs.length > 0 
                    ? `${displayedJobs.length} job${displayedJobs.length !== 1 ? 's' : ''} matched your profile`
                    : 'Discover your next opportunity'}
                </p>
              </div>
              {/* Quick Stats Links */}
              <div className="hidden md:flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link to="/applications" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{dashboardData?.totalApplications || 0} Applications</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link to="/saved" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span>{dashboardData?.savedJobs || 0} Saved</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar
                variant="inline"
                initialValues={{
                  query: searchQuery,
                  location: searchLocation,
                  type: searchType
                }}
                onSearch={handleSearch}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Switch
                    id="personalize"
                    checked={personalized}
                    onCheckedChange={setPersonalized}
                    disabled={!hasProfileData}
                  />
                  <Label htmlFor="personalize" className="text-sm cursor-pointer">
                    Personalized matches
                  </Label>
                </div>
                {!hasProfileData && (
                  <Badge variant="outline" className="text-xs">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload resume to enable
                  </Badge>
                )}
              </div>
              
              {/* Suggested Chips */}
              {hasProfileData && suggestedChips.length > 0 && (
                <SuggestedChips
                  suggestions={suggestedChips}
                  onChipClick={handleChipClick}
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Job Feed - Main Focus */}
            <div className="lg:col-span-3">
              {/* Empty State - No Profile */}
              {!hasProfileData && (
                <Card className="mb-6 border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Upload className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Get personalized job matches</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Upload your resume and we'll show you jobs that match your skills and experience.
                        </p>
                        <Button size="sm" asChild>
                          <Link to="/profile">Upload Resume</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Job Feed */}
              {isLoadingJobs ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : displayedJobs.length > 0 ? (
                <div className="space-y-4">
                  {displayedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                  <div className="pt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link to="/jobs">
                        Browse All Jobs
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search or filters
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm" onClick={() => {
                          setSearchQuery('');
                          setSearchLocation('');
                          setSearchType('');
                        }}>
                          Clear Search
                        </Button>
                        {personalized && (
                          <Button variant="outline" size="sm" onClick={() => setPersonalized(false)}>
                            Show All Jobs
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActions />
              
              {/* Suggested Searches */}
              {suggestedSearches.length > 0 && (
                <SuggestedSearches
                  searches={suggestedSearches}
                  onSearchClick={handleSuggestedSearchClick}
                />
              )}
              
              {/* Recent Activity */}
              {dashboardData?.activity && (
                <RecentActivity activities={dashboardData.activity} />
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Employer dashboard (existing)
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

// component implementations moved to ./components/*

export default Dashboard;