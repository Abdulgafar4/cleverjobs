import { useState, useEffect } from 'react';
import FeaturedJobs from '@/components/FeaturedJobs';
import { companies, Job } from '@/lib/data';
import { jobService } from '@/services/jobService';
import AnimatedTransition from '@/components/AnimatedTransition';
import HeroSection from './components/HeroSection';
import LogoMarqueeSection from './components/LogoMarqueeSection';
import StatsSection from './components/StatsSection';
import JobCategoriesSection from './components/JobCategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import FeaturedCompaniesSection from './components/FeaturedCompaniesSection';
import NewsletterSection from './components/NewsletterSection';
import EmployerCTASection from './components/EmployerCTASection';
import ResumeUploadSection from './components/ResumeUploadSection';
import ScrollToTop from '@/components/ScrollToTop';
import AnalyticsDebugPanel from '@/components/AnalyticsDebugPanel';

const Index = () => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const featuredCompanies = companies.slice(0, 4);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await jobService.getFeaturedJobs();
      setFeaturedJobs(jobs);
    };
    fetchJobs();
  }, []);

  return (
    <AnimatedTransition>
      <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 dark:from-primary/20 dark:via-transparent dark:to-primary/15" />
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <HeroSection />
          <LogoMarqueeSection companies={companies} />
          <StatsSection />
          <FeaturedJobs jobs={featuredJobs} />
          <JobCategoriesSection />
          <TestimonialsSection />
          <HowItWorksSection />
          <ResumeUploadSection />
          <FeaturesSection />
          <FeaturedCompaniesSection companies={featuredCompanies} />
          <NewsletterSection />
          <EmployerCTASection />
        </div>
        <ScrollToTop />
        <AnalyticsDebugPanel />
      </main>
    </AnimatedTransition>
  );
};

export default Index;