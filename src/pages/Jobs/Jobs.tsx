
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jobService } from '@/services/jobService';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import JobCardSkeleton from '@/components/JobCardSkeleton';
import FilterPanel from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { Job } from '@/lib/data';
import { Filter, Briefcase } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const Jobs = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    type: '',
    category: ''
  });

  const [filters, setFilters] = useState({
    location: [] as string[],
    type: [] as string[]
  });

  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Category to keyword mapping
  const categoryKeywords: Record<string, string[]> = {
    technology: ['developer', 'engineer', 'software', 'programming', 'tech', 'ios', 'android', 'full stack', 'backend', 'frontend', 'react', 'python', 'javascript', 'java', 'node'],
    design: ['designer', 'design', 'ui', 'ux', 'graphic', 'visual', 'creative', 'figma', 'sketch', 'photoshop'],
    marketing: ['marketing', 'marketer', 'seo', 'social media', 'content', 'brand', 'advertising', 'campaign', 'growth'],
    finance: ['finance', 'financial', 'accountant', 'accounting', 'analyst', 'banking', 'investment', 'trading'],
    education: ['teacher', 'educator', 'education', 'teaching', 'professor', 'instructor', 'curriculum'],
    healthcare: ['healthcare', 'health', 'medical', 'nurse', 'doctor', 'physician', 'therapist', 'clinical'],
    business: ['business', 'manager', 'management', 'consultant', 'strategy', 'operations', 'executive'],
    engineering: ['engineer', 'engineering', 'mechanical', 'electrical', 'civil', 'structural', 'systems']
  };

  // Parse query parameters when component mounts or location changes
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const locParam = params.get('location') || '';
    const typeParam = params.get('type') || '';
    const categoryParam = params.get('category') || '';

    setSearchParams({
      query,
      location: locParam,
      type: typeParam,
      category: categoryParam
    });

    // Set initial filters based on URL params
    if (locParam && locParam !== 'any') {
      setFilters(prev => ({
        ...prev,
        location: [locParam]
      }));
    }

    if (typeParam && typeParam !== 'any') {
      setFilters(prev => ({
        ...prev,
        type: [typeParam]
      }));
    }

    // Simulate loading delay for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [location]);

  // Apply search and filters
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        // Construct filters object
        const activeFilters: any = {
          query: searchParams.query,
          location: filters.location.length > 0 ? filters.location[0] : undefined, // Assuming single location for now based on service
          type: filters.type
        };

        // If 'any' is passed, remove it
        if (activeFilters.location === 'any') delete activeFilters.location;
        if (activeFilters.type === 'any') delete activeFilters.type;

        const results = await jobService.getJobs(activeFilters);
        setFilteredJobs(results);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchParams, filters]);

  const handleSearch = (values: { query: string; location: string; type: string }) => {
    setSearchParams(prev => ({ ...prev, ...values }));

    // Update filters based on search form
    if (values.location && values.location !== 'any') {
      setFilters(prev => ({
        ...prev,
        location: [values.location]
      }));
    } else if (values.location === 'any') {
      // Clear location filter when "Any location" is selected
      setFilters(prev => ({
        ...prev,
        location: []
      }));
    }

    if (values.type && values.type !== 'any') {
      setFilters(prev => ({
        ...prev,
        type: [values.type]
      }));
    } else if (values.type === 'any') {
      // Clear type filter when "Any type" is selected
      setFilters(prev => ({
        ...prev,
        type: []
      }));
    }
  };

  return (
    <AnimatedTransition>
      <main className="min-h-screen">
        <div className="pt-28 pb-8 bg-secondary/30">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-medium flex items-center gap-2">
                <Briefcase className="w-7 h-7" />
                Browse Jobs
              </h1>
              <Button
                variant="outline"
                className="md:hidden flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
            <SearchBar
              variant="inline"
              initialValues={searchParams}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
              <FilterPanel filters={filters} setFilters={setFilters} />
            </div>

            <div className="md:w-3/4 lg:w-4/5">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-muted-foreground">
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {isLoading ? (
                <div className="grid gap-4">
                  {[...Array(6)].map((_, index) => (
                    <JobCardSkeleton key={index} />
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchParams({ query: '', location: '', type: '', category: '' });
                      setFilters({ location: [], type: [] });
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AnimatedTransition>
  );
};

export default Jobs;
