import { useState } from "react";
import { useAuth } from "../App";
import Card from "../components/Card";

export default function TokenDebug() {
  const { keycloak, apiFetch } = useAuth();
  const [introspect, setIntrospect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = keycloak.token || "";
  const parsed = token ? JSON.parse(atob(token.split(".")[1])) : null;

  async function doIntrospect() {
    setLoading(true);
    const r = await apiFetch("/api/auth/introspect", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    setIntrospect(await r.json());
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Token Debug</h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Inspect JWT Access Token dan validasi via backend.</p>

      {/* Raw Token */}
      <Card title="Raw JWT Access Token" style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, color: "var(--amber)",
          wordBreak: "break-all", lineHeight: 1.7, padding: "12px",
          background: "rgba(245,158,11,0.06)", borderRadius: 8,
          border: "1px solid rgba(245,158,11,0.15)", marginBottom: 12,
          maxHeight: 120, overflowY: "auto",
        }}>
          {token || "Tidak ada token"}
        </div>
        <button onClick={copy} style={{
          background: "var(--surface2)", border: "1px solid var(--border)",
          color: copied ? "var(--emerald)" : "var(--muted)", borderRadius: 7,
          padding: "7px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
        }}>
          {copied ? "✓ Disalin!" : "⎘ Salin Token"}
        </button>
      </Card>

      {/* Decoded claims */}
      {parsed && (
        <Card title="Claims (Decoded Payload)" style={{ marginBottom: 16 }}>
          <pre style={{
            fontFamily: "var(--mono)", fontSize: 11, color: "var(--indigo-light)",
            lineHeight: 1.7, overflowX: "auto",
            padding: "12px", background: "var(--surface2)", borderRadius: 8,
          }}>
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </Card>
      )}

      {/* Introspect */}
      <Card title="Backend Introspection">
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
          Validasi token melalui Keycloak via endpoint backend <code style={{ fontFamily: "var(--mono)", color: "var(--amber)", fontSize: 11 }}>/api/auth/introspect</code>.
        </p>
        <button onClick={doIntrospect} disabled={loading} style={{
          background: "var(--indigo)", color: "#fff", border: "none",
          borderRadius: 8, padding: "9px 20px", fontSize: 13, cursor: "pointer",
          fontFamily: "inherit", fontWeight: 500, marginBottom: 14,
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Memverifikasi..." : "🔍 Introspect via Backend"}
        </button>
        {introspect && (
          <pre style={{
            fontFamily: "var(--mono)", fontSize: 11, color: "var(--emerald)",
            lineHeight: 1.7, overflowX: "auto",
            padding: "12px", background: "var(--emerald-dim)", borderRadius: 8,
            border: "1px solid rgba(16,185,129,0.2)",
          }}>
            {JSON.stringify(introspect, null, 2)}
          </pre>
        )}
      </Card>
    </div>
  );
}
