import { useState } from "react";
import { useAuth } from "../App";

const APP_NAME = import.meta.env.VITE_APP_NAME || "SSO Demo";
const APP_COLOR = import.meta.env.VITE_APP_COLOR || "emerald";

const colorMap = {
  indigo:  { main: "var(--indigo)", light: "var(--indigo-light)", glow: "rgba(27,67,50,0.35)",  hover: "#15533E", bg: "rgba(27,67,50,0.15)",  bgBorder: "rgba(27,67,50,0.3)",  infoBg: "rgba(27,67,50,0.08)", infoBorder: "rgba(27,67,50,0.2)", gradient: "rgba(27,67,50,0.15)" },
  amber:   { main: "var(--amber)",  light: "var(--amber)",        glow: "rgba(245,158,11,0.35)", hover: "#D97706", bg: "rgba(245,158,11,0.15)", bgBorder: "rgba(245,158,11,0.3)", infoBg: "rgba(245,158,11,0.08)", infoBorder: "rgba(245,158,11,0.2)", gradient: "rgba(245,158,11,0.15)" },
  emerald: { main: "var(--emerald)", light: "var(--emerald)",     glow: "rgba(16,185,129,0.35)", hover: "#059669", bg: "rgba(16,185,129,0.15)", bgBorder: "rgba(16,185,129,0.3)", infoBg: "rgba(16,185,129,0.08)", infoBorder: "rgba(16,185,129,0.2)", gradient: "rgba(16,185,129,0.15)" },
};

export default function RegisterPage() {
  const { userProfile, registerInApp, logout, appRegistered } = useAuth();
  const c = colorMap[APP_COLOR] || colorMap.emerald;

  const [npwp, setNpwp] = useState("");
  const [nama, setNama] = useState(userProfile?.fullName || "");
  const [jenisPajak, setJenisPajak] = useState("Pribadi");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (appRegistered) {
    window.location.href = "/dashboard";
    return null;
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!npwp || !nama) {
      setError("NPWP dan Nama wajib diisi");
      return;
    }

    setLoading(true);
    const success = await registerInApp({ npwp, nama, jenis_pajak: jenisPajak });
    if (success) {
      window.location.href = "/dashboard";
    } else {
      setError("Gagal melakukan registrasi.");
      setLoading(false);
    }
  }

  const inputStyle = {
    padding: "14px 16px", borderRadius: 10, border: "1px solid var(--border)",
    background: "var(--surface2)", color: "var(--text)", fontFamily: "inherit",
    fontSize: 14, outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
      background: `radial-gradient(ellipse at 50% 30%, ${c.gradient} 0%, transparent 60%)`,
    }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 20, padding: "44px 40px", maxWidth: 500, width: "100%",
        textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* Warning Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: c.bg, border: `2px solid ${c.bgBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 24px",
        }}>⚠️</div>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: c.light }}>
          Registrasi Diperlukan
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
          Hai <strong style={{ color: "var(--text)" }}>{userProfile?.fullName || userProfile?.username || "..."}</strong>!
          Anda sudah login di Keycloak SSO, tetapi <strong style={{ color: c.light }}>belum terdaftar</strong> di aplikasi {APP_NAME}.
          Silakan registrasi untuk mendapatkan akses.
        </p>

        {/* Info box */}
        <div style={{
          background: c.infoBg, border: `1px solid ${c.infoBorder}`,
          borderRadius: 12, padding: "14px 16px", marginBottom: 28, textAlign: "left", fontSize: 13,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>ℹ️</span>
            <strong style={{ color: c.light }}>Info Registrasi</strong>
          </div>
          <ul style={{ color: "var(--muted)", paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
            <li>Anda akan terdaftar sebagai <strong style={{ color: "var(--text)" }}>USER</strong> (role biasa)</li>
            <li>Akun Keycloak Anda: <strong style={{ color: c.light }}>{userProfile?.username || "..."}</strong></li>
            <li>Setiap aplikasi memiliki registrasi terpisah</li>
          </ul>
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          {error && <div style={{ color: "var(--red)", fontSize: 13, padding: "8px 12px", background: "var(--red-dim)", borderRadius: 8 }}>{error}</div>}

          <input
            type="text"
            placeholder="NPWP (contoh: 01.234.567.8-901.000)"
            value={npwp}
            onChange={e => setNpwp(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Nama Lengkap / Instansi"
            value={nama}
            onChange={e => setNama(e.target.value)}
            style={inputStyle}
          />
          <select
            value={jenisPajak}
            onChange={e => setJenisPajak(e.target.value)}
            style={inputStyle}
          >
            <option value="Pribadi">Pribadi</option>
            <option value="Badan">Badan Usaha</option>
          </select>

          <button type="submit" disabled={loading} style={{
            background: c.main, color: "white",
            border: "none", borderRadius: 12, padding: "16px 32px",
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", width: "100%",
            boxShadow: `0 0 32px ${c.glow}`,
            transition: "all 0.2s", marginTop: 8,
            opacity: loading ? 0.7 : 1,
          }}
            onMouseOver={e => !loading && (e.target.style.background = c.hover)}
            onMouseOut={e => !loading && (e.target.style.background = c.main)}
          >
            {loading ? "Memproses..." : "✅ Daftar & Simpan Data"}
          </button>
        </form>

        <button onClick={logout} style={{
          background: "transparent", color: "var(--muted)",
          border: "1px solid var(--border)", borderRadius: 12,
          padding: "12px 24px", fontSize: 13, cursor: "pointer",
          fontFamily: "inherit", width: "100%",
          transition: "all 0.2s",
        }}
          onMouseOver={e => { e.target.style.borderColor = "var(--subtle)"; e.target.style.color = "var(--text)"; }}
          onMouseOut={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--muted)"; }}
        >
          ⇠ Logout & Kembali
        </button>
      </div>
    </div>
  );
}
