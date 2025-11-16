import React from 'react';
import { Briefcase, Building2, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  description?: string;
}

const stats: Stat[] = [
  {
    icon: <Briefcase className="w-7 h-7" />,
    value: "10,000+",
    label: "Active Jobs",
    description: "New opportunities daily"
  },
  {
    icon: <Building2 className="w-7 h-7" />,
    value: "500+",
    label: "Companies",
    description: "Top employers hiring"
  },
  {
    icon: <Users className="w-7 h-7" />,
    value: "50,000+",
    label: "Job Seekers",
    description: "Active users"
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    value: "95%",
    label: "Success Rate",
    description: "Find their match"
  }
];

const StatsSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Animated background circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/20 blur-3xl group-hover:blur-[60px] transition-all duration-700 opacity-50 group-hover:opacity-100" />
              </div>
              
              {/* Main content */}
              <div className="relative flex flex-col items-center text-center p-8">
                {/* Icon with pulsing ring */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                  <div className="relative p-5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {stat.icon}
                  </div>
                </div>
                
                {/* Value with large, bold styling */}
                <div className="mb-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    className="text-5xl md:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary group-hover:to-primary transition-all duration-500 leading-none"
                  >
                    {stat.value}
                  </motion.div>
                </div>
                
                {/* Label with underline effect */}
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 relative inline-block">
                    {stat.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                  </h3>
                </div>
                
                {/* Description */}
                {stat.description && (
                  <p className="text-sm text-muted-foreground group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                    {stat.description}
                  </p>
                )}
              </div>
              
              {/* Connecting line (desktop only) */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

