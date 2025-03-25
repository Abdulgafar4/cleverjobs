
import { MapPin, Users, Calendar, Globe, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2 } from 'lucide-react';

interface CompanyInfoProps {
  name: string;
  industry: string;
  location: string;
  size: string;
  founded: string;
  website: string;
}

const CompanyInfo = ({ 
  name, 
  industry, 
  location, 
  size, 
  founded, 
  website 
}: CompanyInfoProps) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-medium mb-1">{name}</h1>
      <p className="text-muted-foreground mb-4">{industry}</p>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{size}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>Founded {founded}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {new URL(website).hostname.replace('www.', '')}
          </a>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <Button asChild>
          <a href={website} target="_blank" rel="noopener noreferrer">
            Visit Website
          </a>
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CompanyInfo;
