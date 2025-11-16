import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import type { AnalyticsData } from '@/lib/analytics';

const AnalyticsDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [report, setReport] = useState<any>(null);

  const refreshReport = () => {
    setReport(analytics.getReport());
  };

  useEffect(() => {
    if (isOpen) {
      refreshReport();
    }
  }, [isOpen]);

  // Keyboard shortcut: Ctrl/Cmd + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all analytics data?')) {
      analytics.clear();
      refreshReport();
    }
  };

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 right-8 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Analytics Panel"
      >
        <BarChart3 className="w-5 h-5" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold">Analytics Debug Panel</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={refreshReport}
                    aria-label="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    aria-label="Clear Analytics"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {report ? (
                  <>
                    {/* Summary */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Summary
                      </h3>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary">
                          {report.totalEvents}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Events
                        </div>
                      </div>
                    </div>

                    {/* Stats Table */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Event Counts
                      </h3>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-200 dark:bg-slate-700">
                            <tr>
                              <th className="text-left p-2">Event</th>
                              <th className="text-right p-2">Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(report.stats).map(([event, count]) => (
                              <tr
                                key={event}
                                className="border-t border-slate-200 dark:border-slate-700"
                              >
                                <td className="p-2 font-medium">{event}</td>
                                <td className="p-2 text-right">{count as number}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recent Events */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Recent Events ({report.recentEvents.length})
                      </h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {report.recentEvents.map((event: AnalyticsData, index: number) => (
                          <div
                            key={index}
                            className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-primary">{event.event}</span>
                              <span className="text-muted-foreground">
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            {event.data && Object.keys(event.data).length > 0 && (
                              <div className="mt-2 text-muted-foreground">
                                {JSON.stringify(event.data, null, 2)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No analytics data yet
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-muted-foreground">
                <p>Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">Ctrl/Cmd + Shift + A</kbd> to toggle</p>
                <p className="mt-1">Or use <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">window.analytics</code> in console</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnalyticsDebugPanel;

