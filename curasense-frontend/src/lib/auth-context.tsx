"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "doctor" | "patient" | "admin";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // For demo purposes - toggle auth state
  toggleAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      // In production, this would check a real session/token
      const savedAuth = localStorage.getItem("curasense_auth");
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth);
          setUser(parsed);
        } catch {
          localStorage.removeItem("curasense_auth");
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, _password: string) => {
    // In production, this would call your auth API with password
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: "1",
      name: email.split("@")[0],
      email,
      role: "doctor",
    };
    
    setUser(newUser);
    localStorage.setItem("curasense_auth", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("curasense_auth");
  };

  // For demo/portfolio - toggle between states
  const toggleAuth = () => {
    if (user) {
      logout();
    } else {
      const demoUser: User = {
        id: "demo",
        name: "Demo User",
        email: "demo@curasense.ai",
        role: "doctor",
      };
      setUser(demoUser);
      localStorage.setItem("curasense_auth", JSON.stringify(demoUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        toggleAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
