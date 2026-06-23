import { useState, useEffect } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function Laporan() {
  const { apiFetch } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await apiFetch("/api/data/laporan-pajak");
      const d = await r.json();
      setData(d.data || []);
    } catch { }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Laporan Pajak (SPT)</h1>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Memuat...</p>
      ) : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["NPWP", "Tahun Pajak", "Jenis SPT", "Pajak Terutang", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontFamily: "var(--mono)", color: "var(--emerald)", fontWeight: 700 }}>{p.npwp}</td>
                  <td style={{ padding: "12px", fontFamily: "var(--mono)" }}>{p.tahun_pajak}</td>
                  <td style={{ padding: "12px", color: "var(--text)" }}>{p.jenis_spt}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>Rp {Number(p.pajak_terutang).toLocaleString("id-ID")}</td>
                  <td style={{ padding: "12px", color: p.status === "Dilaporkan" ? "var(--emerald)" : "var(--amber)" }}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
