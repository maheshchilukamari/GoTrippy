import { createContext, useContext, useEffect, useMemo, useState } from "react";
import http from "../api/http.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("gotrippy_partner_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("gotrippy_partner_user");
      localStorage.removeItem("gotrippy_partner_token");
      return null;
    }
  });
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gotrippy_partner_token");

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    http
      .get("/auth/me")
      .then(({ data }) => {
        setAdmin(data.user);
        localStorage.setItem("gotrippy_partner_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("gotrippy_partner_token");
        localStorage.removeItem("gotrippy_partner_user");
        setAdmin(null);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await http.post("/auth/login", { email, password });
    localStorage.setItem("gotrippy_partner_token", data.token);
    localStorage.setItem("gotrippy_partner_user", JSON.stringify(data.user));
    setAdmin(data.user);
    return data.user;
  };

  const registerDriver = async (payload) => {
    const { data } = await http.post("/auth/register-driver", payload);
    localStorage.setItem("gotrippy_partner_token", data.token);
    localStorage.setItem("gotrippy_partner_user", JSON.stringify(data.user));
    setAdmin(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("gotrippy_partner_token");
    localStorage.removeItem("gotrippy_partner_user");
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      admin,
      checkingAuth,
      login,
      registerDriver,
      logout,
      isAuthenticated: Boolean(admin)
    }),
    [admin, checkingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
