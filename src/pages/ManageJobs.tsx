
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trash2, 
  Edit, 
  Eye, 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpDown 
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

// Interface for job listings
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: 'active' | 'paused' | 'closed';
  posted_date: string;
  applicants: number;
}

// Sample job listings data (this would come from your database in production)
const sampleJobListings: JobListing[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    status: 'active',
    posted_date: '2023-10-15',
    applicants: 12
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'DesignHub',
    location: 'Remote',
    type: 'Contract',
    status: 'active',
    posted_date: '2023-10-10',
    applicants: 8
  },
  {
    id: '3',
    title: 'Marketing Manager',
    company: 'GrowthCo',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'paused',
    posted_date: '2023-09-30',
    applicants: 15
  },
];

const ManageJobs = () => {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'jobseeker' | 'employer' | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
        
        // If user is not an employer, redirect to dashboard
        if (userMetadata.user_type !== 'employer') {
          navigate('/dashboard');
          return;
        }
      } else {
        navigate('/auth');
        return;
      }

      // In a real app, fetch jobs from your database
      // For now, use the sample data after a small delay to simulate API call
      setTimeout(() => {
        setJobs(sampleJobListings);
        setLoading(false);
      }, 500);
    }
    
    getUser();
  }, [navigate]);

  const handleDelete = (jobId: string) => {
    // Here you would call your API to delete the job
    setJobs(jobs.filter(job => job.id !== jobId));
    toast({
      title: "Job deleted",
      description: "The job listing has been successfully deleted.",
    });
  };

  const handleEdit = (jobId: string) => {
    // Navigate to edit job page
    navigate(`/edit-job/${jobId}`);
  };

  const handleView = (jobId: string) => {
    // Navigate to view job page
    navigate(`/jobs/${jobId}`);
  };

  const handlePostJob = () => {
    navigate('/post-job');
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500">Paused</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Jobs</h1>
            <p className="text-muted-foreground">
              View and manage all your job listings
            </p>
          </div>
          <Button onClick={handlePostJob}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Job Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jobs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">
                        <Button variant="ghost" className="p-0 hover:bg-transparent">
                          <span>Job Title</span>
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 hover:bg-transparent">
                          <span>Location</span>
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" className="p-0 hover:bg-transparent">
                          <span>Applicants</span>
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell className="text-right">{job.applicants}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(job.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(job.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the job listing. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => handleDelete(job.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No jobs match your search criteria. Try different keywords." : "You haven't posted any jobs yet."}
                </p>
                {!searchTerm && (
                  <Button onClick={handlePostJob}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post Your First Job
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManageJobs;
