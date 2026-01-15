"use client";

// ============================================
// CURASENSE LANDING PAGE V3.0
// Premium Healthcare Design with Descriptive Dashboard
// ============================================

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  Stethoscope,
  FileText,
  ScanLine,
  Pill,
  ArrowRight,
  Shield,
  Zap,
  Brain,
  Heart,
  Activity,
  Clock,
  CheckCircle2,
  Sparkles,
  Lock,
  Globe,
  Users,
  ChevronRight,
  TrendingUp,
  BarChart3,
  LineChart,
  PieChart,
  AlertCircle,
  Info,
  UserCircle2,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import {
  GlassCard,
  GlowOrb,
  SpotlightCardV2,
  GradientTextV2,
  AuroraBackground,
  StaggerContainerV2,
  StaggerItemV2,
  AnimatedCounter,
  FeatureIcon,
  AnimatedDivider,
  PulsingIndicator,
  MorphingBlob,
  ParallaxContainer,
  springConfigs,
  slideUpVariants,
} from "@/components/ui/premium-components";

// ============================================
// FEATURE DATA - Vibrant Color Design
// ============================================
const features = [
  {
    icon: FileText,
    title: "Smart Prescription Analysis",
    description: "AI-powered analysis of prescriptions and blood reports with instant insights and recommendations.",
    href: "/diagnosis/prescription",
    color: "info" as const,
    gradient: "from-[hsl(210_95%_50%)] via-[hsl(188_95%_45%)] to-[hsl(168_82%_38%)]",
    glowColor: "hsl(210 95% 50% / 0.4)",
    stats: "30+ document types",
  },
  {
    icon: ScanLine,
    title: "Medical Imaging AI",
    description: "Advanced vision models analyze X-rays, CT scans, and MRI images with clinical-grade accuracy.",
    href: "/diagnosis/xray",
    color: "secondary" as const,
    gradient: "from-[hsl(262_83%_58%)] via-[hsl(278_75%_55%)] to-[hsl(288_80%_50%)]",
    glowColor: "hsl(262 83% 58% / 0.4)",
    stats: "99.2% accuracy",
  },
  {
    icon: Pill,
    title: "Medicine Intelligence",
    description: "Compare medications, check drug interactions, and discover safer alternatives instantly.",
    href: "/medicine",
    color: "success" as const,
    gradient: "from-[hsl(152_76%_36%)] via-[hsl(168_82%_38%)] to-[hsl(82_75%_45%)]",
    glowColor: "hsl(152 76% 36% / 0.4)",
    stats: "50k+ medicines",
  },
];

const stats = [
  { value: 30, suffix: "s", label: "Avg. Analysis Time", icon: Zap },
  { value: 99, suffix: "%", label: "Accuracy Rate", icon: Activity },
  { value: 24, suffix: "/7", label: "Availability", icon: Clock },
  { value: 100, suffix: "%", label: "Privacy First", icon: Shield },
];

const howItWorks = [
  {
    step: "01",
    title: "Upload Your Document",
    description: "Drag and drop any prescription, lab report, or medical image",
    icon: FileText,
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "Our specialized healthcare AI processes your document",
    icon: Brain,
  },
  {
    step: "03",
    title: "Get Insights",
    description: "Receive detailed analysis, insights, and recommendations",
    icon: Sparkles,
  },
];

const trustFactors = [
  { icon: Lock, label: "HIPAA Compliant" },
  { icon: Shield, label: "End-to-End Encrypted" },
  { icon: Globe, label: "Available Worldwide" },
  { icon: Users, label: "10k+ Users" },
];

