import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, ArrowRight, Loader2, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ResumeUploadSection = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = (file: File) => {
        setIsUploading(true);

        // Mock delay for "analysis"
        setTimeout(() => {
            setIsUploading(false);
            setIsAnalyzed(true);
            toast.success("Resume analyzed successfully!");
        }, 2000);
    };

    const handleViewMatches = () => {
        navigate('/jobs');
    };

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
            <div className="absolute top-20 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-2 md:order-1 space-y-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">Smart Match Technology</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                            Get Matched Instantly with <br />
                            <span className="text-primary">AI-Powered Analysis</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                            Stop searching manually. Upload your resume and let our advanced AI algorithm find the perfect roles that match your skills, experience, and career goals.
                        </p>

                        <div className="space-y-4 pt-2">
                            {[
                                "Instant skill extraction and matching",
                                "Personalized job recommendations",
                                "Salary insights based on your experience",
                                "Direct application to top companies"
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Upload Card Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-1 md:order-2"
                    >
                        <div className="relative">
                            {/* Card Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-3xl blur-2xl transform rotate-3 scale-105" />

                            <div
                                className={`
                                    relative overflow-hidden
                                    border rounded-3xl p-8 sm:p-12 text-center transition-all duration-300
                                    bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl
                                    ${isDragging
                                        ? 'border-primary ring-4 ring-primary/10 scale-[1.02]'
                                        : 'border-white/20 dark:border-slate-700/50 hover:border-primary/30'}
                                    ${isAnalyzed ? 'border-primary/30' : ''}
                                `}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {/* Grid Pattern on Card */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                                    backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px'
                                }} />

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileSelect}
                                />

                                {!isUploading && !isAnalyzed && (
                                    <div className="relative space-y-8">
                                        <div className="relative w-24 h-24 mx-auto group">
                                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                                            <div className="relative w-full h-full bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="w-10 h-10" />
                                            </div>
                                            {/* Decorative small icons around */}
                                            <div className="absolute top-0 right-0 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg text-primary transform group-hover:rotate-12 transition-transform">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-bold mb-3">Drop your resume here</h3>
                                            <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                                                Support for PDF, DOCX, or DOC files. We'll analyze it instantly.
                                            </p>
                                            <Button
                                                onClick={() => fileInputRef.current?.click()}
                                                size="lg"
                                                className="rounded-full px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
                                            >
                                                Select File
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {isUploading && (
                                    <div className="relative space-y-8 py-4">
                                        <div className="relative w-24 h-24 mx-auto">
                                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold">Analyzing Profile...</h3>
                                            <p className="text-muted-foreground">
                                                Matching your skills with top companies
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isAnalyzed && (
                                    <div className="relative space-y-8 py-2">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary"
                                        >
                                            <CheckCircle className="w-12 h-12" />
                                        </motion.div>

                                        <div>
                                            <h3 className="text-2xl font-bold mb-3">Analysis Complete!</h3>
                                            <p className="text-muted-foreground mb-8">
                                                We found <span className="font-bold text-primary">12 jobs</span> that match your profile perfectly.
                                            </p>
                                            <div className="space-y-4">
                                                <Button
                                                    onClick={handleViewMatches}
                                                    size="lg"
                                                    className="w-full rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                                                >
                                                    View Matched Jobs <ArrowRight className="w-4 h-4" />
                                                </Button>
                                                <button
                                                    onClick={() => {
                                                        setIsAnalyzed(false);
                                                        setIsUploading(false);
                                                    }}
                                                    className="text-sm text-muted-foreground hover:text-primary underline transition-colors"
                                                >
                                                    Upload a different resume
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ResumeUploadSection;
