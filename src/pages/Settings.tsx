
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/components/ThemeProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  CheckCircle2,
  Moon,
  PaletteIcon,
  ShieldAlert,
  Sun,
  User,
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

const Settings = () => {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'jobseeker' | 'employer' | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
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
      }
    }
    
    getUser();
  }, [navigate]);

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
    <div className="sidebar-layout">
      <DashboardSidebar 
        userType={userType} 
        userName={user?.user_metadata?.first_name || 'User'} 
        companyName={user?.user_metadata?.company_name || 'Company'}
      />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <PaletteIcon className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account</span>
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
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View and update your account details
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
                
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Account Security</Label>
                  <Separator className="my-2" />
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
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
    </div>
  );
};

export default Settings;
