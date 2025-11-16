
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { updateUserMetadata, updateJobSeekerProfile, updateEmployerProfile } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { useTheme } from '@/components/ThemeProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import ResumeUpload from '@/components/ResumeUpload';
import {
  CheckCircle2,
  Moon,
  PaletteIcon,
  ShieldAlert,
  Sun,
  User,
  FileText,
} from 'lucide-react';
const Settings = () => {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const { user, userType, userMetadata, refresh } = useUser();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Profile update states
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: userMetadata?.first_name || '',
    lastName: userMetadata?.last_name || '',
    title: userMetadata?.title || '',
    phone: userMetadata?.phone || '',
    location: userMetadata?.location || '',
    // Employer fields
    companyName: userMetadata?.company_name || '',
    industry: userMetadata?.industry || '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (userMetadata) {
      setProfileData({
        firstName: userMetadata?.first_name || '',
        lastName: userMetadata?.last_name || '',
        title: userMetadata?.title || '',
        phone: userMetadata?.phone || '',
        location: userMetadata?.location || '',
        companyName: userMetadata?.company_name || '',
        industry: userMetadata?.industry || '',
      });
    }
  }, [userMetadata]);

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      
      if (userType === 'jobseeker') {
        await updateJobSeekerProfile({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          title: profileData.title,
          phone: profileData.phone,
          location: profileData.location,
        });
      } else if (userType === 'employer') {
        await updateEmployerProfile({
          company_name: profileData.companyName,
          industry: profileData.industry,
        });
      }
      
      // Refresh user data to get updated metadata
      await refresh();
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveAppearance = () => {
    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been saved.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            {userType === 'jobseeker' && (
              <TabsTrigger value="resume" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Resume</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <PaletteIcon className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Choose between light, dark, or system theme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue={theme} 
                    onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem 
                        value="light" 
                        id="theme-light" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Sun className="mb-3 h-6 w-6" />
                        Light
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="dark" 
                        id="theme-dark" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Moon className="mb-3 h-6 w-6" />
                        Dark
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="system" 
                        id="theme-system" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="flex mb-3 h-6 w-6 items-center">
                          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </div>
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Accent Color</CardTitle>
                  <CardDescription>
                    Choose an accent color for buttons and interactive elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue={accent} 
                    onValueChange={(value) => setAccent(value as any)}
                    className="grid grid-cols-4 gap-4"
                  >
                    <div>
                      <RadioGroupItem 
                        value="default" 
                        id="accent-default" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-default"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-[#9b87f5]" />
                        <span className="text-xs">Default</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="blue" 
                        id="accent-blue" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-blue"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-blue-500" />
                        <span className="text-xs">Blue</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="green" 
                        id="accent-green" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-green"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-green-500" />
                        <span className="text-xs">Green</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="orange" 
                        id="accent-orange" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-orange"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-orange-500" />
                        <span className="text-xs">Orange</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="pink" 
                        id="accent-pink" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-pink"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-pink-500" />
                        <span className="text-xs">Pink</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="red" 
                        id="accent-red" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-red"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-red-500" />
                        <span className="text-xs">Red</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="teal" 
                        id="accent-teal" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-teal"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-teal-500" />
                        <span className="text-xs">Teal</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="purple" 
                        id="accent-purple" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-purple"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-purple-600" />
                        <span className="text-xs">Purple</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="amber" 
                        id="accent-amber" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="accent-amber"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="w-8 h-8 rounded-full mb-2 bg-amber-500" />
                        <span className="text-xs">Amber</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveAppearance}>
                    Save appearance settings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="grid gap-6">
              {userType === 'jobseeker' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <input
                          id="firstName"
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <input
                          id="lastName"
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <input
                        id="title"
                        type="text"
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                        placeholder="e.g., Software Engineer"
                        className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <input
                          id="location"
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          placeholder="City, State"
                          className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateProfile} disabled={updating}>
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                      Update your company information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <input
                        id="companyName"
                        type="text"
                        value={profileData.companyName}
                        onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                        className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <input
                        id="industry"
                        type="text"
                        value={profileData.industry}
                        onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                        placeholder="e.g., Technology, Healthcare"
                        className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateProfile} disabled={updating}>
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    View your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="rounded-md border px-4 py-3 font-mono text-sm bg-muted/50">
                      {user.email}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="rounded-md border px-4 py-3 font-mono text-sm bg-muted/50 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {userType === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {userType === 'jobseeker' && (
            <TabsContent value="resume">
              <div className="grid gap-6">
                <ResumeUpload onUpdateComplete={refresh} />
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                    <span>Email Notifications</span>
                    <span className="font-normal text-xs text-muted-foreground">
                      Receive notifications about your applications and messages
                    </span>
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                    <span>Marketing Emails</span>
                    <span className="font-normal text-xs text-muted-foreground">
                      Receive emails about new features and special offers
                    </span>
                  </Label>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications}>
                  Save notification preferences
                </Button>
              </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Settings;
