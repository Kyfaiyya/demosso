import { useState, useEffect } from 'react';
import { useAuth } from "../App";

export default function LoginModal() {
  const { keycloak } = useAuth();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const loginUrl = keycloak.createLoginUrl({ redirectUri: window.location.origin });

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'SSO_LOGIN_SUCCESS') {
        window.location.reload();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const iframe = document.getElementById('sso-login-iframe');
        if (iframe?.contentWindow?.location.href.includes(window.location.origin)) {
          clearInterval(interval);
          window.location.reload();
        }
      } catch (e) {
        // Cross-origin restriction
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)"
    }}>
      <div style={{
        position: "relative", background: "#fff", borderRadius: 16, overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        width: 460, maxWidth: "95vw", height: 620, maxHeight: "90vh"
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px", background: "linear-gradient(135deg, #143326, #1B4332)", color: "#fff",
          fontSize: 14, fontWeight: 600
        }}>
          🛡️ SSO Login — Layanan Terpadu
        </div>

        {/* Loading */}
        {!iframeLoaded && (
          <div style={{
            position: "absolute", inset: "48px 0 0 0", display: "flex",
            alignItems: "center", justifyContent: "center", background: "#fff", zIndex: 10
          }}>
            <div style={{ color: "#666", fontSize: 14 }}>Memuat halaman login...</div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          id="sso-login-iframe"
          src={loginUrl}
          onLoad={() => setIframeLoaded(true)}
          style={{ width: "100%", height: "calc(100% - 48px)", border: "none" }}
          title="SSO Login"
        />
      </div>
    </div>
  );
}
