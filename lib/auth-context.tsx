"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthContextType, User } from "./types";


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = Cookies.get("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);



  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role");
    setUser(null);
  };




  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);