// ============================================
// AUTHENTICATED DASHBOARD - DESCRIPTIVE DESIGN V3
// Rich analytics preview, comprehensive features
// ============================================
function AuthenticatedDashboard({ userName, isGuest = false }: { userName?: string; isGuest?: boolean }) {
  const { exitGuestMode } = useAuth();
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Analytics preview data (demo data for preview)
  const analyticsPreview = {
    weeklyScans: 12,
    monthlyGrowth: 23,
    avgResponseTime: "28s",
    accuracyRate: 99.2,
  };

  // Feature cards with detailed descriptions
  const dashboardFeatures = [
    {
      icon: FileText,
      title: "Prescription & Report Analysis",
      description: "Upload prescriptions, blood reports, lab results, or any medical document. Our AI extracts medications, dosages, diagnoses, and provides comprehensive analysis with actionable insights.",
      href: "/diagnosis/prescription",
      gradient: "from-[hsl(210_95%_50%)] via-[hsl(188_95%_45%)] to-[hsl(168_82%_38%)]",
      glowColor: "hsl(210 95% 50% / 0.3)",
      stats: "30+ document types supported",
      capabilities: ["PDF & Image upload", "Handwritten prescriptions", "Lab value interpretation"],
    },
    {
      icon: ScanLine,
      title: "Medical Imaging Intelligence",
      description: "Advanced AI vision models analyze X-rays, CT scans, and MRI images. Get detailed findings, potential abnormalities, and clinical observations with 99.2% accuracy.",
      href: "/diagnosis/xray",
      gradient: "from-[hsl(262_83%_58%)] via-[hsl(278_75%_55%)] to-[hsl(288_80%_50%)]",
      glowColor: "hsl(262 83% 58% / 0.3)",
      stats: "Hospital-grade analysis",
      capabilities: ["X-Ray analysis", "CT scan reading", "Abnormality detection"],
    },
    {
      icon: Pill,
      title: "Medicine Database & Comparison",
      description: "Access our comprehensive database of 50,000+ medicines. Compare drugs, check interactions, find generic alternatives, and understand side effects instantly.",
      href: "/medicine",
      gradient: "from-[hsl(152_76%_36%)] via-[hsl(168_82%_38%)] to-[hsl(82_75%_45%)]",
      glowColor: "hsl(152 76% 36% / 0.3)",
      stats: "50k+ medicines indexed",
      capabilities: ["Drug interactions", "Generic alternatives", "Side effect lookup"],
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand-primary)/0.03)] via-transparent to-[hsl(var(--brand-secondary)/0.03)]" />
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(var(--brand-primary)/0.06)] blur-[120px]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(var(--brand-secondary)/0.05)] blur-[100px]"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative space-y-6">
        {/* Guest Mode Banner */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--accent-amber)/0.1)] border border-[hsl(var(--accent-amber)/0.3)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-amber)/0.2)] flex items-center justify-center">
                <UserCircle2 className="w-4 h-4 text-[hsl(var(--accent-amber))]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">Guest Mode Active</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Your analyses won&apos;t be saved. Create an account to save your history.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button size="sm" className="gap-1.5 h-8 text-xs">
                  <Sparkles className="w-3 h-3" />
                  Create Account
                </Button>
              </Link>
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={exitGuestMode}>
                Exit Guest
              </Button>
            </div>
          </motion.div>
        )}

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Greeting & Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfigs.smooth}
            className="flex-1"
          >
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-2">
              <Calendar className="w-4 h-4" />
              <span>{currentDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
              {greeting()},{" "}
              <GradientTextV2 variant="brand">
                {isGuest ? "Guest" : (userName?.split(" ")[0] || "User")}
              </GradientTextV2>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] max-w-lg">
              Welcome to CuraSense — your AI-powered healthcare companion. Analyze prescriptions, medical images, and medications with clinical-grade accuracy.
            </p>
          </motion.div>

          {/* Quick Analytics Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...springConfigs.smooth }}
            className="lg:w-auto"
          >
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-[hsl(var(--brand-primary))]" />
                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">Analytics Preview</span>
                <Link href="/analytics" className="ml-auto text-xs text-[hsl(var(--brand-primary))] hover:underline flex items-center gap-1">
                  View full <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 rounded-lg bg-[hsl(var(--muted)/0.3)]">
                  <div className="text-lg font-bold text-[hsl(var(--brand-primary))]">{analyticsPreview.weeklyScans}</div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))]">Weekly Scans</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-[hsl(var(--muted)/0.3)]">
                  <div className="text-lg font-bold text-[hsl(var(--color-success))] flex items-center justify-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {analyticsPreview.monthlyGrowth}%
                  </div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))]">Growth</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-[hsl(var(--muted)/0.3)]">
                  <div className="text-lg font-bold text-[hsl(var(--color-info))]">{analyticsPreview.avgResponseTime}</div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))]">Avg Response</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-[hsl(var(--muted)/0.3)]">
                  <div className="text-lg font-bold text-[hsl(var(--accent-amber))]">{analyticsPreview.accuracyRate}%</div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))]">Accuracy</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards - Descriptive Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            {dashboardFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, ...springConfigs.smooth }}
              >
                <Link href={feature.href} className="block">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:border-[hsl(var(--brand-primary)/0.4)] transition-all duration-300 hover:shadow-xl"
                    style={{ boxShadow: `0 0 0 transparent` }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
                    
                    {/* Content */}
                    <div className="relative p-5 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                        {/* Icon */}
                        <div 
                          className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
                          style={{ boxShadow: `0 8px 24px ${feature.glowColor}` }}
                        >
                          <feature.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--brand-primary))] transition-colors">
                              {feature.title}
                            </h3>
                            <ChevronRight className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--brand-primary))] group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
                          </div>
                          
                          <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                            {feature.description}
                          </p>

                          {/* Capabilities & Stats */}
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[hsl(var(--brand-primary)/0.1)] text-[hsl(var(--brand-primary))]">
                              <Sparkles className="w-3 h-3" />
                              {feature.stats}
                            </span>
                            {feature.capabilities.map((cap) => (
                              <span key={cap} className="text-xs text-[hsl(var(--muted-foreground))] px-2 py-1 rounded-md bg-[hsl(var(--muted)/0.5)]">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section: Recent Activity & Analytics Teaser */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...springConfigs.smooth }}
            className="lg:col-span-3"
          >
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]" />
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Recent Activity</h2>
                </div>
                <Link href="/history" className="text-xs text-[hsl(var(--brand-primary))] hover:underline flex items-center gap-1">
                  View history <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Empty State with helpful guidance */}
              <div className="flex flex-col items-center text-center py-8">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--muted))] to-[hsl(var(--muted)/0.5)] flex items-center justify-center mb-4"
                >
                  <FileText className="w-8 h-8 text-[hsl(var(--muted-foreground)/0.5)]" />
                </motion.div>
                <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-2">No analysis history yet</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5 max-w-sm">
                  Start by uploading a prescription or medical image. Your analysis history will appear here for easy reference.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href="/diagnosis/prescription">
                    <Button size="sm" className="gap-1.5 h-9">
                      <FileText className="w-4 h-4" />
                      Analyze Prescription
                    </Button>
                  </Link>
                  <Link href="/diagnosis/xray">
                    <Button size="sm" variant="outline" className="gap-1.5 h-9">
                      <ScanLine className="w-4 h-4" />
                      Analyze X-Ray
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analytics Teaser */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, ...springConfigs.smooth }}
            className="lg:col-span-2"
          >
            <Link href="/analytics" className="block h-full">
              <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 h-full hover:border-[hsl(var(--brand-primary)/0.3)] transition-colors group">
                <div className="flex items-center gap-2 mb-4">
                  <LineChart className="w-4 h-4 text-[hsl(var(--brand-primary))]" />
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Analytics Dashboard</h2>
                </div>
                
                {/* Chart Preview Placeholder */}
                <div className="relative mb-4">
                  <div className="flex items-end justify-between h-24 px-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                        className="w-4 rounded-t-sm bg-gradient-to-t from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">Usage trends</span>
                    <span className="text-[hsl(var(--color-success))] font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +23%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">Analysis types</span>
                    <span className="text-[hsl(var(--foreground))] font-medium">3 categories</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
                  <span className="text-xs text-[hsl(var(--brand-primary))] group-hover:underline flex items-center gap-1">
                    Explore detailed analytics <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[hsl(var(--color-success)/0.1)] border border-[hsl(var(--color-success)/0.2)]">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--color-success))] animate-pulse" />
            <span className="text-xs font-medium text-[hsl(var(--color-success))]">All systems operational</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>HIPAA Compliant</span>
            </div>
            <span className="hidden sm:inline text-[hsl(var(--border))]">•</span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>End-to-End Encrypted</span>
            </div>
            <span className="hidden sm:inline text-[hsl(var(--border))]">•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{"<"}30s Response</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// MAIN LANDING PAGE
