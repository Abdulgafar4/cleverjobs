
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Briefcase, Plus, User, Settings, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, userType, userMetadata, isAuthenticated } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (userMetadata?.first_name && userMetadata?.last_name) {
      return `${userMetadata.first_name} ${userMetadata.last_name}`;
    }
    if (userMetadata?.first_name) {
      return userMetadata.first_name;
    }
    if (userMetadata?.company_name) {
      return userMetadata.company_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userMetadata?.first_name && userMetadata?.last_name) {
      return `${userMetadata.first_name[0]}${userMetadata.last_name[0]}`.toUpperCase();
    }
    if (userMetadata?.first_name) {
      return userMetadata.first_name[0].toUpperCase();
    }
    if (userMetadata?.company_name) {
      return userMetadata.company_name[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // If user is logged in, show minimal navbar (no logo, different nav)
  if (isAuthenticated && user) {
    return (
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-3 px-4 md:px-6',
          'bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logged-in Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'}
              className="rounded-lg"
              asChild
            >
              <Link to="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            {userType === 'jobseeker' && (
              <Button
                variant={location.pathname === '/jobs' ? 'secondary' : 'ghost'}
                className="rounded-lg"
                asChild
              >
                <Link to="/jobs">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
            )}
            {userType === 'employer' && (
              <>
                <Button
                  variant={location.pathname === '/jobs/manage' ? 'secondary' : 'ghost'}
                  className="rounded-lg"
                  asChild
                >
                  <Link to="/jobs/manage">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Manage Jobs
                  </Link>
                </Button>
                <Button
                  variant={location.pathname === '/post-job' ? 'secondary' : 'ghost'}
                  className="rounded-lg"
                  asChild
                >
                  <Link to="/post-job">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Job
                  </Link>
                </Button>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-lg h-10 px-3 gap-2 hover:bg-secondary/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium max-w-[150px] truncate">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        {/* Mobile Menu for Logged-in Users */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-border/50 shadow-lg">
            <nav className="flex flex-col p-4 space-y-2">
              <Button
                variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              {userType === 'jobseeker' && (
                <Button
                  variant={location.pathname === '/jobs' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
              )}
              {userType === 'employer' && (
                <>
                  <Button
                    variant={location.pathname === '/jobs/manage' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/jobs/manage" onClick={() => setMobileMenuOpen(false)}>
                      <Briefcase className="w-4 h-4 mr-2" />
                      Manage Jobs
                    </Link>
                  </Button>
                  <Button
                    variant={location.pathname === '/post-job' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/post-job" onClick={() => setMobileMenuOpen(false)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Post Job
                    </Link>
                  </Button>
                </>
              )}
              <Button
                variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button
                variant={location.pathname === '/settings' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <div className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    );
  }

  // Public navbar (not logged in)
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-4 md:px-6',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2.5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm text-primary font-semibold text-xl transition-all hover:opacity-80 hover:shadow-md"
        >
          <Briefcase className="w-6 h-6" />
          <span>JobBoard</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/jobs" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Browse Jobs
          </Link>
          <Link 
            to="/companies" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Companies
          </Link>
          <Link 
            to="/faq" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="rounded-full" 
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
          <Button 
            className="rounded-full" 
            onClick={() => navigate('/auth/employer?signup=true')}
          >
            Post a Job
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Mobile Menu for Public */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg shadow-md border-t border-border/50 animate-slide-down">
          <nav className="flex flex-col p-4 space-y-3">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Jobs
            </Link>
            <Link 
              to="/companies" 
              className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Companies
            </Link>
            <Link 
              to="/faq" 
              className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="pt-2 flex flex-col space-y-2 border-t border-border/50">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button 
                className="w-full justify-start" 
                onClick={() => {
                  navigate('/auth/employer?signup=true');
                  setMobileMenuOpen(false);
                }}
              >
                Post a Job
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
