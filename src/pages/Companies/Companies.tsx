
import { useState } from 'react';
import { companies } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CompanyCard from '@/components/CompanyCard';
import { Search, Building2 } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredCompanies(companies);
      return;
    }
    
    const results = companies.filter(company => 
      company.name.toLowerCase().includes(term.toLowerCase()) ||
      company.industry.toLowerCase().includes(term.toLowerCase()) ||
      company.location.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredCompanies(results);
  };

  return (
    <AnimatedTransition>
      <main className="min-h-screen">
        <div className="pt-28 pb-8 bg-secondary/30">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-medium flex items-center gap-2">
                <Building2 className="w-7 h-7" />
                Companies
              </h1>
            </div>
            <div className="max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search companies by name, industry or location"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-8">
          <div className="mb-4">
            <p className="text-muted-foreground">
              {filteredCompanies.length} compan{filteredCompanies.length !== 1 ? 'ies' : 'y'} found
            </p>
          </div>
          
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No companies found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any companies matching your search criteria
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilteredCompanies(companies);
                }}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </main>
    </AnimatedTransition>
  );
};

export default Companies;
