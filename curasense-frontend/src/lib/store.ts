import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Report {
  id: string;
  type: "prescription" | "xray" | "text" | "medicine";
  title: string;
  summary: string;
  content: string;
  status: "pending" | "completed" | "error";
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AppState {
  // Sidebar
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;

  // Chat
  isChatOpen: boolean;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChatHistory: () => void;

  // Reports
  reports: Report[];
  currentReport: Report | null;
  addReport: (report: Omit<Report, "id" | "createdAt">) => void;
  removeReport: (id: string) => void;
  setCurrentReport: (report: Report | null) => void;
  clearReports: () => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Sidebar
      isSidebarExpanded: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
      setSidebarExpanded: (expanded) => set({ isSidebarExpanded: expanded }),

      // Chat
      isChatOpen: false,
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      setChatOpen: (open) => set({ isChatOpen: open }),
      chatHistory: [],
      addChatMessage: (message) =>
        set((state) => ({
          chatHistory: [
            ...state.chatHistory,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),
      clearChatHistory: () => set({ chatHistory: [] }),

      // Reports
      reports: [],
      currentReport: null,
      addReport: (report) =>
        set((state) => ({
          reports: [
            {
              ...report,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
            ...state.reports,
          ],
        })),
      removeReport: (id) =>
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id),
          currentReport: state.currentReport?.id === id ? null : state.currentReport,
        })),
      setCurrentReport: (report) => set({ currentReport: report }),
      clearReports: () => set({ reports: [], currentReport: null }),

      // Theme
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "curasense-storage",
      partialize: (state) => ({
        isSidebarExpanded: state.isSidebarExpanded,
        theme: state.theme,
        reports: state.reports,
      }),
    }
  )
);
