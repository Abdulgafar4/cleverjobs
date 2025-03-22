
import { Link } from 'react-router-dom';
import { Company } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Users } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

const CompanyCard = ({ company, className = '' }: CompanyCardProps) => {
  return (
    <Link 
      to={`/companies/${company.id}`}
      className={`block group ${className}`}
    >
      <div className="relative h-full rounded-xl border border-border bg-card/50 hover:border-primary/20 hover:shadow-sm transition-all duration-300 overflow-hidden">
        {company.coverImage && (
          <div className="h-32 overflow-hidden">
            <img 
              src={company.coverImage} 
              alt={`${company.name} cover`}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border bg-white flex items-center justify-center -mt-10 shadow-sm">
              {company.logo ? (
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=' + company.name.charAt(0);
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {company.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                {company.name}
              </h3>
              <p className="text-muted-foreground mt-1">{company.industry}</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{company.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{company.size}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>{new URL(company.website).hostname.replace('www.', '')}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-foreground/80 line-clamp-2">
              {company.description}
            </p>
          </div>
          
          {company.jobs && company.jobs.length > 0 && (
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                {company.jobs.length} open position{company.jobs.length > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
