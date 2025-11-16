import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: <Users className="w-5 h-5" />,
    text: "Reach 50,000+ active job seekers"
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    text: "Get quality applications fast"
  },
  {
    icon: <Clock className="w-5 h-5" />,
    text: "Post jobs in minutes"
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    text: "Manage all applications in one place"
  }
];

const EmployerCTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">For Employers</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg mb-8">
            Looking to hire? Post your job listings and reach thousands of qualified candidates. 
            Join leading companies that trust our platform to find their next great hire.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm"
            >
              <div className="mb-2 text-primary-foreground">
                {benefit.icon}
              </div>
              <p className="text-sm text-primary-foreground/90 font-medium">
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/auth/employer?signup=true">
            <Button 
              size="lg" 
              variant="secondary" 
              className="rounded-full px-8 py-6 text-lg font-semibold group"
            >
              Start Posting Jobs
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-primary-foreground/70">
            Free to post. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmployerCTASection;

