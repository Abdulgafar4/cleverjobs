import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I apply for a job?",
    answer: "Simply browse our job listings, click on a job that interests you, and hit the 'Apply Now' button. You'll need to create a free account if you haven't already. The application process is quick and straightforward."
  },
  {
    question: "Is it free to use?",
    answer: "Yes! Creating an account and applying for jobs is completely free for job seekers. Employers can post jobs for free as well, with optional premium features available."
  },
  {
    question: "How do I get notified about new jobs?",
    answer: "You can set up job alerts by saving your search criteria. We'll send you email notifications when new jobs matching your preferences are posted. You can also enable push notifications in your account settings."
  },
  {
    question: "Can I save jobs to apply later?",
    answer: "Absolutely! You can save any job listing to your favorites list and apply whenever you're ready. Your saved jobs are stored in your dashboard for easy access."
  },
  {
    question: "How do companies post jobs?",
    answer: "Companies can sign up for an employer account, verify their business, and start posting jobs immediately. The process takes just a few minutes, and there's no credit card required to get started."
  },
  {
    question: "What information do I need to create an account?",
    answer: "You'll need a valid email address and a password. Optionally, you can add your resume, work experience, and skills to make your profile more attractive to employers. All information is kept secure and private."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our platform
          </p>
        </motion.div>
        
        <Accordion type="single" collapsible className="w-full space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="px-6 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-white hover:no-underline group">
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="flex-1">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pl-11">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/faq">
            <Button size="lg" variant="outline" className="rounded-full group">
              View All Questions
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;

