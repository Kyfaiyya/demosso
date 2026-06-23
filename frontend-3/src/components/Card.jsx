export default function Card({ title, children, style = {} }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, overflow: "hidden", ...style
    }}>
      {title && (
        <div style={{
          padding: "13px 18px", borderBottom: "1px solid var(--border)",
          fontSize: 13, fontWeight: 600, color: "var(--muted)",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>{title}</div>
      )}
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}
