import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

interface AuthUser {
  _id: string;
  name?: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    name?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("gg_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("gg_token")
  );

  useEffect(() => {
    if (user) localStorage.setItem("gg_user", JSON.stringify(user));
    else localStorage.removeItem("gg_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("gg_token", token);
    else localStorage.removeItem("gg_token");
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || "Login failed") as Error & {
        fieldErrors?: Record<string, string>;
      };
      err.fieldErrors = data.errors;
      throw err;
    }
    setUser(data.user);
    setToken(data.token);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    name?: string
  ) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || "Registration failed") as Error & {
        fieldErrors?: Record<string, string>;
      };
      err.fieldErrors = data.errors;
      throw err;
    }
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
