import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Karyawan from "./pages/Karyawan";
import TokenDebug from "./pages/TokenDebug";
import RegisterPage from "./pages/RegisterPage";

// ── Auth Context ──────────────────────────────────────────────
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function App({ keycloak }) {
  const [authenticated, setAuthenticated] = useState(keycloak.authenticated || false);
  const [userProfile, setUserProfile] = useState(null);
  const [appRegistered, setAppRegistered] = useState(null); // null = loading, true/false
  const [appRole, setAppRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(keycloak.authenticated || false);

    keycloak.onAuthSuccess = () => {
      setAuthenticated(true);
      fetchProfile();
    };
    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setUserProfile(null);
      setAppRegistered(null);
      setAppRole(null);
    };
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => keycloak.logout());
    };

    if (keycloak.authenticated) fetchProfile();
    setLoading(false);
  }, []);

  async function fetchProfile() {
    try {
      const res = await apiFetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
        setAppRegistered(data.registered);
        setAppRole(data.appRole);
      }
    } catch (e) { console.warn("Profile fetch failed:", e); }
  }

  async function registerInApp(data) {
    try {
      const res = await apiFetch("/api/register", { 
        method: "POST",
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchProfile();
        return true;
      }
    } catch (e) { console.warn("Registration failed:", e); }
    return false;
  }

  // Authenticated API call helper
  async function apiFetch(path, options = {}) {
    await keycloak.updateToken(30).catch(() => {});
    return fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
        ...options.headers,
      },
    });
  }

  const login  = () => keycloak.login();
  const logout = () => keycloak.logout({ redirectUri: window.location.origin });
  const hasRole = (role) => keycloak.hasRealmRole(role);
  const isAppAdmin = () => appRole === "ADMIN";

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"var(--muted)" }}>
        Memuat...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authenticated, userProfile, keycloak, login, logout, hasRole, apiFetch, appRegistered, appRole, registerInApp, isAppAdmin }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={appRegistered === false ? <RegisterPage /> : <Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="/products"  element={<Products />} />
            <Route path="/karyawan"  element={<Karyawan />} />
            <Route path="/token"     element={<TokenDebug />} />
          </Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
