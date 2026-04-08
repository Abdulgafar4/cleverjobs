import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Briefcase, ChevronRight, DollarSign, MapPin, Users } from 'lucide-react';

interface JobItemProps {
  job: any;
  userType: 'jobseeker' | 'employer' | null;
}

export const JobItem = ({ job, userType }: JobItemProps) => {
  const jobUrl = userType === 'jobseeker' ? `/jobs/${job.id}` : `/jobs/${job.id}`;
  
  return (
    <Link to={jobUrl}>
      <div className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold group-hover:text-primary transition-colors">
            {job.title || job.name}
          </h4>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {job.salary}
              </span>
            )}
            {job.type && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.type}
              </span>
            )}
            {userType === 'employer' && job.applicants !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {job.applicants} applicants
              </span>
            )}
            {userType === 'employer' && job.status && (
              <Badge variant="outline" className="text-xs">
                {job.status}
              </Badge>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
};


