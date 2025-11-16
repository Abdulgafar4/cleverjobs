import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackNewsletterSignup } from '@/lib/analytics';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Insert into newsletter_subscriptions table
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source: 'landing_page',
            is_active: true,
          }
        ]);

      if (error) {
        // If table doesn't exist, we'll handle it gracefully
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          // Table doesn't exist - show error message
          console.error('Newsletter table does not exist. Please run the SQL migration in Supabase.');
          toast({
            title: "Setup required",
            description: "Please run the SQL migration to create the newsletter table.",
            variant: "destructive",
          });
          return;
        } else if (error.code === '23505') {
          // Duplicate email (unique constraint violation)
          // Check if they're trying to resubscribe
          const { data: existing } = await supabase
            .from('newsletter_subscriptions')
            .select('is_active, email')
            .eq('email', email.toLowerCase().trim())
            .single();

          if (existing && !existing.is_active) {
            // Reactivate subscription
            const { error: updateError } = await supabase
              .from('newsletter_subscriptions')
              .update({
                is_active: true,
                subscribed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                unsubscribed_at: null,
              })
              .eq('email', email.toLowerCase().trim());

            if (updateError) {
              throw updateError;
            }

            trackNewsletterSignup(email);
            setIsSubscribed(true);
            toast({
              title: "Welcome back!",
              description: "You've been resubscribed to our newsletter.",
            });
          } else {
            // Already subscribed and active
            toast({
              title: "Already subscribed",
              description: "This email is already on our mailing list.",
            });
          }
        } else {
          throw error;
        }
      } else {
        // Successfully saved to database
        trackNewsletterSignup(email);
        setIsSubscribed(true);
        toast({
          title: "Successfully subscribed!",
          description: "You'll receive job alerts and updates.",
        });
      }
      
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 rounded-3xl p-8 md:p-12 border border-primary/20">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-full bg-primary/20 text-primary mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Stay Updated</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get the latest job opportunities and career tips delivered to your inbox. 
              Never miss a perfect opportunity.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 rounded-full border-slate-300 dark:border-slate-700"
                disabled={isSubscribed}
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-full px-8 h-12 whitespace-nowrap"
                disabled={isSubscribed || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : isSubscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Subscribed!
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

