import { Link } from 'react-router-dom';
import type { Company } from '@/lib/data';

interface LogoMarqueeSectionProps {
  companies: Company[];
}

const LogoMarqueeSection = ({ companies }: LogoMarqueeSectionProps) => {
  const marqueeCompanies = [...companies.slice(0, 8), ...companies.slice(0, 8)];

  return (
    <section className="py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground mb-8">
          Trusted by leading teams
        </p>
        <div className="relative overflow-hidden">
          <div className="logo-marquee items-center gap-10 py-6 pl-10 pr-10">
            {marqueeCompanies.map((company, index) => (
              <Link
                key={`${company.id}-${index}`}
                to={`/companies/${company.id}`}
                className="flex items-center gap-3 group hover:opacity-80 transition-opacity duration-300"
              >
                <div className="w-10 h-10 rounded-lg border border-primary/10 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all duration-300">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=' + company.name.charAt(0);
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap group-hover:text-primary transition-colors duration-300">
                  {company.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoMarqueeSection;

