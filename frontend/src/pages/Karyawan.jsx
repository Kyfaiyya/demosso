import { useState, useEffect } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function Karyawan() {
  const { apiFetch, isAppAdmin } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await apiFetch("/api/data/karyawan");
      const d = await r.json();
      setData(d.data || []);
    } catch { }
    setLoading(false);
  }

  async function addData() {
    const nip = prompt("Masukkan NIP Karyawan baru:");
    if (!nip) return;
    const nama = prompt("Masukkan Nama Karyawan:");
    if (!nama) return;
    
    const r = await apiFetch("/api/data/karyawan", {
      method: "POST",
      body: JSON.stringify({ nip, nama, jabatan: "Staf", departemen: "Umum", gaji: 5000000 })
    });
    
    if (r.ok) {
      alert("Berhasil menambah karyawan baru!");
      load();
    } else {
      alert("Gagal atau Anda tidak memiliki akses (hanya admin).");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Data Karyawan Dukcapil</h1>
        {isAppAdmin() && (
          <button onClick={addData} style={{
            background: "var(--indigo)", border: "none", color: "#fff",
            padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 500
          }}>+ Tambah Karyawan</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Memuat...</p>
      ) : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["NIP", "Nama", "Jabatan", "Departemen", "Gaji"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.nip} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontFamily: "var(--mono)", color: "var(--indigo-light)" }}>{p.nip}</td>
                  <td style={{ padding: "12px", fontWeight: 500 }}>{p.nama}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{p.jabatan}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{p.departemen}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>Rp {Number(p.gaji).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
