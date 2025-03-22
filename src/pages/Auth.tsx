
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Mail, Lock, User, Building } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type UserType = 'jobseeker' | 'employer';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [userType, setUserType] = useState<UserType>('jobseeker');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user wants to sign up directly from URL
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('signup') === 'true') {
      setActiveTab('signup');
    }
    if (searchParams.get('type') === 'employer') {
      setUserType('employer');
    }
    
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [location, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have been signed in",
      });
      
      navigate('/onboarding');
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Please check your email to confirm your account",
      });
      
      navigate('/onboarding');
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary/5 to-background min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <AspectRatio ratio={4/3} className="bg-muted">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Person working on laptop" 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          <div className="mt-6 space-y-2 px-4">
            <h2 className="text-2xl font-bold text-primary">Find Your Dream Job</h2>
            <p className="text-muted-foreground">Connect with top employers and opportunities tailored to your skills and preferences.</p>
          </div>
        </motion.div>

        {/* Auth Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl text-center font-bold">Welcome to JobBoard</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Sign in or create an account to post jobs and apply to positions
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full rounded-md bg-muted/50">
                <TabsTrigger value="signin" className="rounded-sm">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-sm">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="p-0">
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Don't have an account?{" "}
                      <button 
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="text-primary hover:underline font-medium"
                      >
                        Sign Up
                      </button>
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="p-0">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4 pt-4">
                    {/* User Type Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">I am a:</Label>
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <Button 
                          type="button"
                          variant={userType === 'jobseeker' ? 'default' : 'outline'}
                          className="flex items-center justify-center gap-2"
                          onClick={() => setUserType('jobseeker')}
                        >
                          <User className="h-4 w-4" />
                          Job Seeker
                        </Button>
                        <Button 
                          type="button"
                          variant={userType === 'employer' ? 'default' : 'outline'}
                          className="flex items-center justify-center gap-2"
                          onClick={() => setUserType('employer')}
                        >
                          <Building className="h-4 w-4" />
                          Employer
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-signup" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email-signup" 
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-signup" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="password-signup" 
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={loading}
                    >
                      {loading ? `Creating ${userType} account...` : `Create ${userType === 'jobseeker' ? 'Job Seeker' : 'Employer'} Account`}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Already have an account?{" "}
                      <button 
                        type="button"
                        onClick={() => setActiveTab('signin')}
                        className="text-primary hover:underline font-medium"
                      >
                        Sign In
                      </button>
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
