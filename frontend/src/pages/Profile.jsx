import { useAuth } from "../App";
import Card from "../components/Card";

export default function Profile() {
  const { userProfile, keycloak } = useAuth();
  if (!userProfile) return <p style={{ color: "var(--muted)" }}>Memuat profil...</p>;

  const roles = userProfile.roles.filter(r => r.startsWith("app-"));

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Profil Saya</h1>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
        {/* Avatar */}
        <div style={{
          width: 72, height: 72, background: "var(--indigo)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700,
        }}>
          {userProfile.fullName?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
        </div>

        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{userProfile.fullName}</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{userProfile.email}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {roles.map(r => (
              <span key={r} style={{
                padding: "3px 10px", borderRadius: 20, fontSize: 11,
                fontWeight: 600, background: "var(--indigo-dim)", color: "var(--indigo-light)",
              }}>{r}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Card title="Data Akun dari Keycloak">
          {[
            ["User ID (sub)",   userProfile.sub, true],
            ["Username",        userProfile.username, false],
            ["Email",           userProfile.email, false],
            ["Email Verified",  userProfile.emailVerified ? "Ya ✓" : "Belum", false],
            ["Nama Depan",      userProfile.firstName, false],
            ["Nama Belakang",   userProfile.lastName, false],
            ["Session ID",      userProfile.sessionId, true],
            ["Login Pukul",     new Date(userProfile.issuedAt).toLocaleString("id-ID"), false],
            ["Token Exp",       new Date(userProfile.expiresAt).toLocaleString("id-ID"), false],
          ].map(([label, val, mono]) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
              gap: 16,
            }}>
              <span style={{ color: "var(--muted)", flexShrink: 0 }}>{label}</span>
              <span style={{
                fontFamily: mono ? "var(--mono)" : "inherit",
                fontSize: mono ? 11 : 13,
                color: "var(--text)",
                wordBreak: "break-all", textAlign: "right",
              }}>{val || "—"}</span>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card title="Realm Roles">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {userProfile.roles.map(r => (
              <span key={r} style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                background: r.startsWith("app-") ? "var(--indigo-dim)" : "var(--surface2)",
                color: r.startsWith("app-") ? "var(--indigo-light)" : "var(--muted)",
                border: "1px solid var(--border)",
              }}>{r}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
