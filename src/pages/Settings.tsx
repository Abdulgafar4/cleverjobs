import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Briefcase, User, Building, Settings as SettingsIcon, 
  Bell, Lock, Palette, Home, LogOut, Moon, Sun, Monitor,
  UserCircle, Check, Upload, Shield, HelpCircle
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Toggle } from '@/components/ui/toggle';
import AnimatedTransition from '@/components/AnimatedTransition';

const themes = [
  { name: "default", label: "Default", primaryColor: "#9b87f5", bgClass: "bg-primary" },
  { name: "blue", label: "Blue", primaryColor: "#0ea5e9", bgClass: "bg-blue-500" },
  { name: "green", label: "Green", primaryColor: "#22c55e", bgClass: "bg-green-500" },
  { name: "orange", label: "Orange", primaryColor: "#f97316", bgClass: "bg-orange-500" },
  { name: "pink", label: "Pink", primaryColor: "#d946ef", bgClass: "bg-pink-500" },
];

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'jobseeker' | 'employer' | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [applicationAlerts, setApplicationAlerts] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);
      
      const userMetadata = session.user.user_metadata;
      if (userMetadata) {
        setUserType(userMetadata.user_type);
        setFirstName(userMetadata.first_name || "");
        setLastName(userMetadata.last_name || "");
        setCompany(userMetadata.company_name || "");
      } else {
        toast({
          title: "Error",
          description: "User type not found. Please sign up again.",
          variant: "destructive"
        });
        supabase.auth.signOut().then(() => {
          navigate('/auth');
        });
      }
      
      setLoading(false);
    }
    
    getUser();
  }, [navigate, toast]);

  const saveProfile = () => {
    toast({
      title: "Profile saved",
      description: "Your profile has been updated successfully",
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  const changePassword = () => {
    toast({
      title: "Reset email sent",
      description: "Check your email for a password reset link",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-64 space-y-6">
              <Card className="sticky top-20">
                <CardContent className="p-0">
                  <div className="p-6 flex flex-col items-center text-center border-b">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <UserCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-medium">{userType === 'jobseeker' ? `${firstName} ${lastName}` : company}</h3>
                    <p className="text-sm text-muted-foreground">
                      {userType === 'jobseeker' ? jobTitle || 'Job Seeker' : 'Employer'}
                    </p>
                  </div>
                  
                  <nav className="p-2">
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      
                      {userType === 'jobseeker' ? (
                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/jobs')}>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Browse Jobs
                        </Button>
                      ) : (
                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/post-job')}>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Post a Job
                        </Button>
                      )}
                      
                      {userType === 'jobseeker' ? (
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Button>
                      ) : (
                        <Button variant="ghost" className="w-full justify-start">
                          <Building className="mr-2 h-4 w-4" />
                          Company Profile
                        </Button>
                      )}
                      
                      <Button variant="default" className="w-full justify-start">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      
                      <Separator className="my-2" />
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/30"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Account Settings</h1>
                  <p className="text-muted-foreground">
                    Manage your account preferences and settings
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-card rounded-full p-1 border">
                  <Toggle
                    pressed={theme === "light"}
                    onPressedChange={() => setTheme("light")}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    aria-label="Light mode"
                  >
                    <Sun className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    pressed={theme === "dark"}
                    onPressedChange={() => setTheme("dark")}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    aria-label="Dark mode"
                  >
                    <Moon className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    pressed={theme === "system"}
                    onPressedChange={() => setTheme("system")}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    aria-label="System preference"
                  >
                    <Monitor className="h-4 w-4" />
                  </Toggle>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userType === 'jobseeker' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input 
                                id="firstName" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input 
                                id="lastName" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input 
                              id="jobTitle" 
                              placeholder="e.g. Software Engineer"
                              value={jobTitle} 
                              onChange={(e) => setJobTitle(e.target.value)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea 
                              id="bio" 
                              placeholder="Tell employers about yourself"
                              value={bio} 
                              onChange={(e) => setBio(e.target.value)}
                              className="min-h-32" 
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input 
                              id="companyName" 
                              value={company} 
                              onChange={(e) => setCompany(e.target.value)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="companyDescription">Company Description</Label>
                            <Textarea 
                              id="companyDescription" 
                              placeholder="Tell job seekers about your company"
                              value={bio} 
                              onChange={(e) => setBio(e.target.value)}
                              className="min-h-32" 
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button onClick={saveProfile}>
                        Save Profile
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {userType === 'jobseeker' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Visibility</CardTitle>
                        <CardDescription>
                          Control who can see your profile
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Profile Visibility</h3>
                            <p className="text-sm text-muted-foreground">
                              Allow employers to discover your profile
                            </p>
                          </div>
                          <Switch 
                            checked={profileVisibility} 
                            onCheckedChange={setProfileVisibility} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Palette className="mr-2 h-5 w-5" />
                        Theme
                      </CardTitle>
                      <CardDescription>
                        Choose your preferred color scheme
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <Label>Mode</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <Button 
                            variant={theme === "light" ? "default" : "outline"}
                            className="w-full justify-center"
                            onClick={() => setTheme("light")}
                          >
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                          </Button>
                          <Button 
                            variant={theme === "dark" ? "default" : "outline"}
                            className="w-full justify-center"
                            onClick={() => setTheme("dark")}
                          >
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                          </Button>
                          <Button 
                            variant={theme === "system" ? "default" : "outline"}
                            className="w-full justify-center"
                            onClick={() => setTheme("system")}
                          >
                            <Monitor className="mr-2 h-4 w-4" />
                            System
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col space-y-2">
                        <Label>Accent Color</Label>
                        <RadioGroup 
                          className="grid grid-cols-5 gap-4" 
                          value={selectedTheme}
                          onValueChange={setSelectedTheme}
                        >
                          {themes.map((themeOption) => (
                            <div key={themeOption.name} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                id={themeOption.name} 
                                value={themeOption.name} 
                                className="peer sr-only" 
                              />
                              <Label
                                htmlFor={themeOption.name}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className={`w-10 h-10 rounded-full ${themeOption.bgClass} mb-3`} />
                                <span className="text-sm">{themeOption.label}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="mr-2 h-5 w-5" />
                        Notification Preferences
                      </CardTitle>
                      <CardDescription>
                        Manage how you receive notifications and updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Email Notifications</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">All Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Enable or disable all email notifications
                            </p>
                          </div>
                          <Switch 
                            checked={emailNotifications} 
                            onCheckedChange={setEmailNotifications} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          {userType === 'jobseeker' ? (
                            <>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Job Recommendations</p>
                                  <p className="text-sm text-muted-foreground">
                                    Receive personalized job recommendations
                                  </p>
                                </div>
                                <Switch 
                                  checked={emailUpdates} 
                                  onCheckedChange={setEmailUpdates}
                                  disabled={!emailNotifications}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Application Updates</p>
                                  <p className="text-sm text-muted-foreground">
                                    Get notified about your job application status
                                  </p>
                                </div>
                                <Switch 
                                  checked={applicationAlerts} 
                                  onCheckedChange={setApplicationAlerts}
                                  disabled={!emailNotifications}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">New Applicants</p>
                                  <p className="text-sm text-muted-foreground">
                                    Get notified when someone applies to your job
                                  </p>
                                </div>
                                <Switch 
                                  checked={applicationAlerts} 
                                  onCheckedChange={setApplicationAlerts}
                                  disabled={!emailNotifications}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Job Posting Updates</p>
                                  <p className="text-sm text-muted-foreground">
                                    Receive updates about your job postings
                                  </p>
                                </div>
                                <Switch 
                                  checked={emailUpdates} 
                                  onCheckedChange={setEmailUpdates}
                                  disabled={!emailNotifications}
                                />
                              </div>
                            </>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Messages</p>
                              <p className="text-sm text-muted-foreground">
                                Get notified when you receive new messages
                              </p>
                            </div>
                            <Switch 
                              checked={messageNotifications} 
                              onCheckedChange={setMessageNotifications}
                              disabled={!emailNotifications}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={saveSettings}>
                        Save Settings
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Account Security
                      </CardTitle>
                      <CardDescription>
                        Manage your account security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Change Password</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Update your password to keep your account secure
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={changePassword}
                        >
                          Send Password Reset Email
                        </Button>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h3 className="text-lg font-medium text-destructive mb-2">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Permanently delete your account and all associated data
                        </p>
                        <Button variant="destructive">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Settings;
