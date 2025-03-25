
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

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  
  // If there's no ID in the URL, we'll try to get the company for the logged-in user
  const [company, setCompany] = useState(id ? companies.find(c => c.id === id) : null);
  const [companyJobs, setCompanyJobs] = useState(id ? jobs.filter(job => job.companyId === id) : []);
  
  useEffect(() => {
    // Check if user is logged in and get user data
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        
        // If no ID was provided and we have a user, try to get their company
        // In a real app, you would fetch the company data from your database
        if (!id) {
          // For demo purposes, we'll just use the first company
          // In a real app, this would be based on the user's company association
          const userCompany = companies[0]; // This is just a placeholder
          setCompany(userCompany);
          
          if (userCompany) {
            setCompanyJobs(jobs.filter(job => job.companyId === userCompany.id));
          }
        }
      } else if (!id) {
        // If no ID was provided and user is not logged in, redirect to companies
        navigate('/companies', { replace: true });
      }
    };
    
    fetchUserData();
  }, [id, navigate]);
  
  useEffect(() => {
    // If ID was provided but company not found, redirect to companies
    if (id && !company) {
      navigate('/companies', { replace: true });
    }
  }, [company, id, navigate]);
  
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
