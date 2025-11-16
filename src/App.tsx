
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Index from "./pages/LandingPage/Index";
import Jobs from "./pages/Jobs/Jobs";
import JobDetail from "./pages/Jobs/JobDetail";
import Companies from "./pages/Companies/Companies";
import CompanyProfile from "./pages/Companies/CompanyProfile";
import Auth from "./pages/Auth/Auth";
import Onboarding from "./pages/Onboarding/Onboarding";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import PostJob from "./pages/Jobs/PostJob";
import ApplyJob from "./pages/Jobs/ApplyJob";
import ManageJobs from "./pages/Jobs/ManageJobs";
import EditJob from "./pages/Jobs/EditJob";
import FAQ from "./pages/FAQ/FAQ";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

// Add Framer Motion for animations
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/jobs/manage" element={<ManageJobs />} />
                <Route path="/edit-job/:id" element={<EditJob />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id" element={<CompanyProfile />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/employer" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/apply/:id" element={<ApplyJob />} />
                <Route path="/company-profile" element={<CompanyProfile />} /> {/* Route for company profile without params */}
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
