import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

const TOKEN_KEY = "library_token";
const USER_KEY = "library_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem(USER_KEY);
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const setSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const refreshUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    refreshUser();
  }, [token]);

  const login = async ({ email, password, role }) => {
    const { data } = await api.post("/auth/login", { email, password, role });
    setSession(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setSession(data.token, data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/auth/profile", payload);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout: clearSession,
      register,
      updateProfile,
      isAdmin: user?.role === "admin",
      isStaff: user?.role === "admin" || user?.role === "librarian"
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

