"use client";

import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Found my dream job in just 2 weeks! The platform made it so easy to connect with amazing companies.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    name: "Sarah Chen",
    role: "Software Engineer"
  },
  {
    text: "As a recruiter, this platform has transformed how we find talent. The quality of candidates is outstanding.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    name: "Michael Rodriguez",
    role: "HR Director"
  },
  {
    text: "The best job board I've used. Clean interface, great filters, and real opportunities from top companies.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    name: "Emily Johnson",
    role: "Product Designer"
  },
  {
    text: "We've hired 5 amazing developers through this platform. It's become our go-to for tech talent.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    name: "David Kim",
    role: "CTO"
  },
  {
    text: "Love how easy it is to apply and track applications. Got multiple interviews within days!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    name: "Jessica Martinez",
    role: "Marketing Manager"
  },
  {
    text: "The company profiles are so detailed. I knew exactly what I was getting into before applying.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    name: "Alex Thompson",
    role: "Data Scientist"
  }
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-white dark:bg-slate-900" key={i}>
                  <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-slate-900 dark:text-white">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight text-sm text-slate-600 dark:text-slate-400">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  // Split testimonials into columns for better visual effect
  const column1 = testimonials.slice(0, 2);
  const column2 = testimonials.slice(2, 4);
  const column3 = testimonials.slice(4, 6);

  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">What People Say</h2>
          <p className="text-muted-foreground text-lg">Hear from job seekers and employers who found success on our platform</p>
        </div>
        
        <div className="hidden md:flex gap-6 justify-center items-start">
          <div className="h-[600px] overflow-hidden">
            <TestimonialsColumn testimonials={column1} duration={15} />
          </div>
          <div className="h-[600px] overflow-hidden">
            <TestimonialsColumn testimonials={column2} duration={20} />
          </div>
          <div className="h-[600px] overflow-hidden">
            <TestimonialsColumn testimonials={column3} duration={18} />
          </div>
        </div>
        
        {/* Mobile view - single column */}
        <div className="md:hidden flex justify-center">
          <div className="h-[500px] overflow-hidden w-full max-w-xs">
            <TestimonialsColumn testimonials={testimonials} duration={20} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

