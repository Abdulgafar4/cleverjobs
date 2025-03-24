
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from '@/integrations/supabase/client';
import { jobs } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Briefcase, Upload } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

// Form schema for job application
const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  resumeUrl: z.string().optional()
});

type ApplicationValues = z.infer<typeof applicationSchema>;

const ApplyJob = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      resumeUrl: ""
    }
  });

  useEffect(() => {
    // Find the job by ID
    const selectedJob = jobs.find(j => j.id === id);
    if (!selectedJob) {
      navigate('/jobs');
      return;
    }
    setJob(selectedJob);
  }, [id, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  async function onSubmit(data: ApplicationValues) {
    setLoading(true);
    
    try {
      // Check if user is logged in
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to apply for this job",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }
      
      // In a real app, you would upload the resume and save application data to Supabase
      console.log("Submitting application:", data);
      
      toast({
        title: "Application submitted!",
        description: "Your application has been sent successfully",
      });
      
      // Navigate back to jobs listing
      navigate('/jobs');
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error submitting application",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  if (!job) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="mb-6">
            <Link 
              to={`/jobs/${id}`}
              className="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to job details
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Apply for {job.title}</h1>
          <p className="text-muted-foreground mb-8">
            at {job.company} • {job.location}
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Application</CardTitle>
              <CardDescription>
                Complete the form below to apply for this position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      {...form.register("fullName")}
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        {...form.register("phone")}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="resume">Resume/CV</Label>
                    <div className="mt-1.5">
                      <Label 
                        htmlFor="resume" 
                        className="flex items-center justify-center border-2 border-dashed border-input rounded-md py-6 cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm font-medium">
                            {resumeFile ? resumeFile.name : "Click to upload your resume"}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            PDF, DOCX or TXT (max 5MB)
                          </span>
                        </div>
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.docx,.doc,.txt"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Explain why you are a good fit for this position..."
                      className="min-h-40"
                      {...form.register("coverLetter")}
                    />
                    {form.formState.errors.coverLetter && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.coverLetter.message}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end gap-4 w-full">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/jobs/${id}`)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default ApplyJob;
