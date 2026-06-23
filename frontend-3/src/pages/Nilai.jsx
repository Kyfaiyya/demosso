import { useState, useEffect } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function Nilai() {
  const { apiFetch } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await apiFetch("/api/data/nilai");
      const d = await r.json();
      setData(d.data || []);
    } catch { }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Data Nilai Siswa</h1>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Memuat...</p>
      ) : (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["NISN", "Mata Pelajaran", "Semester", "Nilai", "Tahun Ajaran"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontFamily: "var(--mono)", color: "var(--emerald)", fontWeight: 700 }}>{p.nisn}</td>
                  <td style={{ padding: "12px", fontWeight: 500 }}>{p.mata_pelajaran}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ background: "var(--emerald-dim)", color: "var(--emerald)", padding: "2px 8px", borderRadius: 20, fontSize: 11 }}>
                      {p.semester}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: Number(p.nilai) >= 75 ? "var(--emerald)" : "var(--amber)", fontWeight: 700 }}>{Number(p.nilai).toFixed(1)}</td>
                  <td style={{ padding: "12px", color: "var(--subtle)" }}>{p.tahun_ajaran}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
