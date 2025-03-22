
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jobs } from '@/lib/data';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
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
    type: ''
  });
  
  const [filters, setFilters] = useState({
    location: [] as string[],
    type: [] as string[]
  });
  
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse query parameters when component mounts or location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const locParam = params.get('location') || '';
    const typeParam = params.get('type') || '';
    
    setSearchParams({
      query,
      location: locParam,
      type: typeParam
    });
    
    // Set initial filters based on URL params
    if (locParam) {
      setFilters(prev => ({
        ...prev,
        location: [locParam]
      }));
    }
    
    if (typeParam) {
      setFilters(prev => ({
        ...prev,
        type: [typeParam]
      }));
    }
  }, [location]);
  
  // Apply search and filters
  useEffect(() => {
    let results = [...jobs];
    
    // Apply text search
    if (searchParams.query) {
      const searchTerms = searchParams.query.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerms) ||
        job.company.toLowerCase().includes(searchTerms) ||
        job.description.toLowerCase().includes(searchTerms)
      );
    }
    
    // Apply location filters
    if (filters.location.length > 0) {
      results = results.filter(job => filters.location.includes(job.location));
    }
    
    // Apply job type filters
    if (filters.type.length > 0) {
      results = results.filter(job => filters.type.includes(job.type));
    }
    
    setFilteredJobs(results);
  }, [searchParams, filters]);
  
  const handleSearch = (values: { query: string; location: string; type: string }) => {
    setSearchParams(values);
    
    // Update filters based on search form
    if (values.location) {
      setFilters(prev => ({
        ...prev,
        location: [values.location]
      }));
    }
    
    if (values.type) {
      setFilters(prev => ({
        ...prev,
        type: [values.type]
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
              
              {filteredJobs.length > 0 ? (
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
                      setSearchParams({ query: '', location: '', type: '' });
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
