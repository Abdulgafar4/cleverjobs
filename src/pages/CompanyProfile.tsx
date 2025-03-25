
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companies, jobs } from '@/lib/data';
import AnimatedTransition from '@/components/AnimatedTransition';
import CompanyHeader from '@/components/company/CompanyHeader';
import CompanyInfo from '@/components/company/CompanyInfo';
import CompanyDescription from '@/components/company/CompanyDescription';
import CompanyJobs from '@/components/company/CompanyJobs';
import CompanySidebar from '@/components/company/CompanySidebar';

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
