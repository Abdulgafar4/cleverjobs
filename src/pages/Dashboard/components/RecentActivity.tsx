import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronRight, FileText, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ActivityItem {
  type: 'application' | 'interview' | 'saved' | 'message';
  message: string;
  time: string;
  status?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'application':
      return <FileText className="h-4 w-4" />;
    case 'interview':
      return <MessageSquare className="h-4 w-4" />;
    case 'saved':
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusBadge = (status?: string) => {
  if (!status) return null;
  
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    'under-review': { label: 'Under Review', variant: 'secondary' },
    'interview': { label: 'Interview', variant: 'default' },
    'applied': { label: 'Applied', variant: 'outline' },
    'offer': { label: 'Offer', variant: 'default' },
  };
  
  const statusInfo = statusMap[status] || { label: status, variant: 'outline' };
  
  return (
    <Badge variant={statusInfo.variant} className="text-xs">
      {statusInfo.label}
    </Badge>
  );
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.slice(0, 3).map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="mt-0.5 text-muted-foreground">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                {activity.status && getStatusBadge(activity.status)}
              </div>
            </div>
          </div>
        ))}
        <Button variant="ghost" className="w-full justify-center text-sm" asChild>
          <Link to="/applications">
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

