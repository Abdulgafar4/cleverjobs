import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  HelpCircle, 
  ArrowLeft,
  MessageCircle,
  Mail,
  Sparkles
} from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqCategories = ['All', 'Getting Started', 'Job Search', 'Applications', 'Account', 'For Employers'];

const allFaqs: FAQ[] = [
  // Getting Started
  {
    question: "How do I create an account?",
    answer: "Creating an account is simple and free! Click on the 'Sign Up' button in the top right corner, choose whether you're a job seeker or employer, enter your email and password, and you're all set. The entire process takes less than a minute.",
    category: "Getting Started"
  },
  {
    question: "Is it free to use?",
    answer: "Yes! Creating an account and applying for jobs is completely free for job seekers. Employers can post jobs for free as well, with optional premium features available for enhanced visibility and advanced analytics.",
    category: "Getting Started"
  },
  {
    question: "What information do I need to create an account?",
    answer: "You'll need a valid email address and a password. Optionally, you can add your resume, work experience, and skills to make your profile more attractive to employers. All information is kept secure and private.",
    category: "Getting Started"
  },
  // Job Search
  {
    question: "How do I search for jobs?",
    answer: "Use our powerful search bar at the top of the page. You can search by job title, company name, location, or keywords. Use our advanced filters to narrow down results by salary range, job type (full-time, part-time, remote), experience level, and more.",
    category: "Job Search"
  },
  {
    question: "How do I get notified about new jobs?",
    answer: "You can set up job alerts by saving your search criteria. We'll send you email notifications when new jobs matching your preferences are posted. You can also enable push notifications in your account settings for instant updates.",
    category: "Job Search"
  },
  {
    question: "Can I save jobs to apply later?",
    answer: "Absolutely! You can save any job listing to your favorites list by clicking the heart icon. Your saved jobs are stored in your dashboard for easy access. You can organize them, add notes, and apply whenever you're ready.",
    category: "Job Search"
  },
  {
    question: "How do I filter job results?",
    answer: "Use our advanced filter panel to refine your search. Filter by location, salary range, job type, experience level, company size, industry, and more. You can combine multiple filters to find exactly what you're looking for.",
    category: "Job Search"
  },
  // Applications
  {
    question: "How do I apply for a job?",
    answer: "Simply browse our job listings, click on a job that interests you, and hit the 'Apply Now' button. You'll need to create a free account if you haven't already. The application process is quick and straightforward - just upload your resume and answer a few questions.",
    category: "Applications"
  },
  {
    question: "Can I track my applications?",
    answer: "Yes! All your applications are tracked in your dashboard. You can see the status of each application (submitted, viewed, in review, etc.), view application history, and manage all your job applications in one place.",
    category: "Applications"
  },
  {
    question: "How long does it take to apply?",
    answer: "Most applications take less than 2 minutes. We've streamlined the process so you can apply to multiple jobs quickly. Your profile information is saved, so you don't have to re-enter it for each application.",
    category: "Applications"
  },
  {
    question: "Can I withdraw an application?",
    answer: "Yes, you can withdraw an application at any time from your dashboard. Simply go to 'My Applications', find the job you want to withdraw from, and click 'Withdraw Application'.",
    category: "Applications"
  },
  // Account
  {
    question: "How do I update my profile?",
    answer: "Go to your dashboard and click on 'Settings' or 'Edit Profile'. From there, you can update your personal information, work experience, skills, education, and upload a new resume. Keep your profile updated to attract more employers!",
    category: "Account"
  },
  {
    question: "How do I change my password?",
    answer: "Go to Settings > Security, and click 'Change Password'. Enter your current password and your new password. Make sure your new password is strong and secure.",
    category: "Account"
  },
  {
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account at any time from Settings > Account. Please note that this action is permanent and all your data will be deleted. Make sure to download any important information before deleting your account.",
    category: "Account"
  },
  {
    question: "How do I update my email notifications?",
    answer: "Go to Settings > Notifications to manage your email preferences. You can choose which types of notifications you want to receive, including job alerts, application updates, and platform announcements.",
    category: "Account"
  },
  // For Employers
  {
    question: "How do companies post jobs?",
    answer: "Companies can sign up for an employer account, verify their business, and start posting jobs immediately. The process takes just a few minutes, and there's no credit card required to get started. Click 'For Employers' in the navigation to begin.",
    category: "For Employers"
  },
  {
    question: "How much does it cost to post a job?",
    answer: "Posting jobs is free! We offer a free tier that allows you to post unlimited job listings. We also offer premium plans with enhanced features like featured listings, advanced analytics, and priority support.",
    category: "For Employers"
  },
  {
    question: "How do I manage applications?",
    answer: "All applications are organized in your employer dashboard. You can view candidate profiles, resumes, and application details. Filter and sort applications, schedule interviews, and communicate with candidates all in one place.",
    category: "For Employers"
  },
  {
    question: "Can I edit or delete a job posting?",
    answer: "Yes! You can edit or delete your job postings at any time from your dashboard. Go to 'Manage Jobs', find the job you want to edit, and click 'Edit' or 'Delete'. Changes to active listings are updated immediately.",
    category: "For Employers"
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 dark:from-primary/20 dark:via-transparent dark:to-primary/15" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Help Center</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Find answers to common questions about our platform
              </p>
            </div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-2xl mx-auto mb-8"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 text-lg rounded-full border-2 focus:border-primary"
              />
            </motion.div>

            {/* Category tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2 mb-12"
            >
              {faqCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "hover:border-primary/50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </motion.div>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className="px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
                    >
                      <AccordionTrigger className="text-left font-semibold text-lg text-slate-900 dark:text-white hover:no-underline group">
                        <div className="flex items-start gap-4 w-full">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <HelpCircle className="w-5 h-5" />
                          </div>
                          <span className="flex-1">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pt-4 pl-12 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  variant="outline"
                  className="rounded-full"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>

          {/* Contact section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 border border-primary/20"
          >
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button size="lg" className="rounded-full">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </motion.div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default FAQ;

