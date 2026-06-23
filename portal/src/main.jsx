import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Keycloak from "keycloak-js";
import "./index.css";

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "sso-demo",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "frontend-app",
});

keycloak.init({ onLoad: "check-sso", pkceMethod: "S256" })
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App keycloak={keycloak} />
      </React.StrictMode>
    );
  })
  .catch(() => {
    console.error("Keycloak init failed");
  });
