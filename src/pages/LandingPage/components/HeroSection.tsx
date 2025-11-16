import React from 'react';
import { Link } from 'react-router-dom';
import { ReactTyped } from 'react-typed';
import SearchBar from '@/components/SearchBar';

const popularSearches = [
  { label: 'Developer', href: '/jobs?q=developer' },
  { label: 'Designer', href: '/jobs?q=designer' },
  { label: 'Marketing', href: '/jobs?q=marketing' },
  { label: 'Remote', href: '/jobs?type=Remote' }
];

const HeroSection = () => {
  return (
    <section className="pt-36 pb-16 px-4 sm:px-6 lg:pt-44 lg:pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5 animate-fade-in">
              Your next career move starts here
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-balance animate-slide-up">
            Find Your Perfect Job Match
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            <ReactTyped
              strings={[
                'Discover thousands of job opportunities with all the information you need.',
                'Connect with companies that match your goals and experience.',
                'Apply faster, track progress, and land your next role sooner.'
              ]}
              typeSpeed={50}
              backSpeed={30}
              backDelay={2500}
              loop
            />
          </p>
          <div className="max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
            <SearchBar variant="inline" />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '300ms' }}>
            <span>Popular searches:</span>
            {popularSearches.map((search, index) => (
              <React.Fragment key={search.label}>
                <Link to={search.href} className="hover:text-primary transition-colors">
                  {search.label}
                </Link>
                {index < popularSearches.length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

