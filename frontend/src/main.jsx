import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import keycloak from "./keycloak";
import "./index.css";

keycloak
  .init({
    onLoad: "login-required",
    pkceMethod: "S256",
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
