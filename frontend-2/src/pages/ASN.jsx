import { useState, useEffect } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function ASN() {
  const { apiFetch, isAppAdmin } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await apiFetch("/api/data/asn");
      const d = await r.json();
      setData(d.data || []);
    } catch { }
    setLoading(false);
  }

  async function addASN() {
    const nip = prompt("Masukkan NIP:");
    if (!nip) return;
    const nama = prompt("Masukkan Nama Lengkap:");
    if (!nama) return;
    const tgl = prompt("Masukkan Tanggal Lahir (YYYY-MM-DD):") || "2000-01-01";
    
    const r = await apiFetch("/api/data/asn", {
      method: "POST",
      body: JSON.stringify({ nip, nama, tanggal_lahir: tgl })
    });
    
    if (r.ok) {
      alert("Berhasil menambahkan data ASN!");
      load();
    } else {
      alert("Gagal atau Anda tidak memiliki akses (hanya admin).");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Data ASN (Aparatur Sipil Negara)</h1>
        {isAppAdmin() && (
          <button onClick={addASN} style={{
            background: "var(--amber)", border: "none", color: "#111",
            padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600
          }}>+ Tambah ASN</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Memuat...</p>
      ) : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["NIP", "Nama Lengkap", "Tanggal Lahir"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.nip} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontFamily: "var(--mono)", color: "var(--amber)", fontWeight: 700 }}>{p.nip}</td>
                  <td style={{ padding: "12px", fontWeight: 500 }}>{p.nama}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{p.tanggal_lahir ? new Date(p.tanggal_lahir).toLocaleDateString("id-ID") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
