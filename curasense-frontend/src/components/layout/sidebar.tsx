"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Pill,
  FileText,
  ScanLine,
  Home,
  Settings,
  HelpCircle,
  ChevronRight,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GradientText, PulsingDot } from "@/components/ui/aceternity";
import { springPresets } from "@/styles/tokens/animations";
import { useAuth } from "@/lib/auth-context";

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    color: "text-[hsl(var(--muted-foreground))]",
    activeColor: "text-[hsl(var(--foreground))]",
    activeBg: "bg-[hsl(var(--accent))]",
  },
  {
    name: "CuraSense Diagnosis",
    href: "/diagnosis",
    icon: Stethoscope,
    color: "text-[hsl(var(--color-diagnosis))]",
    activeColor: "text-[hsl(var(--color-diagnosis))]",
    activeBg: "bg-[hsl(var(--color-diagnosis)/0.1)]",
    children: [
      { name: "Upload Prescription", href: "/diagnosis/prescription", icon: FileText },
      { name: "X-Ray Analysis", href: "/diagnosis/xray", icon: ScanLine },
    ],
  },
  {
    name: "CuraSense Medicine",
    href: "/medicine",
    icon: Pill,
    color: "text-[hsl(var(--color-medicine))]",
    activeColor: "text-[hsl(var(--color-medicine))]",
    activeBg: "bg-[hsl(var(--color-medicine)/0.1)]",
  },
  {
    name: "Report History",
    href: "/history",
    icon: History,
    color: "text-[hsl(var(--color-records))]",
    activeColor: "text-[hsl(var(--color-records))]",
    activeBg: "bg-[hsl(var(--color-records)/0.1)]",
  },
];

const bottomNav = [
  { name: "Help", href: "/help", icon: HelpCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();

  // Only show sidebar when user is authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Desktop Only - Hover trigger area */}
      <div
        className="hidden lg:block fixed left-0 top-0 z-50 h-screen w-4 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
      />

      {/* Desktop Only - Collapsed indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-16 flex-col items-center border-r border-[hsl(var(--border))] bg-[hsl(var(--card)/0.95)] py-6 backdrop-blur-xl"
      >
        {/* Enterprise Logo - Collapsed */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand-primary))] via-[hsl(168_84%_38%)] to-[hsl(var(--brand-secondary))] shadow-lg shadow-[hsl(var(--brand-primary)/0.35)]">
          <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L4 7v8c0 7.18 5.12 13.89 12 15.5 6.88-1.61 12-8.32 12-15.5V7L16 2z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 10h4v4h4v4h-4v4h-4v-4h-4v-4h4v-4z" fill="white" opacity="0.95"/>
            <path d="M8 16h3l1.5-3 2 6 2-6 1.5 3h6" stroke="hsl(168, 84%, 40%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <div className="mt-6 flex flex-col items-center gap-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.children && item.children.some((child) => pathname === child.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                  isActive
                    ? cn(item.activeBg, item.activeColor)
                    : cn("text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]", `hover:${item.color}`)
                )}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
        <div className="mt-auto flex flex-col items-center gap-4">
          {bottomNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <PulsingDot color="success" />
        </div>
      </motion.div>

      {/* Desktop Only - Full sidebar on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={springPresets.snappy}
            onMouseLeave={() => setIsHovered(false)}
            className="hidden lg:block fixed left-0 top-0 z-50 h-screen w-72 border-r border-[hsl(var(--border))] bg-[hsl(var(--card)/0.98)] shadow-2xl backdrop-blur-xl"
          >
            <div className="flex h-full flex-col">
              {/* Enterprise Logo - Expanded */}
              <div className="flex h-20 items-center gap-3 border-b border-[hsl(var(--border))] px-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand-primary))] via-[hsl(168_84%_38%)] to-[hsl(var(--brand-secondary))] shadow-lg shadow-[hsl(var(--brand-primary)/0.35)]">
                  <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2L4 7v8c0 7.18 5.12 13.89 12 15.5 6.88-1.61 12-8.32 12-15.5V7L16 2z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 10h4v4h4v4h-4v4h-4v-4h-4v-4h4v-4z" fill="white" opacity="0.95"/>
                    <path d="M8 16h3l1.5-3 2 6 2-6 1.5 3h6" stroke="hsl(168, 84%, 40%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    <GradientText>CuraSense</GradientText>
                  </h1>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest uppercase">
                    AI Healthcare
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  Main Menu
                </div>
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.children &&
                      item.children.some((child) => pathname === child.href));

                  return (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? cn(item.activeBg, item.activeColor)
                            : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive
                              ? item.activeColor
                              : cn("text-[hsl(var(--muted-foreground))]", `group-hover:${item.color}`)
                          )}
                        />
                        {item.name}
                        {item.children && (
                          <ChevronRight
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform",
                              isActive && "rotate-90"
                            )}
                          />
                        )}
                      </Link>

                      {/* Children */}
                      {item.children && isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className={cn(
                            "ml-4 mt-1 space-y-1 border-l-2 pl-4",
                            `border-[hsl(var(--color-diagnosis)/0.3)]`
                          )}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                pathname === child.href
                                  ? "bg-[hsl(var(--color-diagnosis)/0.1)] text-[hsl(var(--color-diagnosis))] font-medium"
                                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--color-diagnosis))]"
                              )}
                            >
                              <child.icon className="h-4 w-4" />
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Bottom Navigation */}
              <div className="border-t border-[hsl(var(--border))] p-4">
                {bottomNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Status Card - using success color instead of teal */}
              <div className="m-4 rounded-xl bg-gradient-to-br from-[hsl(var(--color-success))] to-[hsl(142_76%_45%)] p-4 text-white shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
                  AI Systems Online
                </div>
                <p className="mt-1 text-xs text-white/80">
                  3 ML models ready for analysis
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
