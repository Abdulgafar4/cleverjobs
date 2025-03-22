
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Briefcase, User, Building, Plus, Settings, LogOut, 
  UserCircle, Home, ChevronRight, PlusCircle, ListFilter
} from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'jobseeker' | 'employer' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);
      
      // Get user type from metadata
      const userMetadata = session.user.user_metadata;
      if (userMetadata && userMetadata.user_type) {
        setUserType(userMetadata.user_type);
      } else {
        // If metadata doesn't contain user type, redirect to auth
        toast({
          title: "Error",
          description: "User type not found. Please sign up again.",
          variant: "destructive"
        });
        supabase.auth.signOut().then(() => {
          navigate('/auth');
        });
      }

      // Check if onboarding is completed
      if (userMetadata && !userMetadata.onboarding_completed) {
        navigate('/onboarding');
        return;
      }
      
      setLoading(false);
    }
    
    getUser();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-card shadow-md md:min-h-screen p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">JobBoard</h2>
          </div>
          
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </a>
            </Button>
            
            {userType === 'jobseeker' ? (
              <>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/jobs">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    My Profile
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/jobs/manage">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Manage Jobs
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/company/profile">
                    <Building className="mr-2 h-4 w-4" />
                    Company Profile
                  </a>
                </Button>
              </>
            )}
            
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {userType === 'jobseeker' 
                ? 'Your Job Search Dashboard' 
                : 'Employer Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {userType === 'jobseeker'
                ? `Welcome back, ${user.user_metadata.first_name || 'User'}! Track your job applications and find new opportunities.`
                : `Welcome back, ${user.user_metadata.company_name || 'Company'}! Manage your job listings and find great candidates.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {userType === 'jobseeker' ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Job Applications</CardTitle>
                    <CardDescription>Track your job application progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">Total applications</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/applications">
                        View Applications
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Saved Jobs</CardTitle>
                    <CardDescription>Jobs you've bookmarked for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">Saved jobs</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/saved-jobs">
                        View Saved Jobs
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Profile Completion</CardTitle>
                    <CardDescription>Improve your chances of getting hired</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">70%</div>
                    <p className="text-sm text-muted-foreground">Complete your profile to attract recruiters</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/profile">
                        Edit Profile
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Job Postings</CardTitle>
                    <CardDescription>Your currently listed jobs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">Active listings</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/jobs/manage">
                        Manage Listings
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Applicants</CardTitle>
                    <CardDescription>Candidates who applied to your jobs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">Total applicants</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/applicants">
                        View Applicants
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Company Profile</CardTitle>
                    <CardDescription>Manage your company information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">80%</div>
                    <p className="text-sm text-muted-foreground">Profile completion</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/company/profile">
                        Edit Profile
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>

          {userType === 'jobseeker' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recommended Jobs</h2>
                <Button variant="outline" size="sm" asChild>
                  <a href="/jobs">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter Jobs
                  </a>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Briefcase className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No job recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  We'll recommend jobs based on your profile and preferences
                </p>
                <Button asChild>
                  <a href="/jobs">Browse All Jobs</a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Post a New Job</h2>
                <Button variant="outline" size="sm" asChild>
                  <a href="/jobs/manage">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Manage Existing Jobs
                  </a>
                </Button>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                    <Plus className="h-12 w-12 text-primary/60 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Create a New Job Listing</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Start attracting qualified candidates by posting a job opening at your company
                    </p>
                    <Button asChild>
                      <a href="/jobs/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post New Job
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
