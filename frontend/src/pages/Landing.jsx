import { useAuth } from "../App";

export default function Landing() {
  const { login } = useAuth();

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
      background: "radial-gradient(ellipse at 60% 20%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          width: 56, height: 56, background: "var(--indigo)", borderRadius: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, fontWeight: 700, margin: "0 auto 24px"
        }}>S</div>

        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>
          SSO Demo
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 8 }}>
          Single Sign-On dengan <strong style={{ color: "var(--indigo-light)" }}>Keycloak</strong>,
          Node.js, dan React
        </p>
        <p style={{ color: "var(--subtle)", fontSize: 13, marginBottom: 36 }}>
          PKCE · JWT · Role-Based Access Control
        </p>

        <button onClick={login} style={{
          background: "var(--indigo)", color: "#fff",
          border: "none", borderRadius: 10, padding: "14px 32px",
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 0 32px rgba(99,102,241,0.35)",
          transition: "all 0.15s",
        }}
          onMouseOver={e => e.target.style.background = "#4F52D3"}
          onMouseOut={e => e.target.style.background = "var(--indigo)"}
        >
          🔐 Login via Keycloak
        </button>

        <div style={{
          marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12, textAlign: "left"
        }}>
          {[
            ["admin", "admin123", "Super Admin"],
            ["budi",  "budi456",  "Manager"],
            ["sari",  "sari789",  "User"],
          ].map(([u, p, r]) => (
            <div key={u} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "12px 14px"
            }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{r}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--amber)" }}>
                {u} / {p}
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 16, fontSize: 11, color: "var(--subtle)" }}>
          Akun demo di atas sudah tersedia di Keycloak setelah docker compose up
        </p>
      </div>
    </div>
  );
}
