import { useEffect, useState } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function Dashboard() {
  const { userProfile, hasRole, apiFetch, appRole, isAppAdmin } = useAuth();
  const [session, setSession] = useState(null);

  useEffect(() => {
    apiFetch("/api/user/session").then(r => r.json()).then(setSession).catch(() => {});
  }, []);

  const roles = userProfile?.roles?.filter(r => r.startsWith("app-")) || [];

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        Selamat datang, {userProfile?.firstName || "..."} 👋
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>
        Anda berhasil login di Aplikasi Kominfo.
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Status Sesi" value="Aktif ✓" color="var(--emerald)" />
        <StatCard label="Role Keycloak" value={roles.length > 0 ? roles[0] : "user"} color="var(--amber)" />
        <StatCard label="Role Aplikasi Ini" value={appRole || "USER"} color="var(--indigo-light)" />
      </div>

      {/* Hak akses */}
      <Card title="Hak Akses Aplikasi Kominfo">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["Lihat Registrasi SIM",   true,               "Semua Role"],
            ["Tambah Registrasi SIM",  isAppAdmin(),       "ADMIN only"],
            ["Lihat Domain",           true,               "Semua Role"],
            ["Lihat Data ASN",         true,               "Semua Role"],
            ["Tambah Data ASN",        isAppAdmin(),       "ADMIN only"],
          ].map(([label, allowed, note]) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", background: "var(--surface2)",
              borderRadius: 8, fontSize: 13,
            }}>
              <span style={{ fontSize: 16 }}>{allowed ? "✅" : "🔒"}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{note}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Info SSO */}
      <Card title="Informasi SSO" style={{ marginTop: 16 }}>
        <Row label="Issuer"    value={userProfile ? new URL(userProfile.issuer || "").hostname : "..."} mono />
        <Row label="Session ID" value={userProfile?.sessionId?.slice(0,20) + "..." || "..."} mono />
        <Row label="Login Pukul" value={userProfile?.issuedAt ? new Date(userProfile.issuedAt).toLocaleString("id-ID") : "..."} />
        <Row label="Token Exp"  value={userProfile?.expiresAt ? new Date(userProfile.expiresAt).toLocaleString("id-ID") : "..."} />
      </Card>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "18px 20px",
    }}>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
    }}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span style={{ fontFamily: mono ? "var(--mono)" : "inherit", fontSize: mono ? 11 : 13, color: "var(--amber)" }}>
        {value}
      </span>
    </div>
  );
}
