import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Shield, 
  Zap, 
  Target, 
  Heart,
  Sparkles
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

const features: Feature[] = [
  {
    icon: <Search className="w-7 h-7" />,
    title: "Smart Job Matching",
    description: "AI-powered recommendations that match your skills and preferences with the perfect opportunities.",
    stat: "98%",
    statLabel: "Match Accuracy"
  },
  {
    icon: <Bell className="w-7 h-7" />,
    title: "Real-time Alerts",
    description: "Get instant notifications when new jobs matching your criteria are posted.",
    stat: "< 1min",
    statLabel: "Alert Speed"
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Verified Companies",
    description: "All companies are verified to ensure you're applying to legitimate opportunities.",
    stat: "100%",
    statLabel: "Verified"
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Quick Applications",
    description: "Apply to multiple jobs in seconds with our streamlined application process.",
    stat: "3x",
    statLabel: "Faster"
  },
  {
    icon: <Target className="w-7 h-7" />,
    title: "Advanced Filters",
    description: "Find exactly what you're looking for with powerful search and filter options.",
    stat: "50+",
    statLabel: "Filters"
  },
  {
    icon: <Heart className="w-7 h-7" />,
    title: "Save & Organize",
    description: "Save your favorite jobs and organize applications all in one place.",
    stat: "∞",
    statLabel: "Unlimited"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Why We Stand Out</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to find your next opportunity, all in one place
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative perspective-1000"
            >
              {/* Animated background glow with multiple layers */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" style={{ transitionDelay: '100ms' }} />
              
              {/* Main content with 3D transform */}
              <motion.div
                whileHover={{ rotateY: 2, rotateX: 2 }}
                transition={{ duration: 0.3 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-slate-50/90 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 group-hover:border-primary/60 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:-translate-y-3 cursor-pointer"
              >
                {/* Animated grid pattern overlay */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  backgroundImage: `linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }} />
                
                {/* Icon with multiple animated effects */}
                <div className="relative mb-6 inline-block">
                  {/* Outer ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-primary/20 opacity-0 group-hover:opacity-100"
                  />
                  {/* Middle glow */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl group-hover:blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                  {/* Inner glow pulse */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse" />
                  {/* Icon container */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative p-4 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-lg shadow-primary/40 group-hover:shadow-primary/60 transition-all duration-500"
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                
                {/* Stat badge */}
                {feature.stat && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    {feature.stat}
                  </motion.div>
                )}
                
                {/* Title with gradient effect */}
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/80 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300 mb-4">
                  {feature.description}
                </p>
                
                {/* Stat label */}
                {feature.statLabel && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {feature.statLabel}
                  </div>
                )}
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/50 rounded-full group-hover:w-full transition-all duration-700" />
                
                {/* Side accent line */}
                <div className="absolute left-0 top-0 w-1.5 h-0 bg-gradient-to-b from-primary via-primary/80 to-primary/50 rounded-full group-hover:h-full transition-all duration-700" style={{ transitionDelay: '100ms' }} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

