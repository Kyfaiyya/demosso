import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "sso-demo",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "frontend-app",
});

keycloak.init({ onLoad: "check-sso", pkceMethod: "S256" }).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}).catch(() => {
  console.error("Keycloak init failed");
});
