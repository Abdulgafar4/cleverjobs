
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import FeaturedJobs from '@/components/FeaturedJobs';
import { jobs, companies } from '@/lib/data';
import CompanyCard from '@/components/CompanyCard';
import { ArrowRight, Briefcase, Building2, Search, FilterX } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const Index = () => {
  const featuredCompanies = companies.slice(0, 4);

  return (
    <AnimatedTransition>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-36 pb-16 px-4 sm:px-6 lg:pt-44 lg:pb-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5 animate-fade-in">
                  Your next career move starts here
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-balance animate-slide-up">
                Find Your Perfect Job Match
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
                Discover thousands of job opportunities with all the information you need. Your future career is waiting for you.
              </p>
              <div className="max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
                <SearchBar />
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '300ms' }}>
                <span>Popular searches:</span>
                <Link to="/jobs?q=developer" className="hover:text-primary transition-colors">
                  Developer
                </Link>
                <span>•</span>
                <Link to="/jobs?q=designer" className="hover:text-primary transition-colors">
                  Designer
                </Link>
                <span>•</span>
                <Link to="/jobs?q=marketing" className="hover:text-primary transition-colors">
                  Marketing
                </Link>
                <span>•</span>
                <Link to="/jobs?type=Remote" className="hover:text-primary transition-colors">
                  Remote
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        </section>

        {/* Featured Jobs Section */}
        <FeaturedJobs jobs={jobs} />

        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Finding your dream job has never been easier. Just follow these simple steps and you're good to go.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Search Jobs</h3>
                <p className="text-muted-foreground">
                  Find the perfect job that matches your skills and preferences using our advanced search and filtering.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <FilterX className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Filter Results</h3>
                <p className="text-muted-foreground">
                  Narrow down your search with specific criteria like location, job type, and salary range.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Apply for Jobs</h3>
                <p className="text-muted-foreground">
                  Once you've found the perfect job, submit your application with just a few clicks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Companies Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-medium mb-2">Featured Companies</h2>
                <p className="text-muted-foreground">
                  Discover top companies that are hiring now.
                </p>
              </div>
              <Link to="/companies" className="mt-4 md:mt-0">
                <Button variant="ghost" className="gap-1 group">
                  View all companies
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-medium mb-6">For Employers</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
              Looking to hire? Post your job listings and reach thousands of job seekers.
            </p>
            <Button size="lg" variant="secondary" className="rounded-full">
              Post a Job
            </Button>
          </div>
        </section>
      </main>
    </AnimatedTransition>
  );
};

export default Index;
