
import { Button } from '@/components/ui/button';

interface CompanySidebarProps {
  company: {
    name: string;
    industry: string;
    size: string;
    founded: string;
    location: string;
    website: string;
  };
}

const CompanySidebar = ({ company }: CompanySidebarProps) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-medium mb-4">Company Information</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Industry</h3>
          <p>{company.industry}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Company size</h3>
          <p>{company.size}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Founded</h3>
          <p>{company.founded}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Headquarters</h3>
          <p>{company.location}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Website</h3>
          <a 
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {company.website}
          </a>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <Button variant="outline" className="w-full">
          Follow {company.name}
        </Button>
      </div>
    </div>
  );
};

export default CompanySidebar;
