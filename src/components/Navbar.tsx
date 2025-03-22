
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Briefcase } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          className="flex items-center space-x-2 text-primary font-semibold text-xl transition-opacity hover:opacity-80"
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
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="rounded-full">
            Sign In
          </Button>
          <Button className="rounded-full">
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
      
      {/* Mobile Menu */}
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
            <div className="pt-2 flex flex-col space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Sign In
              </Button>
              <Button className="w-full justify-start">
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
