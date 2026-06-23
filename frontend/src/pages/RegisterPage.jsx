import { useState } from "react";
import { useAuth } from "../App";

export default function RegisterPage() {
  const { userProfile, registerInApp, logout, appRegistered } = useAuth();
  
  const [nik, setNik] = useState("");
  const [nama, setNama] = useState(userProfile?.fullName || "");
  const [alamat, setAlamat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (appRegistered) {
    window.location.href = "/dashboard";
    return null;
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!nik || !nama) {
      setError("NIK dan Nama wajib diisi");
      return;
    }
    
    setLoading(true);
    const success = await registerInApp({ nik, nama, alamat });
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
      background: "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.15) 0%, transparent 60%)",
    }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "40px 36px", maxWidth: 480, width: "100%",
        textAlign: "center",
      }}>
        {/* Warning Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(245,158,11,0.15)", border: "2px solid rgba(245,158,11,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 24px",
        }}>⚠️</div>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--amber)" }}>
          Registrasi Diperlukan
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
          Hai <strong style={{ color: "var(--text)" }}>{userProfile?.fullName || userProfile?.username || "..."}</strong>!
          Anda sudah login di Keycloak SSO, tetapi <strong style={{ color: "var(--amber)" }}>belum terdaftar</strong> di aplikasi ini.
          Silakan registrasi untuk mendapatkan akses.
        </p>

        {/* Info box */}
        <div style={{
          background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 10, padding: "14px 16px", marginBottom: 28, textAlign: "left", fontSize: 13,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>ℹ️</span>
            <strong style={{ color: "var(--indigo-light)" }}>Info Registrasi</strong>
          </div>
          <ul style={{ color: "var(--muted)", paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
            <li>Anda akan terdaftar sebagai <strong style={{ color: "var(--text)" }}>USER</strong> (role biasa)</li>
            <li>Akun Keycloak Anda: <strong style={{ color: "var(--indigo-light)" }}>{userProfile?.username || "..."}</strong></li>
            <li>Setiap aplikasi memiliki registrasi terpisah</li>
          </ul>
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {error && <div style={{ color: "var(--red)", fontSize: 13 }}>{error}</div>}
          
          <input 
            type="text" 
            placeholder="Nomor Induk Kependudukan (NIK)"
            value={nik}
            onChange={e => setNik(e.target.value)}
            style={{ padding: "12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontFamily: "inherit" }}
          />
          <input 
            type="text" 
            placeholder="Nama Lengkap"
            value={nama}
            onChange={e => setNama(e.target.value)}
            style={{ padding: "12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontFamily: "inherit" }}
          />
          <input 
            type="text" 
            placeholder="Alamat"
            value={alamat}
            onChange={e => setAlamat(e.target.value)}
            style={{ padding: "12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontFamily: "inherit" }}
          />
          
          <button type="submit" disabled={loading} style={{
            background: "var(--indigo)", color: "#fff",
            border: "none", borderRadius: 10, padding: "14px 32px",
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", width: "100%",
            boxShadow: "0 0 32px rgba(99,102,241,0.35)",
            transition: "all 0.15s",
            marginTop: 8
          }}
            onMouseOver={e => !loading && (e.target.style.background = "#4F52D3")}
            onMouseOut={e => !loading && (e.target.style.background = "var(--indigo)")}
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
