import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ApplicantItemProps {
  applicant: any;
}

export const ApplicantItem = ({ applicant }: ApplicantItemProps) => {
  const statusColors = {
    'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'reviewed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'hired': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold">{applicant.name}</h4>
          <Badge className={cn("text-xs", statusColors[applicant.status as keyof typeof statusColors] || statusColors.new)}>
            {applicant.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{applicant.job}</p>
        <p className="text-xs text-muted-foreground mt-1">{applicant.date}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};


