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
      const r = await apiFetch("/api/data/dukcapil");
      const d = await r.json();
      setData(d.data || []);
    } catch { }
    setLoading(false);
  }

  async function addData() {
    const nik = prompt("Masukkan NIK baru:");
    if (!nik) return;
    const nama = prompt("Masukkan Nama Lengkap:");
    if (!nama) return;
    
    const r = await apiFetch("/api/data/dukcapil", {
      method: "POST",
      body: JSON.stringify({ nik, nama, alamat: "Jakarta Pusat" })
    });
    
    if (r.ok) {
      alert("Berhasil menambah penduduk baru!");
      load();
    } else {
      alert("Gagal atau Anda tidak memiliki akses (hanya admin).");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Data Penduduk (Dukcapil)</h1>
        {isAppAdmin() && (
          <button onClick={addData} style={{
            background: "var(--indigo)", border: "none", color: "#fff",
            padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 500
          }}>+ Tambah Penduduk</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Memuat...</p>
      ) : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["NIK", "Nama Lengkap", "Tempat Lahir", "Tanggal Lahir", "Alamat"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.nik} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontFamily: "var(--mono)", color: "var(--indigo-light)" }}>{p.nik}</td>
                  <td style={{ padding: "12px", fontWeight: 500 }}>{p.nama}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{p.tempat_lahir}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{new Date(p.tanggal_lahir).toLocaleDateString()}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{p.alamat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
