
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
import { Search, MapPin } from 'lucide-react';
import { jobTypes, locations } from '@/lib/data';

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
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (variant === 'default' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [variant]);

  const handleSearch = () => {
    const searchValues = { query, location, type };
    
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
    }
  };

  if (variant === 'inline') {
    return (
      <div className={`flex flex-col md:flex-row md:items-center gap-3 ${className}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Job title, keywords, or company"
            className="pl-9 h-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Job title, keywords, or company"
            className="pl-10 h-12 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
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
