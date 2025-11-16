
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Briefcase, Building, User, FileText, Phone, Mail } from 'lucide-react';

// Application form schema
const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  resume: z.string().optional()
});

type ApplicationValues = z.infer<typeof applicationSchema>;

const ApplyJob = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
      resume: ''
    }
  });

  useEffect(() => {
    // In a real app, fetch job details from Supabase
    setJob({
      id,
      title: 'Senior Frontend Developer',
      company: 'Example Corp',
      location: 'Remote',
    });
    setLoading(false);
  }, [id]);

  const onSubmit = async (data: ApplicationValues) => {
    setSubmitting(true);
    
    try {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        // Save application data to local storage for after login
        localStorage.setItem('pendingApplication', JSON.stringify({
          jobId: id,
          ...data
        }));
        
        toast({
          title: "Authentication required",
          description: "Please sign in to complete your application",
        });
        
        navigate('/auth', { state: { returnTo: `/apply/${id}` } });
        return;
      }
      
      // In a real app, save application to Supabase
      console.log("Submitting application:", {
        jobId: id,
        userId: session.session.user.id,
        ...data
      });
      
      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the employer",
      });
      
      // Navigate back to job listing
      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error submitting application",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Apply for Position</h1>
            <div className="flex items-center text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="font-medium text-foreground">{job.title}</span>
              <span className="mx-2">at</span>
              <span className="font-medium text-foreground">{job.company}</span>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Complete the form below to apply for this position
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        className="pl-9"
                        {...form.register("fullName")}
                      />
                    </div>
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-9"
                          {...form.register("email")}
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="(123) 456-7890"
                          className="pl-9"
                          {...form.register("phone")}
                        />
                      </div>
                      {form.formState.errors.phone && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="resume">Resume Link (Optional)</Label>
                    <div className="relative mt-1.5">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="resume"
                        placeholder="https://example.com/your-resume.pdf"
                        className="pl-9"
                        {...form.register("resume")}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                      className="min-h-32"
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
                <Button variant="outline" onClick={() => navigate(`/jobs/${id}`)}>Cancel</Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
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
