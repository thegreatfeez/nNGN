import { useState, useCallback } from "react";
import { adminApi } from "../lib/adminApi";

function isTokenValid(): boolean {
  const token = localStorage.getItem("admin_token");
  if (!token) return false;
  try {
    // Decode JWT payload (no signature verification — server verifies)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid);

  const login = useCallback(async (pin: string): Promise<void> => {
    const { token } = await adminApi.login(pin);
    localStorage.setItem("admin_token", token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
