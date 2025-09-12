"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  _id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  user: null,
  refreshAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const refreshAuth = async () => {
    try {
      const res = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      setUser(data.user ?? null);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, refreshAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
