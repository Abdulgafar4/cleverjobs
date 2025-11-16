
import { Link } from 'react-router-dom';
import { Job } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Briefcase, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { trackJobShare } from '@/lib/analytics';

interface JobCardProps {
  job: Job;
  variant?: 'default' | 'featured';
  className?: string;
}

const JobCard = ({ job, variant = 'default', className = '' }: JobCardProps) => {
  const isFeatured = variant === 'featured' || job.featured;
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    const shareData = {
      title: `${job.title} at ${job.company}`,
      text: `Check out this job: ${job.title} at ${job.company} - ${job.location}`,
      url: jobUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        trackJobShare(job.id, job.title);
        toast({
          title: "Shared!",
          description: "Job link shared successfully",
        });
      } else {
        // Fallback: Copy to clipboard with job details
        const shareMessage = `${job.title} at ${job.company}\n${job.location}\n\n${jobUrl}`;
        await navigator.clipboard.writeText(shareMessage);
        trackJobShare(job.id, job.title);
        toast({
          title: "Link copied!",
          description: "Job details copied to clipboard",
        });
      }
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        // Fallback: Copy to clipboard with job details
        try {
          const shareMessage = `${job.title} at ${job.company}\n${job.location}\n\n${jobUrl}`;
          await navigator.clipboard.writeText(shareMessage);
          toast({
            title: "Link copied!",
            description: "Job details copied to clipboard",
          });
        } catch (clipboardError) {
          toast({
            title: "Error",
            description: "Failed to share job",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <div
      className={cn(
        'group relative',
        className
      )}
    >
      <Link 
        to={`/jobs/${job.id}`}
        className="block"
      >
      <div className={cn(
        'relative h-full rounded-xl p-5 border transition-all duration-300 overflow-hidden',
        isFeatured
          ? 'border-primary/50 bg-white/90 shadow-lg shadow-primary/15'
          : 'border-primary/30 bg-card/60 hover:border-primary/60 hover:shadow-lg/20',
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
      
      {/* Share button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-slate-900 z-10"
        aria-label="Share job"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default JobCard;
