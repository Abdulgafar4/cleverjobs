
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { jobTypes, locations } from '@/lib/data';

interface FilterPanelProps {
  filters: {
    location: string[];
    type: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    location: string[];
    type: string[];
  }>>;
}

const FilterPanel = ({ filters, setFilters }: FilterPanelProps) => {
  const toggleLocationFilter = (location: string) => {
    setFilters(prev => {
      const newLocations = prev.location.includes(location)
        ? prev.location.filter(l => l !== location)
        : [...prev.location, location];
      
      return { ...prev, location: newLocations };
    });
  };
  
  const toggleTypeFilter = (type: string) => {
    setFilters(prev => {
      const newTypes = prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type];
      
      return { ...prev, type: newTypes };
    });
  };

  const clearAllFilters = () => {
    setFilters({ location: [], type: [] });
  };
  
  const hasActiveFilters = filters.location.length > 0 || filters.type.length > 0;
  
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-8 text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
      
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.location.map(location => (
            <Badge 
              key={`active-${location}`} 
              variant="secondary"
              className="flex gap-1 items-center px-2 py-1"
            >
              {location}
              <button 
                onClick={() => toggleLocationFilter(location)}
                className="ml-1 hover:text-foreground text-muted-foreground rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.type.map(type => (
            <Badge 
              key={`active-${type}`} 
              variant="secondary"
              className="flex gap-1 items-center px-2 py-1"
            >
              {type}
              <button 
                onClick={() => toggleTypeFilter(type)}
                className="ml-1 hover:text-foreground text-muted-foreground rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Location</h4>
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox 
                  id={`location-${location}`} 
                  checked={filters.location.includes(location)}
                  onCheckedChange={() => toggleLocationFilter(location)}
                />
                <label 
                  htmlFor={`location-${location}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2">Job Type</h4>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type}`} 
                  checked={filters.type.includes(type)}
                  onCheckedChange={() => toggleTypeFilter(type)}
                />
                <label 
                  htmlFor={`type-${type}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
