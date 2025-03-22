
import { Link } from 'react-router-dom';
import { Job } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  variant?: 'default' | 'featured';
  className?: string;
}

const JobCard = ({ job, variant = 'default', className = '' }: JobCardProps) => {
  const isFeatured = variant === 'featured' || job.featured;

  return (
    <Link 
      to={`/jobs/${job.id}`}
      className={cn(
        'block group',
        className
      )}
    >
      <div className={cn(
        'relative h-full rounded-xl p-5 border transition-all duration-300 overflow-hidden',
        isFeatured ? 'shadow-md border-primary/20 bg-white' : 'border-border bg-card/50 hover:border-primary/20 hover:shadow-sm',
      )}>
        {isFeatured && (
          <div className="absolute top-0 right-0">
            <Badge variant="default" className="rounded-bl-lg rounded-tr-lg rounded-tl-none rounded-br-none">
              Featured
            </Badge>
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border bg-white flex items-center justify-center">
            {job.logo ? (
              <img 
                src={job.logo} 
                alt={`${job.company} logo`}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + job.company.charAt(0);
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {job.company.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {job.title}
                </h3>
                <p className="text-muted-foreground mt-1">{job.company}</p>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{job.posted}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-foreground/90 line-clamp-2">
                {job.salary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
