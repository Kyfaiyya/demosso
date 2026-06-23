import { useState } from "react";
import { useAuth } from "../App";

export default function RegisterPage() {
  const { userProfile, registerInApp, logout, appRegistered } = useAuth();

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

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
      background: "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.15) 0%, transparent 60%)",
    }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "40px 36px", maxWidth: 480, width: "100%",
        textAlign: "center",
      }}>
        {/* Warning Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 24px",
        }}>⚠️</div>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--emerald)" }}>
          Registrasi Diperlukan
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
          Hai <strong style={{ color: "var(--text)" }}>{userProfile?.fullName || userProfile?.username || "..."}</strong>!
          Anda sudah login di Keycloak SSO, tetapi <strong style={{ color: "var(--emerald)" }}>belum terdaftar</strong> di aplikasi Pajak.
          Silakan registrasi untuk mendapatkan akses.
        </p>

        {/* Info box */}
        <div style={{
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 10, padding: "14px 16px", marginBottom: 28, textAlign: "left", fontSize: 13,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>ℹ️</span>
            <strong style={{ color: "var(--emerald)" }}>Info Registrasi</strong>
          </div>
          <ul style={{ color: "var(--muted)", paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
            <li>Anda akan terdaftar sebagai <strong style={{ color: "var(--text)" }}>USER</strong> (role biasa)</li>
            <li>Akun Keycloak Anda: <strong style={{ color: "var(--emerald)" }}>{userProfile?.username || "..."}</strong></li>
          </ul>
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {error && <div style={{ color: "var(--red)", fontSize: 13 }}>{error}</div>}
          
          <input 
            type="text" 
            placeholder="NPWP (contoh: 01.234.567.8-901.000)"
            value={npwp}
            onChange={e => setNpwp(e.target.value)}
            style={{ padding: "12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontFamily: "inherit" }}
          />
          <input 
            type="text" 
            placeholder="Nama Lengkap / Instansi"
            value={nama}
            onChange={e => setNama(e.target.value)}
            style={{ padding: "12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontFamily: "inherit" }}
          />
          <select 
            value={jenisPajak}
            onChange={e => setJenisPajak(e.target.value)}
            style={{ padding: "12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontFamily: "inherit" }}
          >
            <option value="Pribadi">Pribadi</option>
            <option value="Badan">Badan Usaha</option>
          </select>
          
          <button type="submit" disabled={loading} style={{
            background: "var(--emerald)", color: "white",
            border: "none", borderRadius: 10, padding: "14px 32px",
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", width: "100%",
            boxShadow: "0 0 32px rgba(16,185,129,0.35)",
            transition: "all 0.15s",
            marginTop: 8
          }}
            onMouseOver={e => !loading && (e.target.style.background = "#059669")}
            onMouseOut={e => !loading && (e.target.style.background = "var(--emerald)")}
          >
            {loading ? "Memproses..." : "✅ Daftar & Simpan Data"}
          </button>
        </form>

        <button onClick={logout} style={{
          background: "transparent", color: "var(--muted)",
          border: "1px solid var(--border)", borderRadius: 10,
          padding: "10px 24px", fontSize: 13, cursor: "pointer",
          fontFamily: "inherit", width: "100%",
        }}>
          ⇠ Logout
        </button>
      </div>
    </div>
  );
}
