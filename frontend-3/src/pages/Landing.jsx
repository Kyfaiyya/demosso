import { useAuth } from "../App";

export default function Landing() {
  const { login } = useAuth();

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
      background: "radial-gradient(ellipse at 60% 20%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          width: 56, height: 56, background: "var(--emerald)", borderRadius: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, fontWeight: 700, margin: "0 auto 24px", color: "white"
        }}>P</div>

        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em", color: "var(--emerald)" }}>
          SSO Demo - Layanan Pendidikan
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 8 }}>
          Single Sign-On dengan <strong style={{ color: "var(--emerald)" }}>Keycloak</strong>,
          Node.js, dan React
        </p>

        <button onClick={login} style={{
          background: "var(--emerald)", color: "white",
          border: "none", borderRadius: 10, padding: "14px 32px",
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 0 32px rgba(16,185,129,0.35)",
          transition: "all 0.15s",
          marginTop: 24
        }}
          onMouseOver={e => e.target.style.background = "#059669"}
          onMouseOut={e => e.target.style.background = "var(--emerald)"}
        >
          🔐 Login via Keycloak
        </button>
      </div>
    </div>
  );
}
