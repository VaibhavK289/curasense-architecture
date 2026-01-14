"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Moon, 
  Sun, 
  ChevronDown,
  Settings,
  LogOut,
  User,
  Menu,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { springPresets } from "@/styles/tokens/animations";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

// Notifications - only shown when authenticated
const notifications = [
  { id: 1, title: "Analysis Complete", message: "Your prescription report is ready", time: "2m ago", unread: true },
  { id: 2, title: "System Update", message: "New analysis models available", time: "1h ago", unread: false },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout, toggleAuth } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springPresets.smooth}
      className="sticky top-0 z-40 flex h-14 sm:h-16 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.98)] px-4 sm:px-6 backdrop-blur-sm"
    >
      {/* Left: Mobile Menu + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button - only show when authenticated */}
        {isAuthenticated && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileNav'))}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))]">
            <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L4 7v8c0 7.18 5.12 13.89 12 15.5 6.88-1.61 12-8.32 12-15.5V7L16 2z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5"/>
              <path d="M14 10h4v4h4v4h-4v4h-4v-4h-4v-4h4v-4z" fill="white" opacity="0.95"/>
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-semibold text-[hsl(var(--foreground))] tracking-tight">
              Cura<span className="text-[hsl(var(--brand-primary))]">Sense</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Actions based on auth state */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle - always visible */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
          aria-label="Toggle theme"
        >
          {mounted && (
            <>
              <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </>
          )}
        </button>

        {isAuthenticated ? (
          <>
            {/* Notifications - only when authenticated */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors",
                  isNotificationsOpen && "bg-[hsl(var(--muted))]"
                )}
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--color-error))] text-[10px] font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={springPresets.snappy}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-[hsl(var(--border))] p-3">
                      <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">Notifications</h3>
                      {unreadCount > 0 && (
                        <button className="text-xs text-[hsl(var(--brand-primary))] hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          className={cn(
                            "flex w-full gap-3 p-3 text-left hover:bg-[hsl(var(--muted)/0.5)] transition-colors",
                            notification.unread && "bg-[hsl(var(--brand-primary)/0.03)]"
                          )}
                        >
                          <div className={cn(
                            "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
                            notification.unread ? "bg-[hsl(var(--brand-primary))]" : "bg-transparent"
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                              {notification.title}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-colors hover:bg-[hsl(var(--muted))]",
                  isProfileOpen && "bg-[hsl(var(--muted))]"
                )}
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-[hsl(var(--foreground))]">
                  {user?.name || "User"}
                </span>
                <ChevronDown className={cn(
                  "hidden sm:block h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform",
                  isProfileOpen && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={springPresets.snappy}
                    className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg overflow-hidden"
                  >
                    <div className="p-3 border-b border-[hsl(var(--border))]">
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">{user?.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/settings"
                        className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                      >
                        <Settings className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-[hsl(var(--color-error))] hover:bg-[hsl(var(--color-error)/0.1)] transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            {/* Unauthenticated: Login / Get Started buttons */}
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex gap-2 text-sm font-medium"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <Button 
              onClick={toggleAuth} // For demo - in production this would be a real auth flow
              size="sm" 
              className="gap-2 text-sm font-medium h-9 px-4 rounded-lg bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary)/0.9)]"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Demo Toggle - for portfolio demonstration */}
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={toggleAuth}
            className="hidden lg:flex h-8 items-center px-2 rounded text-[10px] font-mono text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            title="Toggle auth state (dev only)"
          >
            {isAuthenticated ? "→ Logout" : "→ Login"}
          </button>
        )}
      </div>
    </motion.header>
  );
}
