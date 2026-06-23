import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import keycloak from "./keycloak";
import "./index.css";

keycloak
  .init({
    onLoad: "check-sso",                     // cek sesi, jangan redirect paksa
    silentCheckSsoRedirectUri:               // iframe SSO check
      window.location.origin + "/silent-check-sso.html",
    pkceMethod: "S256",                      // PKCE wajib untuk public client
    checkLoginIframe: false,
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App keycloak={keycloak} />
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error("Keycloak init failed:", err);
    // Render tetap, tapi tanpa auth
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App keycloak={keycloak} />
      </React.StrictMode>
    );
  });
