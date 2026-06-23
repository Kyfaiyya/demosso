import { useState, useEffect } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function Products() {
  const { apiFetch, isAppAdmin } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await apiFetch("/api/data/kominfo");
      const d = await r.json();
      setData(d.data || []);
    } catch { }
    setLoading(false);
  }

  async function addRegistration() {
    const nik = prompt("Masukkan NIK:");
    if (!nik) return;
    const nomor = prompt("Masukkan Nomor Handphone:");
    if (!nomor) return;
    const provider = prompt("Masukkan Nama Provider (misal: Telkomsel):") || "Tri";
    
    const r = await apiFetch("/api/data/kominfo", {
      method: "POST",
      body: JSON.stringify({ nik, nomor, provider })
    });
    
    if (r.ok) {
      alert("Berhasil mendaftarkan nomor!");
      load();
    } else {
      alert("Gagal atau Anda tidak memiliki akses (hanya admin).");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Data Registrasi SIM Card (Kominfo)</h1>
        {isAppAdmin() && (
          <button onClick={addRegistration} style={{
            background: "var(--amber)", border: "none", color: "#111",
            padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600
          }}>+ Registrasi Nomor</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Memuat...</p>
      ) : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["NIK Terdaftar", "Nomor Handphone", "Provider", "Tanggal Registrasi", "Status Aktif"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.nomor} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontFamily: "var(--mono)", color: "var(--indigo-light)" }}>{p.nik}</td>
                  <td style={{ padding: "12px", fontWeight: 700 }}>{p.nomor}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ background: "var(--amber-dim)", color: "var(--amber)", padding: "2px 8px", borderRadius: 20, fontSize: 11 }}>
                      {p.provider}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{new Date(p.tgl_registrasi).toLocaleDateString()}</td>
                  <td style={{ padding: "12px", color: p.status === "Aktif" ? "var(--emerald)" : "var(--red)" }}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
