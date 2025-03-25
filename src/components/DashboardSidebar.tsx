import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, User, Building, Settings, LogOut, 
  UserCircle, Home, LayoutDashboard, PlusCircle, FileEdit
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DashboardSidebarProps {
  userType: 'jobseeker' | 'employer' | null;
  userName?: string;
  companyName?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  userType, 
  userName = 'User', 
  companyName = 'Company' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-[var(--sidebar-width)] bg-card shadow-md min-h-screen flex flex-col">
      <div className="flex items-center gap-3 p-4 mb-6">
        <div className="bg-primary/10 p-2 rounded-full">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      <div className="px-3 mb-6">
        <div className="bg-primary/5 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="font-medium truncate">
            {userType === 'jobseeker' ? userName : companyName}
          </p>
        </div>
      </div>
      
      <nav className="space-y-1 px-3 flex-1">
        <Button 
          variant={isActive("/dashboard") ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          asChild
        >
          <Link to="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        
        {userType === 'jobseeker' ? (
          <>
            <Button 
              variant={isActive("/jobs") ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              asChild
            >
              <Link to="/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Jobs
              </Link>
            </Button>
            <Button 
              variant={isActive("/profile") ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              asChild
            >
              <Link to="/profile">
                <UserCircle className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant={isActive("/jobs/manage") ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              asChild
            >
              <Link to="/jobs/manage">
                <FileEdit className="mr-2 h-4 w-4" />
                Manage Jobs
              </Link>
            </Button>
            <Button 
              variant={isActive("/post-job") ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              asChild
            >
              <Link to="/post-job">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post Job
              </Link>
            </Button>
            <Button 
              variant={isActive("/company/profile") ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              asChild
            >
              <Link to="/company/profile">
                <Building className="mr-2 h-4 w-4" />
                Company Profile
              </Link>
            </Button>
          </>
        )}
        
        <Button 
          variant={isActive("/settings") ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          asChild
        >
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </nav>
      
      <div className="p-3 mt-auto">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
