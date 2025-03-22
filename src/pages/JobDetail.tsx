
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobs, companies } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Briefcase, Clock, DollarSign, 
  Building, ArrowLeft, Share2, Globe,
  Bookmark
} from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState(jobs.find(j => j.id === id));
  const [company, setCompany] = useState(companies.find(c => c.id === job?.companyId));
  
  useEffect(() => {
    if (!job) {
      navigate('/jobs', { replace: true });
    }
  }, [job, navigate]);
  
  if (!job || !company) {
    return null;
  }
  
  return (
    <AnimatedTransition>
      <main className="min-h-screen pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              {/* Back button */}
              <Link 
                to="/jobs"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to jobs
              </Link>
              
              {/* Job header */}
              <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden border bg-white flex items-center justify-center">
                    {job.logo ? (
                      <img 
                        src={job.logo} 
                        alt={`${job.company} logo`}
                        className="w-14 h-14 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=' + job.company.charAt(0);
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 bg-primary/10 flex items-center justify-center text-primary font-semibold text-2xl">
                        {job.company.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-medium">{job.title}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Link 
                        to={`/companies/${company.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {job.company}
                      </Link>
                      {job.featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 sm:self-start">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{job.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Job Type</p>
                      <p className="font-medium">{job.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-medium">{job.salary}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Posted</p>
                      <p className="font-medium">{job.posted}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button size="lg" className="px-8">
                    Apply Now
                  </Button>
                  <Button variant="outline" size="lg">
                    Save Job
                  </Button>
                </div>
              </div>
              
              {/* Job description */}
              <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="mb-4 text-foreground/90 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </div>
              
              {/* Job requirements */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-medium mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5"></div>
                      <span className="flex-1">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:w-1/3">
              {/* Company information */}
              <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 sticky top-24">
                <h2 className="text-xl font-medium mb-4">Company Information</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-md overflow-hidden border bg-white flex items-center justify-center">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=' + company.name.charAt(0);
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {company.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>Founded in {company.founded}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {new URL(company.website).hostname.replace('www.', '')}
                    </a>
                  </div>
                </div>
                
                <p className="text-sm text-foreground/90 mb-5">
                  {company.description}
                </p>
                
                <Link to={`/companies/${company.id}`}>
                  <Button variant="outline" className="w-full">
                    View Company Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AnimatedTransition>
  );
};

export default JobDetail;
