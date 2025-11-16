// Simple analytics tracking for non-logged-in users
// Uses localStorage to track events

type AnalyticsEvent = 
  | 'search'
  | 'job_view'
  | 'job_share'
  | 'category_click'
  | 'cta_click'
  | 'newsletter_signup'
  | 'company_view'
  | 'link_click';

interface AnalyticsData {
  event: AnalyticsEvent;
  data?: Record<string, any>;
  timestamp: number;
}

class Analytics {
  private storageKey = 'jobboard_analytics';
  private maxEvents = 100; // Keep last 100 events

  private getEvents(): AnalyticsData[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveEvents(events: AnalyticsData[]) {
    try {
      // Keep only last maxEvents
      const limitedEvents = events.slice(-this.maxEvents);
      localStorage.setItem(this.storageKey, JSON.stringify(limitedEvents));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  track(event: AnalyticsEvent, data?: Record<string, any>) {
    const analyticsData: AnalyticsData = {
      event,
      data,
      timestamp: Date.now(),
    };

    const events = this.getEvents();
    events.push(analyticsData);
    this.saveEvents(events);

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics:', event, data);
    }
  }

  getEventsByType(eventType: AnalyticsEvent): AnalyticsData[] {
    return this.getEvents().filter(e => e.event === eventType);
  }

  getRecentEvents(limit: number = 10): AnalyticsData[] {
    return this.getEvents().slice(-limit);
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }

  // Get summary stats
  getStats() {
    const events = this.getEvents();
    const stats: Record<string, number> = {};

    events.forEach(event => {
      stats[event.event] = (stats[event.event] || 0) + 1;
    });

    return stats;
  }

  // Get detailed report
  getReport() {
    const events = this.getEvents();
    const stats = this.getStats();
    const totalEvents = events.length;
    
    return {
      totalEvents,
      stats,
      recentEvents: this.getRecentEvents(20),
      eventsByType: Object.keys(stats).reduce((acc, eventType) => {
        acc[eventType] = this.getEventsByType(eventType as AnalyticsEvent);
        return acc;
      }, {} as Record<string, AnalyticsData[]>),
    };
  }

  // Print report to console
  printReport() {
    const report = this.getReport();
    console.group('📊 Analytics Report');
    console.log('Total Events:', report.totalEvents);
    console.table(report.stats);
    console.log('Recent Events:', report.recentEvents);
    console.groupEnd();
    return report;
  }
}

export const analytics = new Analytics();

// Expose to window in development for easy access
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).analytics = analytics;
  console.log('💡 Analytics available at window.analytics');
  console.log('💡 Try: analytics.printReport() or analytics.getStats()');
}

// Helper functions for common tracking
export const trackSearch = (query: string, location?: string, type?: string) => {
  analytics.track('search', { query, location, type });
};

export const trackJobView = (jobId: string, jobTitle: string) => {
  analytics.track('job_view', { jobId, jobTitle });
};

export const trackJobShare = (jobId: string, jobTitle: string) => {
  analytics.track('job_share', { jobId, jobTitle });
};

export const trackCategoryClick = (category: string) => {
  analytics.track('category_click', { category });
};

export const trackCTAClick = (ctaName: string, location: string) => {
  analytics.track('cta_click', { ctaName, location });
};

export const trackNewsletterSignup = (email: string) => {
  analytics.track('newsletter_signup', { email });
};

export const trackCompanyView = (companyId: string, companyName: string) => {
  analytics.track('company_view', { companyId, companyName });
};

export const trackLinkClick = (linkText: string, destination: string) => {
  analytics.track('link_click', { linkText, destination });
};

