
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Mail, Lock, User, Building, Sparkles, CheckCircle2, Loader2, ArrowRight, Rocket, Users, Target, Search, TrendingUp, Zap, Shield, Globe } from 'lucide-react';

type UserType = 'jobseeker' | 'employer';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Determine user type from route - /auth/employer = employer, /auth = jobseeker
  const isEmployerRoute = location.pathname === '/auth/employer';
  const [userType, setUserType] = useState<UserType>(isEmployerRoute ? 'employer' : 'jobseeker');
  
  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
    return { strength: 4, label: 'Strong', color: 'bg-green-500' };
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  useEffect(() => {
    // Update user type based on route
    const newUserType = location.pathname === '/auth/employer' ? 'employer' : 'jobseeker';
    setUserType(newUserType);
    
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('signup') === 'true') {
      setActiveTab('signup');
    }
    
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      const userMetadata = data.user?.user_metadata;
      const hasUserType = userMetadata?.user_type;
      
      if (!hasUserType) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            user_type: userType,
          }
        });
        
        if (updateError) {
          console.error('Error updating user type:', updateError);
          toast({
            title: "Error",
            description: "Could not set user type. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        await supabase.auth.refreshSession();
        
        toast({
          title: "Welcome!",
          description: "Please complete your profile setup",
        });
        
        navigate('/onboarding');
        return;
      } else {
        toast({
          title: "Success",
          description: "You have been signed in",
        });
      }
      
      if (!userMetadata?.onboarding_completed) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
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
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
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
        title: "Success! 🎉",
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

  const stats = isEmployerRoute ? [
    { value: "10K+", label: "Active Candidates" },
    { value: "500+", label: "Companies" },
    { value: "98%", label: "Match Rate" },
  ] : [
    { value: "50K+", label: "Job Opportunities" },
    { value: "1K+", label: "Companies" },
    { value: "85%", label: "Success Rate" },
  ];

  const benefits = isEmployerRoute ? [
    { icon: Zap, text: "Post jobs in seconds" },
    { icon: Target, text: "Find perfect candidates" },
    { icon: TrendingUp, text: "Scale your team fast" },
  ] : [
    { icon: Search, text: "Discover 50K+ jobs" },
    { icon: Rocket, text: "One-click applications" },
    { icon: Shield, text: "Verified companies only" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white min-h-full">
          <div className="flex-1 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md w-full"
            >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              {isEmployerRoute 
                ? "Find the perfect candidate, faster" 
                : "Your dream job is waiting"}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {isEmployerRoute
                ? "Join thousands of companies finding top talent on our platform. Post jobs, review candidates, and hire with confidence."
                : "Join thousands of professionals finding their next career opportunity. Apply to jobs, connect with employers, and grow your career."}
            </p>

            <div className="space-y-4 mb-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-lg">{benefit.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex gap-8 pt-8 border-t border-white/20">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-white/70"
          >
            {!isEmployerRoute && (
              <button
                onClick={() => navigate('/auth/employer')}
                className="hover:text-white transition-colors underline"
              >
                Are you an employer? Sign up here →
              </button>
            )}
            {isEmployerRoute && (
              <button
                onClick={() => navigate('/auth')}
                className="hover:text-white transition-colors underline"
              >
                Looking for jobs? Sign up here →
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* Enhanced background pattern with gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style={{
            backgroundImage: 'linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[480px] relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20"
            >
              {isEmployerRoute ? (
                <Building className="h-6 w-6 text-white" />
              ) : (
                <Briefcase className="h-6 w-6 text-white" />
              )}
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">JobBoard</span>
          </div>

          <div className="space-y-8">
            {/* Enhanced Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-3"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 shadow-xl shadow-primary/25 mb-2"
              >
                {isEmployerRoute ? (
                  <Building className="h-9 w-9 text-white" />
                ) : (
                  <Briefcase className="h-9 w-9 text-white" />
                )}
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                {activeTab === 'signin' 
                  ? 'Welcome back' 
                  : (isEmployerRoute ? 'Start hiring' : 'Get started')
                }
              </h1>
              <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
                {activeTab === 'signin'
                  ? (isEmployerRoute 
                    ? 'Sign in to manage your job postings' 
                    : 'Sign in to continue your job search')
                  : (isEmployerRoute
                    ? 'Create an account to start posting jobs'
                    : 'Create an account to start applying')
                }
              </p>
            </motion.div>

            {/* Enhanced Auth Card */}
            <Card className="border-0 shadow-2xl shadow-slate-900/10 dark:shadow-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardContent className="p-8 sm:p-10">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Enhanced Tab Design */}
                  <div className="relative mb-8">
                    <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => setActiveTab('signin')}
                        className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          activeTab === 'signin'
                            ? 'bg-white dark:bg-slate-700 text-foreground shadow-lg shadow-slate-900/5 dark:shadow-slate-800/20 scale-[1.02]'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          activeTab === 'signup'
                            ? 'bg-white dark:bg-slate-700 text-foreground shadow-lg shadow-slate-900/5 dark:shadow-slate-800/20 scale-[1.02]'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'signin' && (
                      <motion.form
                        key="signin"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSignIn}
                        className="space-y-6"
                      >
                        <div className="space-y-5">
                          <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email address</Label>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors z-10" />
                              <Input 
                                id="email" 
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 h-14 border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base transition-all duration-200 relative z-0"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2.5">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors z-10" />
                              <Input 
                                id="password" 
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-12 h-14 border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base transition-all duration-200 relative z-0"
                                required
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm pt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors" 
                              />
                              <span className="text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                            </label>
                            <button 
                              type="button" 
                              className="text-primary font-semibold hover:underline transition-all hover:text-primary/80"
                            >
                              Forgot password?
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 rounded-xl"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            <>
                              Sign In
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                        
                        <p className="text-center text-sm text-muted-foreground pt-2">
                          Don't have an account?{" "}
                          <button 
                            type="button"
                            onClick={() => setActiveTab('signup')}
                            className="font-semibold text-primary hover:underline transition-all"
                          >
                            Sign up
                          </button>
                        </p>
                      </motion.form>
                    )}
                    {activeTab === 'signup' && (
                      <motion.form
                        key="signup"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSignUp}
                        className="space-y-6"
                      >
                        <div className="space-y-5">
                          <div className="space-y-2.5">
                            <Label htmlFor="email-signup" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email address</Label>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors z-10" />
                              <Input 
                                id="email-signup" 
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 h-14 border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base transition-all duration-200 relative z-0"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2.5">
                            <Label htmlFor="password-signup" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors z-10" />
                              <Input 
                                id="password-signup" 
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-12 h-14 border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base transition-all duration-200 relative z-0"
                                required
                              />
                            </div>
                            {password && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-2.5 pt-1"
                              >
                                <div className="flex gap-1.5 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 p-0.5">
                                  {[1, 2, 3, 4].map((level) => (
                                    <motion.div
                                      key={level}
                                      initial={{ width: 0 }}
                                      animate={{ 
                                        width: passwordStrength.strength >= level ? '100%' : '0%',
                                      }}
                                      transition={{ duration: 0.3, ease: "easeOut" }}
                                      className={`h-full ${passwordStrength.color} rounded-full shadow-sm`}
                                    />
                                  ))}
                                </div>
                                {passwordStrength.label && (
                                  <p className={`text-xs font-semibold ${
                                    passwordStrength.strength >= 3 ? 'text-green-600 dark:text-green-400' : 
                                    passwordStrength.strength >= 2 ? 'text-blue-600 dark:text-blue-400' : 
                                    passwordStrength.strength >= 1 ? 'text-yellow-600 dark:text-yellow-400' : 
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    Password strength: {passwordStrength.label}
                                  </p>
                                )}
                              </motion.div>
                            )}
                            <p className="text-xs text-muted-foreground pt-1">
                              Must be at least 6 characters long
                            </p>
                          </div>

                          <label className="flex items-start gap-3 text-sm cursor-pointer group pt-2">
                            <input 
                              type="checkbox" 
                              className="mt-1 w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors" 
                              required 
                            />
                            <span className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                              I agree to the{" "}
                              <a href="#" className="text-primary font-semibold hover:underline">Terms of Service</a>
                              {" "}and{" "}
                              <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>
                            </span>
                          </label>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 rounded-xl"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              <Rocket className="mr-2 h-5 w-5" />
                              Create Account
                            </>
                          )}
                        </Button>
                        
                        <p className="text-center text-sm text-muted-foreground pt-2">
                          Already have an account?{" "}
                          <button 
                            type="button"
                            onClick={() => setActiveTab('signin')}
                            className="font-semibold text-primary hover:underline transition-all"
                          >
                            Sign in
                          </button>
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
