import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CompanyCard from '@/components/CompanyCard';
import type { Company } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

interface FeaturedCompaniesSectionProps {
  companies: Company[];
}

const FeaturedCompaniesSection = ({ companies }: FeaturedCompaniesSectionProps) => {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-medium mb-2">Featured Companies</h2>
            <p className="text-muted-foreground">
              Discover top companies that are hiring now.
            </p>
          </div>
          <Link to="/companies" className="mt-4 md:mt-0">
            <Button variant="ghost" className="gap-1 group">
              View all companies
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompaniesSection;

