
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Job } from '@/lib/data';
import JobCard from './JobCard';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface FeaturedJobsProps {
  jobs: Job[];
  title?: string;
  viewAllLink?: string;
}

const FeaturedJobs = ({ jobs, title = "Featured Jobs", viewAllLink = "/jobs" }: FeaturedJobsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredJobs = jobs.filter(job => job.featured).slice(0, 6);
  
  if (filteredJobs.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-medium">{title}</h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10"
                onClick={() => scroll('left')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10"
                onClick={() => scroll('right')}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <Link to={viewAllLink}>
              <Button variant="ghost" className="gap-1 group">
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredJobs.map(job => (
            <div key={job.id} className="w-[350px] min-w-[350px] animate-fade-in">
              <JobCard job={job} variant="featured" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
