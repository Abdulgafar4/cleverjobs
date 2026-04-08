import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/profile">
            <FileText className="mr-2 h-4 w-4" />
            Upload/Replace Resume
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/settings">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/saved">
            <Bell className="mr-2 h-4 w-4" />
            Manage Alerts
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

