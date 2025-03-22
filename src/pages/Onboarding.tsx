
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, User, Building, ArrowRight } from 'lucide-react';

const Onboarding = () => {
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'jobseeker' | 'employer' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Job seeker form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');

  // Employer form fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setSession(session);
      
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
    });
  }, [navigate, toast]);

  const handleJobSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Here you would typically save this data to a profiles table in your database
      // For now, we'll just update user metadata
      
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          title,
          bio,
          skills: skills.split(',').map(skill => skill.trim()),
          onboarding_completed: true
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile created",
        description: "Your job seeker profile has been set up successfully",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !industry || !companyDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Save employer profile data
      const { error } = await supabase.auth.updateUser({
        data: {
          company_name: companyName,
          industry,
          company_size: companySize,
          company_website: companyWebsite,
          company_description: companyDescription,
          onboarding_completed: true
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Company profile created",
        description: "Your employer profile has been set up successfully",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-primary/5 to-background min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              {userType === 'jobseeker' ? (
                <User className="h-8 w-8 text-primary" />
              ) : (
                <Building className="h-8 w-8 text-primary" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Let's Set Up Your {userType === 'jobseeker' ? 'Profile' : 'Company'}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {userType === 'jobseeker'
              ? 'Complete your profile to help employers find you and match with the right opportunities.'
              : 'Tell us about your company so job seekers can learn more about you.'}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>
                {userType === 'jobseeker' ? 'Job Seeker Profile' : 'Company Profile'}
              </CardTitle>
              <CardDescription>
                {userType === 'jobseeker'
                  ? 'Share information about your professional background and skills'
                  : 'Tell potential candidates about your company and what you do'}
              </CardDescription>
            </CardHeader>

            {userType === 'jobseeker' ? (
              <form onSubmit={handleJobSeekerSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name*</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name*</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title*</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Frontend Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself, your experience, and what you're looking for"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      placeholder="e.g. React, TypeScript, UI Design (comma separated)"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Profile..." : "Complete Setup"}
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <form onSubmit={handleEmployerSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name*</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry*</Label>
                      <Input
                        id="industry"
                        placeholder="e.g. Technology"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Input
                        id="companySize"
                        placeholder="e.g. 10-50 employees"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      placeholder="https://example.com"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyDescription">Company Description*</Label>
                    <Textarea
                      id="companyDescription"
                      placeholder="Tell job seekers about your company's mission, culture, and what makes it special"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Company Profile..." : "Complete Setup"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
