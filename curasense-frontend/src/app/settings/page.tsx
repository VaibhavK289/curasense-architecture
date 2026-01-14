"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Settings, Sun, Moon, Bell, Shield, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GradientText } from "@/components/ui/aceternity";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { clearReports, clearChatHistory } = useAppStore();
  const [notifications, setNotifications] = useState(true);

  const handleClearData = () => {
    clearReports();
    clearChatHistory();
    toast.success("All data cleared successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              <GradientText>Settings</GradientText>
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Customize your CuraSense experience
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how CuraSense looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-slate-500">
                  Choose between light and dark mode
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analysis Notifications</p>
                <p className="text-sm text-slate-500">
                  Get notified when analysis is complete
                </p>
              </div>
              <Button
                variant={notifications ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setNotifications(!notifications);
                  toast.success(
                    notifications
                      ? "Notifications disabled"
                      : "Notifications enabled"
                  );
                }}
              >
                {notifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure API endpoints (for development)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Backend API URL</label>
              <Input
                defaultValue="http://localhost:8000"
                className="mt-1"
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">ML Server URL</label>
              <Input
                defaultValue="http://localhost:8001"
                className="mt-1"
                disabled
              />
            </div>
            <p className="text-xs text-slate-500">
              API endpoints are configured automatically. Contact support to
              change these settings.
            </p>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Manage your stored data and session history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Clear All Data</p>
                <p className="text-sm text-slate-500">
                  Remove all reports and chat history from this session
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                onClick={handleClearData}
              >
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
