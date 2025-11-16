
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companies, jobs } from '@/lib/data';
import AnimatedTransition from '@/components/AnimatedTransition';
import CompanyHeader from '@/components/company/CompanyHeader';
import CompanyInfo from '@/components/company/CompanyInfo';
import CompanyDescription from '@/components/company/CompanyDescription';
import CompanyJobs from '@/components/company/CompanyJobs';
import CompanySidebar from '@/components/company/CompanySidebar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // If there's no ID in the URL, we'll try to get the company for the logged-in user
  const [company, setCompany] = useState(id ? companies.find(c => c.id === id) : null);
  const [companyJobs, setCompanyJobs] = useState(id ? jobs.filter(job => job.companyId === id) : []);
  
  useEffect(() => {
    // Check if user is logged in and get user data
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserId(session.user.id);
          
          // If no ID was provided and we have a user, try to get their company
          if (!id) {
            // Get user metadata to find their company
            const userData = session.user.user_metadata;
            console.log("User metadata:", userData);
            
            // Check if this is an employer account
            if (userData && userData.user_type === 'employer') {
              // For demo purposes, we'll use the company from metadata or default to first company
              const companyName = userData.company_name;
              console.log("Company name from metadata:", companyName);
              
              // Find company by name or use first company as fallback
              let userCompany;
              
              if (companyName) {
                userCompany = companies.find(c => 
                  c.name.toLowerCase() === companyName.toLowerCase()
                );
              }
              
              // If we can't find a match, use the first company as a demo
              if (!userCompany) {
                userCompany = companies[0];
                console.log("Using first company as fallback:", userCompany.name);
              }
              
              setCompany(userCompany);
              setUserCompany(userCompany);
              
              if (userCompany) {
                setCompanyJobs(jobs.filter(job => job.companyId === userCompany.id));
              }
            } else {
              // If user isn't an employer, redirect them
              toast({
                title: "Access Restricted",
                description: "Only employer accounts can view company profiles.",
                variant: "destructive",
              });
              navigate('/dashboard', { replace: true });
            }
          }
        } else if (!id) {
          // If no ID was provided and user is not logged in, redirect to companies
          navigate('/companies', { replace: true });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load company profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, navigate, toast]);
  
  useEffect(() => {
    // If ID was provided but company not found, redirect to companies
    if (id && !company && !loading) {
      navigate('/companies', { replace: true });
    }
  }, [company, id, navigate, loading]);
  
  if (loading) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading company profile...</p>
          </div>
        </div>
      </AnimatedTransition>
    );
  }
  
  if (!company) {
    return null;
  }
  
  return (
    <AnimatedTransition>
      <main className="min-h-screen">
        <CompanyHeader
          companyName={company.name}
          industry={company.industry}
          logo={company.logo}
          coverImage={company.coverImage}
          website={company.website}
        />
        
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto pb-16">
          <CompanyInfo
            name={company.name}
            industry={company.industry}
            location={company.location}
            size={company.size}
            founded={company.founded}
            website={company.website}
          />
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <CompanyDescription 
                name={company.name} 
                description={company.description} 
              />
              
              <CompanyJobs 
                companyName={company.name} 
                jobs={companyJobs} 
              />
            </div>
            
            <div className="lg:w-1/3">
              <CompanySidebar company={company} />
            </div>
          </div>
        </div>
      </main>
    </AnimatedTransition>
  );
};

export default CompanyProfile;
