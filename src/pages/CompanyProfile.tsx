
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { companies, jobs } from '@/lib/data';
import { Button } from '@/components/ui/button';
import JobCard from '@/components/JobCard';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Building, ArrowLeft, Share2, 
  Globe, Calendar, Users, Briefcase
} from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState(companies.find(c => c.id === id));
  const [companyJobs, setCompanyJobs] = useState(jobs.filter(job => job.companyId === id));
  
  useEffect(() => {
    if (!company) {
      navigate('/companies', { replace: true });
    }
  }, [company, navigate]);
  
  if (!company) {
    return null;
  }
  
  return (
    <AnimatedTransition>
      <main className="min-h-screen">
        {/* Cover image */}
        <div 
          className="h-64 md:h-80 bg-secondary/80 relative"
          style={{
            backgroundImage: company.coverImage ? `url(${company.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto h-full relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white rounded-xl border shadow-md p-3 w-[90px] h-[90px] flex items-center justify-center">
              {company.logo ? (
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=' + company.name.charAt(0);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-3xl">
                  {company.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto pt-20 pb-16">
          {/* Back button */}
          <div className="mb-6">
            <Link 
              to="/companies"
              className="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to companies
            </Link>
          </div>
          
          {/* Company header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-medium mb-1">{company.name}</h1>
            <p className="text-muted-foreground mb-4">{company.industry}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{company.size}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Founded {company.founded}</span>
              </div>
              <div className="flex items-center gap-1.5">
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
            <div className="flex justify-center gap-3">
              <Button as="a" href={company.website} target="_blank" rel="noopener noreferrer">
                Visit Website
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {/* Company description */}
              <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
                <h2 className="text-xl font-medium mb-4">About {company.name}</h2>
                <div className="prose max-w-none">
                  <p className="text-foreground/90 leading-relaxed">
                    {company.description}
                  </p>
                </div>
              </div>
              
              {/* Open positions */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Open Positions
                  </h2>
                  <Badge variant="outline">
                    {companyJobs.length} job{companyJobs.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                {companyJobs.length > 0 ? (
                  <div className="grid gap-4">
                    {companyJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border">
                    <h3 className="text-lg font-medium mb-2">No open positions</h3>
                    <p className="text-muted-foreground">
                      {company.name} doesn't have any job listings at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:w-1/3">
              {/* Company information */}
              <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-4">Company Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Industry</h3>
                    <p>{company.industry}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Company size</h3>
                    <p>{company.size}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Founded</h3>
                    <p>{company.founded}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Headquarters</h3>
                    <p>{company.location}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Website</h3>
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    Follow {company.name}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AnimatedTransition>
  );
};

export default CompanyProfile;
