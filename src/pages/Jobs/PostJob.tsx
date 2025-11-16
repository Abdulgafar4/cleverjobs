
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Building, MapPin, DollarSign, Clock } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
// Form schema for job posting
const jobFormSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  type: z.string().min(1, "Job type is required"),
  salary: z.string().optional(),
  description: z.string().min(20, "Job description must be at least 20 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  applicationUrl: z.string().url("Please enter a valid URL")
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'jobseeker' | 'employer' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  React.useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth/employer');
        return;
      }
      
      setUser(session.user);
      
      // Get user type from metadata
      const userMetadata = session.user.user_metadata;
      if (userMetadata && userMetadata.user_type) {
        setUserType(userMetadata.user_type);
        
        // If user is not an employer, redirect to dashboard
        if (userMetadata.user_type !== 'employer') {
          navigate('/dashboard');
          return;
        }
      } else {
        navigate('/auth');
        return;
      }
    }
    
    getUser();
  }, [navigate]);
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "",
      salary: "",
      description: "",
      requirements: "",
      applicationUrl: ""
    }
  });

  async function onSubmit(data: JobFormValues) {
    setLoading(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to post a job",
          variant: "destructive"
        });
        navigate('/auth/employer');
        return;
      }
      
      // In a real app, you would save this to Supabase
      console.log("Submitting job data:", data);
      
      toast({
        title: "Job posted successfully!",
        description: "Your job listing has been created",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error posting job",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
          <p className="text-muted-foreground mb-8">
            Fill out the form below to create a new job listing
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide detailed information about the position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <div className="relative mt-1.5">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="title"
                        placeholder="e.g. Senior Frontend Developer"
                        className="pl-9"
                        {...form.register("title")}
                      />
                    </div>
                    {form.formState.errors.title && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <div className="relative mt-1.5">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="e.g. Acme Inc."
                        className="pl-9"
                        {...form.register("company")}
                      />
                    </div>
                    {form.formState.errors.company && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.company.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="relative mt-1.5">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="e.g. New York, NY or Remote"
                          className="pl-9"
                          {...form.register("location")}
                        />
                      </div>
                      {form.formState.errors.location && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Job Type</Label>
                      <Select 
                        onValueChange={(value) => form.setValue("type", value)}
                        defaultValue={form.getValues("type")}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.type && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.type.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="salary">Salary Range (Optional)</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="salary"
                        placeholder="e.g. $80,000 - $100,000 or Competitive"
                        className="pl-9"
                        {...form.register("salary")}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                      className="min-h-32"
                      {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="List skills, qualifications, and experience required for the role..."
                      className="min-h-32"
                      {...form.register("requirements")}
                    />
                    {form.formState.errors.requirements && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.requirements.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="applicationUrl">Application URL</Label>
                    <Input
                      id="applicationUrl"
                      placeholder="https://your-application-form.com"
                      {...form.register("applicationUrl")}
                    />
                    {form.formState.errors.applicationUrl && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.applicationUrl.message}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end gap-4 w-full">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Post Job"}
                </Button>
              </div>
            </CardFooter>
          </Card>
      </div>
    </main>
  );
};

export default PostJob;
