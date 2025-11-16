import { Skeleton } from '@/components/ui/skeleton';

const JobCardSkeleton = () => {
  return (
    <div className="relative h-full rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-md" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <div className="mt-3">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;

