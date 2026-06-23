import { useState, useEffect } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function WajibPajak() {
  const { apiFetch, isAppAdmin } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await apiFetch("/api/data/wajib-pajak");
      const d = await r.json();
      setData(d.data || []);
    } catch { }
    setLoading(false);
  }

  async function addWajibPajak() {
    const npwp = prompt("Masukkan NPWP:");
    if (!npwp) return;
    const nama = prompt("Masukkan Nama:");
    if (!nama) return;
    const jenis = prompt("Masukkan Jenis Pajak (Pribadi/Badan):") || "Pribadi";
    
    const r = await apiFetch("/api/data/wajib-pajak", {
      method: "POST",
      body: JSON.stringify({ npwp, nama, alamat: "Jakarta", jenis_pajak: jenis })
    });
    
    if (r.ok) {
      alert("Berhasil mendaftarkan Wajib Pajak!");
      load();
    } else {
      alert("Gagal atau Anda tidak memiliki akses (hanya admin).");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Data Wajib Pajak</h1>
        {isAppAdmin() && (
          <button onClick={addWajibPajak} style={{
            background: "var(--emerald)", border: "none", color: "white",
            padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600
          }}>+ Tambah Wajib Pajak</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Memuat...</p>
      ) : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["NPWP", "Nama Wajib Pajak", "Jenis Pajak", "Alamat", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.npwp} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontFamily: "var(--mono)", color: "var(--emerald)", fontWeight: 700 }}>{p.npwp}</td>
                  <td style={{ padding: "12px", fontWeight: 700 }}>{p.nama}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ background: "var(--emerald-dim)", color: "var(--emerald)", padding: "2px 8px", borderRadius: 20, fontSize: 11 }}>
                      {p.jenis_pajak}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{p.alamat}</td>
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
