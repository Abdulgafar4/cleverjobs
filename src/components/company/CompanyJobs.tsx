
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import JobCard from '@/components/JobCard';

interface CompanyJobsProps {
  companyName: string;
  jobs: any[];
}

const CompanyJobs = ({ companyName, jobs }: CompanyJobsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Open Positions
        </h2>
        <Badge variant="outline">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      {jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border">
          <h3 className="text-lg font-medium mb-2">No open positions</h3>
          <p className="text-muted-foreground">
            {companyName} doesn't have any job listings at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;