// ============================================
export default function HomePage() {
  const { isAuthenticated, user, isGuest } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  // Show dashboard for authenticated users OR guests
  if (isAuthenticated || isGuest) {
    return <AuthenticatedDashboard userName={user?.displayName || user?.firstName} isGuest={isGuest} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Premium Background */}
      <AuroraBackground intensity="medium" />
      <MorphingBlob className="w-[600px] h-[600px] -top-64 -right-64" color="gradient" />
      <MorphingBlob className="w-[500px] h-[500px] top-1/2 -left-64" color="secondary" />

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section ref={heroRef} className="relative pt-8 pb-16 md:pt-16 md:pb-24">
        <motion.div 
          className="relative z-10 text-center px-4"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...springConfigs.bouncy, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--color-success)/0.1)] border border-[hsl(var(--color-success)/0.2)]">
              <PulsingIndicator color="success" size="sm" />
              <span className="text-sm font-medium text-[hsl(var(--color-success))]">
                AI-Powered Healthcare
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfigs.smooth, delay: 0.2 }}
            className="text-[clamp(2rem,6vw,4.5rem)] font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-[hsl(var(--foreground))]">Your Health,</span>
            <br />
            <span className="text-[hsl(var(--foreground))]">Powered by </span>
            <GradientTextV2 variant="brand" animate>
              Intelligent AI
            </GradientTextV2>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfigs.smooth, delay: 0.3 }}
            className="text-[clamp(1rem,2vw,1.25rem)] text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed"
          >
            Instant AI analysis of prescriptions, medical images, and drug interactions.
            Healthcare intelligence at your fingertips.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfigs.smooth, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
          >
            <Link href="/diagnosis">
              <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 text-base shadow-lg shadow-[hsl(var(--brand-primary)/0.25)] hover:shadow-xl hover:shadow-[hsl(var(--brand-primary)/0.3)] transition-shadow">
                <Stethoscope className="w-5 h-5" />
                Start Diagnosis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/medicine">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
                <Pill className="w-5 h-5" />
                Compare Medicines
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <AnimatedDivider variant="gradient" className="max-w-lg mx-auto" />

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <section className="py-12 md:py-20 px-4">
        <StaggerContainerV2 className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <StaggerItemV2 key={stat.label}>
              <SpotlightCardV2 borderGlow className="text-center p-6 md:p-8">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 md:mb-4 text-[hsl(var(--brand-primary))]" />
                <div className="text-2xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs md:text-sm text-[hsl(var(--muted-foreground))]">
                  {stat.label}
                </div>
              </SpotlightCardV2>
            </StaggerItemV2>
          ))}
        </StaggerContainerV2>
      </section>

      {/* ============================================
          FEATURES SECTION
          ============================================ */}
      <section className="py-12 md:py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springConfigs.smooth}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-[hsl(var(--foreground))] mb-4">
            Powerful Healthcare Tools
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Three specialized AI models working together for comprehensive healthcare analysis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, ...springConfigs.smooth }}
            >
              <Link href={feature.href}>
                <ParallaxContainer intensity={8}>
                  <SpotlightCardV2 borderGlow className="h-full cursor-pointer group">
                    <div className="p-6 md:p-8">
                      {/* Icon */}
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform`}>
                        <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                      </div>

                      {/* Badge */}
                      <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] mb-4">
                        {feature.stats}
                      </span>

                      {/* Content */}
                      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-3 group-hover:text-[hsl(var(--brand-primary))] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))] mb-6 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* CTA */}
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand-primary))] group-hover:gap-3 transition-all">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </SpotlightCardV2>
                </ParallaxContainer>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS SECTION
          ============================================ */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="overflow-hidden" variant="strong" hover={false}>
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Steps */}
              <div className="p-6 md:p-10 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={springConfigs.smooth}
                >
                  <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-[hsl(var(--foreground))] mb-8">
                    How CuraSense Works
                  </h2>
                </motion.div>

                <div className="space-y-6 md:space-y-8">
                  {howItWorks.map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, ...springConfigs.smooth }}
                      className="flex gap-4 md:gap-5"
                    >
                      <motion.div
                        className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] flex items-center justify-center text-white font-bold shadow-lg"
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={springConfigs.snappy}
                      >
                        {item.step}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-[hsl(var(--foreground))] text-lg mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Panel */}
              <div className="relative bg-gradient-to-br from-[hsl(var(--brand-primary))] via-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] p-6 md:p-10 lg:p-12 flex items-center justify-center overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <MorphingBlob className="w-[400px] h-[400px] -top-32 -right-32" color="secondary" />
                </div>

                <div className="relative z-10 text-center text-white">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.08, 1],
                      rotate: [0, 3, -3, 0],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 drop-shadow-lg" />
                  </motion.div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Your Health Matters
                  </h3>
                  <p className="text-white/85 max-w-sm mx-auto leading-relaxed mb-6">
                    CuraSense assists and informs. Always consult healthcare professionals for medical decisions.
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-sm font-medium bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    Privacy & Security First
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ============================================
          TRUST SECTION
          ============================================ */}
      <section className="py-12 md:py-16 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium mb-8">
            Trusted by Healthcare Professionals
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {trustFactors.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                className="flex flex-col items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============================================
          FINAL CTA
          ============================================ */}
      <section className="py-12 md:py-20 px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springConfigs.smooth}
          className="max-w-3xl mx-auto text-center"
        >
          <GlassCard variant="strong" glow glowColor="primary" className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--foreground))] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-md mx-auto">
              Join thousands of users who trust CuraSense for intelligent healthcare analysis.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8">
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/help">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
}
