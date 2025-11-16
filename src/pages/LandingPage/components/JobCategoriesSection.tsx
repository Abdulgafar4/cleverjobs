import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackCategoryClick } from '@/lib/analytics';
import { 
  Code, 
  Palette, 
  Megaphone, 
  DollarSign, 
  GraduationCap, 
  Stethoscope,
  Briefcase,
  Wrench,
  ArrowRight
} from 'lucide-react';

interface Category {
  icon: React.ReactNode;
  name: string;
  count: string;
  href: string;
}

const categories: Category[] = [
  {
    icon: <Code className="w-6 h-6" />,
    name: "Technology",
    count: "2,500+",
    href: "/jobs?category=technology"
  },
  {
    icon: <Palette className="w-6 h-6" />,
    name: "Design",
    count: "800+",
    href: "/jobs?category=design"
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    name: "Marketing",
    count: "1,200+",
    href: "/jobs?category=marketing"
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    name: "Finance",
    count: "900+",
    href: "/jobs?category=finance"
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    name: "Education",
    count: "600+",
    href: "/jobs?category=education"
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    name: "Healthcare",
    count: "1,100+",
    href: "/jobs?category=healthcare"
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    name: "Business",
    count: "1,500+",
    href: "/jobs?category=business"
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    name: "Engineering",
    count: "1,800+",
    href: "/jobs?category=engineering"
  }
];

const JobCategoriesSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-3">Browse by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore opportunities across different industries and find your perfect match
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
                    <Link
                      to={category.href}
                      className="group relative block p-6 md:p-8"
                      onClick={() => trackCategoryClick(category.name)}
                    >
                {/* Animated background glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
                
                {/* Main content container */}
                <div className="relative flex flex-col items-center text-center">
                  {/* Icon with animated rings */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-75" />
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                    <div className="relative p-4 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/50 transition-all duration-500">
                      {category.icon}
                    </div>
                  </div>
                  
                  {/* Category name */}
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 relative">
                    {category.name}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                  </h3>
                  
                  {/* Job count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                    <span className="font-semibold">{category.count}</span>
                    <span>jobs</span>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
                
                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategoriesSection;

