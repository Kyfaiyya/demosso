import { useState, useEffect } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function Reports() {
  const { apiFetch, hasRole } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/api/data/reports")
      .then(async r => {
        if (r.status === 403) throw new Error("403");
        return r.json();
      })
      .then(d => setReports(d.data || []))
      .catch(e => setError(e.message === "403" ? "forbidden" : "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "var(--muted)" }}>Memuat...</p>;

  if (error === "forbidden") return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Laporan</h1>
      <div style={{
        background: "var(--red-dim)", border: "1px solid rgba(239,68,68,0.25)",
        borderRadius: 12, padding: "28px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Akses Ditolak</div>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          Endpoint ini memerlukan role <strong style={{ color: "var(--red)" }}>app-manager</strong> atau <strong style={{ color: "var(--red)" }}>app-admin</strong>.
          Akun Anda saat ini tidak memiliki akses.
        </div>
      </div>
    </div>
  );

  const fmt = (n) => n ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n) : "—";

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Laporan</h1>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["ID", "Judul", "Dibuat", "Status", "Revenue"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px", color: "var(--subtle)" }}>#{r.id}</td>
                <td style={{ padding: "12px", fontWeight: 500 }}>{r.title}</td>
                <td style={{ padding: "12px", color: "var(--muted)" }}>{r.createdAt}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 20, fontSize: 11,
                    background: r.status === "final" ? "var(--emerald-dim)" : "var(--amber-dim)",
                    color: r.status === "final" ? "var(--emerald)" : "var(--amber)",
                  }}>{r.status}</span>
                </td>
                <td style={{ padding: "12px", fontFamily: "var(--mono)", fontSize: 12, color: "var(--emerald)" }}>{fmt(r.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
