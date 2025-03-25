
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyHeaderProps {
  companyName: string;
  industry: string;
  logo?: string;
  coverImage?: string;
  website: string;
}

const CompanyHeader = ({ 
  companyName, 
  industry, 
  logo, 
  coverImage,
  website 
}: CompanyHeaderProps) => {
  return (
    <>
      <div 
        className="h-64 md:h-80 bg-secondary/80 relative"
        style={{
          backgroundImage: coverImage ? `url(${coverImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto h-full relative">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white rounded-xl border shadow-md p-3 w-[90px] h-[90px] flex items-center justify-center">
            {logo ? (
              <img 
                src={logo} 
                alt={`${companyName} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=' + companyName.charAt(0);
                }}
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-3xl">
                {companyName.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pt-20 pb-6">
        <div className="mb-6">
          <Link 
            to="/companies"
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to companies
          </Link>
        </div>
      </div>
    </>
  );
};

export default CompanyHeader;
