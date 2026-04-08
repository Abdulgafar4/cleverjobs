import { Activity, Bookmark, Briefcase, Eye, FileText, MessageSquare, Users } from 'lucide-react';

interface ActivityItemProps {
  activity: any;
}

export const ActivityItem = ({ activity }: ActivityItemProps) => {
  const icons = {
    application: <FileText className="h-4 w-4" />,
    saved: <Bookmark className="h-4 w-4" />,
    interview: <MessageSquare className="h-4 w-4" />,
    applicant: <Users className="h-4 w-4" />,
    job: <Briefcase className="h-4 w-4" />,
    view: <Eye className="h-4 w-4" />,
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icons[activity.type as keyof typeof icons] || <Activity className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{activity.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
      </div>
    </div>
  );
};


