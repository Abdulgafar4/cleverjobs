
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, User, Building, Settings as SettingsIcon, Bell, Lock, Palette } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'jobseeker' | 'employer' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);

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
      
      setLoading(false);
    }
    
    getUser();
  }, [navigate, toast]);

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
                <Briefcase className="mr-2 h-4 w-4" />
                Dashboard
              </a>
            </Button>

            {userType === 'jobseeker' ? (
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </a>
              </Button>
            ) : (
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/company/profile">
                  <Building className="mr-2 h-4 w-4" />
                  Company Profile
                </a>
              </Button>
            )}
            
            <Button variant="default" className="w-full justify-start" asChild>
              <a href="/settings">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
              </a>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100">
              <a href="/auth">
                <Lock className="mr-2 h-4 w-4" />
                Sign Out
              </a>
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="space-y-6 max-w-3xl">
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                {userType === 'jobseeker' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Job Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive personalized job recommendations via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                )}
                
                {userType === 'employer' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Application Alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone applies to your job postings
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                )}
              </CardContent>
            </Card>

            {userType === 'jobseeker' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profile Privacy
                  </CardTitle>
                  <CardDescription>
                    Control who can see your profile information
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
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Contact Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Display your contact details to approved employers
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how JobBoard looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-4">Change Password</h3>
                  <Button 
                    variant="outline" 
                    onClick={changePassword}
                  >
                    Send Password Reset Email
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="font-medium text-red-500 mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={saveSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
