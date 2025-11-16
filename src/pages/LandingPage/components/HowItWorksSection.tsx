import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Users, ArrowRight, LucideIcon } from 'lucide-react';
import { Timeline } from '@/components/ui/timeline';

interface StepData {
  stepNumber: string;
  description: string;
  title: string;
  icon: LucideIcon;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

const stepsData: StepData[] = [
  {
    stepNumber: "01",
    description: "Create your free account and build your profile. Add your skills, experience, and career preferences to help us match you with the right opportunities.",
    title: "Create Your Profile",
    icon: Users,
    features: [
      "Sign up in less than 2 minutes",
      "Add your skills and work experience",
      "Upload your resume",
      "Set your job preferences and alerts"
    ],
    ctaLabel: "Get Started",
    ctaHref: "/auth"
  },
  {
    stepNumber: "02",
    description: "Browse and search through thousands of job opportunities. Use our advanced filters to find positions that match your skills, location, and salary expectations.",
    title: "Search & Browse Jobs",
    icon: Search,
    features: [
      "Browse thousands of job listings",
      "Advanced filters by location, salary, and type",
      "Save jobs you're interested in",
      "Get personalized job recommendations"
    ],
    ctaLabel: "Browse Jobs",
    ctaHref: "/jobs"
  },
  {
    stepNumber: "03",
    description: "Apply to jobs with one click. Track your applications, get updates from employers, and land your dream job faster.",
    title: "Apply & Get Hired",
    icon: ArrowRight,
    features: [
      "Quick and easy application process",
      "Track all your applications in one place",
      "Receive updates from employers",
      "Get matched with opportunities"
    ],
    ctaLabel: "Start Applying",
    ctaHref: "/jobs"
  }
];

const CheckmarkIcon = () => (
  <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const FeatureItem = ({ feature }: { feature: string }) => (
  <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
      <CheckmarkIcon />
    </div>
    <span>{feature}</span>
  </li>
);

const StepCard = ({ step }: { step: StepData }) => {
  const Icon = step.icon;
  
  return (
    <div>
      <p className="text-neutral-900 dark:text-neutral-200 text-lg md:text-sm font-medium mb-4">
        {step.description}
      </p>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h3>
          </div>
        </div>
        <ul className="space-y-3 mb-6">
          {step.features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} />
          ))}
        </ul>
        <Link
          to={step.ctaHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-primary text-primary-foreground shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group/link"
        >
          {step.ctaLabel}
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const data = stepsData.map((step) => ({
    title: `Step ${step.stepNumber}`,
    content: <StepCard step={step} />
  }));

  return (
    <section className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground text-lg">Your journey to the perfect job in three simple steps</p>
        </div>
        <Timeline data={data} showHeader={false} />
        <footer className="text-center mt-5">
          <div className="inline-flex items-center gap-2 text-primary text-sm bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-md">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-medium">JobBoard = community</span>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default HowItWorksSection;