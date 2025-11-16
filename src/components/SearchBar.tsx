
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, MapPin, TrendingUp } from 'lucide-react';
import { jobTypes, locations, jobs } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { trackSearch } from '@/lib/analytics';

interface SearchBarProps {
  className?: string;
  variant?: 'default' | 'inline';
  initialValues?: {
    query?: string;
    location?: string;
    type?: string;
  };
  onSearch?: (values: { query: string; location: string; type: string }) => void;
}

const SearchBar = ({ 
  className = '', 
  variant = 'default',
  initialValues = {},
  onSearch
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValues.query || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [type, setType] = useState(initialValues.type || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Generate search suggestions from jobs data
  useEffect(() => {
    if (query.length > 0) {
      const searchTerm = query.toLowerCase();
      const jobTitles = [...new Set(jobs.map(job => job.title))];
      const companies = [...new Set(jobs.map(job => job.company))];
      const allSuggestions = [...jobTitles, ...companies];
      
      const filtered = allSuggestions
        .filter(item => item.toLowerCase().includes(searchTerm))
        .slice(0, 5);
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (variant === 'default' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [variant]);

  const handleSearch = () => {
    const searchValues = { query, location, type };
    
    // Track search
    trackSearch(query, location !== 'any' ? location : undefined, type !== 'any' ? type : undefined);
    
    if (onSearch) {
      onSearch(searchValues);
    } else {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (location) params.append('location', location);
      if (type) params.append('type', type);
      
      navigate(`/jobs?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  if (variant === 'inline') {
    return (
      <div className={`flex flex-col md:flex-row md:items-center gap-3 ${className}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Job title, keywords, or company"
            className="pl-9 h-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
          />
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex gap-3">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[180px] h-10">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any location</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full md:w-[180px] h-10">
              <SelectValue placeholder="Job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any type</SelectItem>
              {jobTypes.map((jobType) => (
                <SelectItem key={jobType} value={jobType}>{jobType}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleSearch} size="sm" className="h-10">
            Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass rounded-xl p-4 md:p-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Job title, keywords, or company"
            className="pl-10 h-12 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
          />
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative md:w-[220px]">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="pl-10 h-12 text-lg">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any location</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:w-[200px]">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any type</SelectItem>
              {jobTypes.map((jobType) => (
                <SelectItem key={jobType} value={jobType}>{jobType}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSearch} className="h-12 text-lg px-6">
          Search Jobs
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
