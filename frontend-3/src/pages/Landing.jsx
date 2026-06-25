import { useAuth } from "../App";

const APP_NAME = import.meta.env.VITE_APP_NAME || "SSO Demo";
const APP_COLOR = import.meta.env.VITE_APP_COLOR || "indigo";

const colorMap = {
  indigo:  { main: "var(--indigo)", light: "var(--indigo-light)", glow: "rgba(27,67,50,0.35)",  hover: "#15533E", gradient: "rgba(27,67,50,0.12)" },
  amber:   { main: "var(--amber)",  light: "var(--amber)",        glow: "rgba(245,158,11,0.35)", hover: "#D97706", gradient: "rgba(245,158,11,0.12)" },
  emerald: { main: "var(--emerald)", light: "var(--emerald)",     glow: "rgba(16,185,129,0.35)", hover: "#059669", gradient: "rgba(16,185,129,0.12)" },
};

const iconMap = {
  indigo: "👥",
  amber: "📱",
  emerald: "🎓",
};

export default function Landing() {
  const { login } = useAuth();
  const c = colorMap[APP_COLOR] || colorMap.indigo;
  const icon = iconMap[APP_COLOR] || "🏛️";

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
      background: `radial-gradient(ellipse at 60% 20%, ${c.gradient} 0%, transparent 60%)`,
    }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        {/* App Icon */}
        <div style={{
          width: 72, height: 72, background: c.main, borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, fontWeight: 700, margin: "0 auto 28px", color: "white",
          boxShadow: `0 0 40px ${c.glow}`,
        }}>{icon}</div>

        {/* Title */}
        <h1 style={{
          fontSize: 36, fontWeight: 700, marginBottom: 12,
          letterSpacing: "-0.02em", color: c.light,
        }}>
          {APP_NAME}
        </h1>

        {/* Subtitle */}
        <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 8 }}>
          Terintegrasi dengan <strong style={{ color: c.light }}>Keycloak SSO</strong>
        </p>
        <p style={{ color: "var(--subtle)", fontSize: 13, marginBottom: 36 }}>
          Single Sign-On · PKCE · JWT · Role-Based Access Control
        </p>

        {/* Login Button */}
        <button onClick={login} style={{
          background: c.main, color: "#fff",
          border: "none", borderRadius: 12, padding: "16px 40px",
          fontSize: 16, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: `0 0 40px ${c.glow}`,
          transition: "all 0.2s ease",
          display: "inline-flex", alignItems: "center", gap: 10,
        }}
          onMouseOver={e => { e.target.style.background = c.hover; e.target.style.transform = "translateY(-2px)"; }}
          onMouseOut={e => { e.target.style.background = c.main; e.target.style.transform = "translateY(0)"; }}
        >
          🔐 Login via Keycloak
        </button>

        {/* SSO Info Box */}
        <div style={{
          marginTop: 40, background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "20px 24px", textAlign: "left",
        }}>
          <div style={{ fontSize: 13, color: c.light, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🏛️</span> Portal Smart Service
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 12 }}>
            Satu akun untuk mengakses semua layanan publik. Login di salah satu aplikasi, otomatis terautentikasi di semua layanan.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Dukcapil", "Kominfo", "Layanan Pendidikan"].map(name => (
              <span key={name} style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 6,
                background: name === APP_NAME ? `${c.glow}` : "var(--surface2)",
                border: `1px solid ${name === APP_NAME ? c.main : "var(--border)"}`,
                color: name === APP_NAME ? c.light : "var(--muted)",
                fontWeight: name === APP_NAME ? 600 : 400,
              }}>{name}</span>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 16, fontSize: 11, color: "var(--subtle)" }}>
          © 2026 Portal Smart Service — Terintegrasi dengan Keycloak SSO
        </p>
      </div>
    </div>
  );
}
