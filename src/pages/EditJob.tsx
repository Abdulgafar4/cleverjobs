import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Briefcase, Building, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import DashboardSidebar from '@/components/DashboardSidebar';
import { employerJobListings } from '@/lib/data';

// Form schema for job posting
const jobFormSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  type: z.string().min(1, "Job type is required"),
  status: z.string().min(1, "Status is required"),
  salary: z.string().optional(),
  description: z.string().min(20, "Job description must be at least 20 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  applicationUrl: z.string().url("Please enter a valid URL")
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'jobseeker' | 'employer' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "",
      status: "",
      salary: "",
      description: "",
      requirements: "",
      applicationUrl: ""
    }
  });

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
        
        // If user is not an employer, redirect to dashboard
        if (userMetadata.user_type !== 'employer') {
          navigate('/dashboard');
          return;
        }
      } else {
        navigate('/auth');
        return;
      }

      // In a real app, fetch the job data from your database
      // For now, find the job in our sample data
      const jobListing = employerJobListings.find(job => job.id === id);
      
      if (!jobListing) {
        toast({
          title: "Job not found",
          description: "The job listing you're trying to edit doesn't exist.",
          variant: "destructive"
        });
        navigate('/jobs/manage');
        return;
      }
      
      // Set form values from job listing
      form.reset({
        title: jobListing.title,
        company: jobListing.company,
        location: jobListing.location,
        type: jobListing.type,
        status: jobListing.status,
        salary: "$80,000 - $120,000", // Example data
        description: "This is an example job description for the " + jobListing.title + " position. In a real app, this would come from your database.",
        requirements: "- 3+ years of experience\n- Bachelor's degree\n- Strong communication skills",
        applicationUrl: "https://example.com/apply"
      });
      
      setLoading(false);
    }
    
    getUser();
  }, [navigate, id, form, toast]);

  async function onSubmit(data: JobFormValues) {
    setSubmitLoading(true);
    
    try {
      // In a real app, you would update the job in your database
      console.log("Updating job data:", data);
      
      toast({
        title: "Job updated successfully!",
        description: "Your job listing has been updated",
      });
      
      // Navigate back to manage jobs
      navigate('/jobs/manage');
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error updating job",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="sidebar-layout">
        <DashboardSidebar 
          userType={userType} 
          userName={user?.user_metadata?.first_name || 'User'} 
          companyName={user?.user_metadata?.company_name || 'Company'}
        />
        <main className="dashboard-content">
          <div className="flex items-center justify-center min-h-screen">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="sidebar-layout">
      <DashboardSidebar 
        userType={userType} 
        userName={user?.user_metadata?.first_name || 'User'} 
        companyName={user?.user_metadata?.company_name || 'Company'}
      />
      
      <main className="dashboard-content">
        <div className="container px-4 sm:px-6 max-w-3xl mx-auto py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/jobs/manage')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Manage Jobs
            </Button>
            <h1 className="text-3xl font-bold mb-2">Edit Job</h1>
            <p className="text-muted-foreground mb-6">
              Update the details of your job listing
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Make changes to your job listing information
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        onValueChange={(value) => form.setValue("status", value)}
                        defaultValue={form.getValues("status")}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.status && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.status.message}
                        </p>
                      )}
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
                <Button variant="outline" onClick={() => navigate('/jobs/manage')}>Cancel</Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  disabled={submitLoading}
                >
                  {submitLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditJob;
