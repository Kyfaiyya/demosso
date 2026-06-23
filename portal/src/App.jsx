import { useState, useEffect } from "react";

export default function App({ keycloak }) {
  const [authenticated, setAuthenticated] = useState(keycloak.authenticated || false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    setAuthenticated(keycloak.authenticated || false);

    keycloak.onAuthSuccess = () => setAuthenticated(true);
    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setUserProfile(null);
    };

    if (keycloak.authenticated) {
      keycloak.loadUserProfile().then(profile => {
        setUserProfile(profile);
      });
    }
  }, []);

  const login = () => {
    const width = 500;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    // Buka jendela popup untuk login Keycloak
    const loginUrl = keycloak.createLoginUrl({ redirectUri: window.location.origin });
    const popup = window.open(loginUrl, "SSOLogin", `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`);
    
    // Pantau popup, jika sudah kembali ke origin kita (berarti sudah redirect setelah login), tutup dan reload
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.location.reload();
      } else {
        try {
          if (popup.location.href.includes(window.location.origin)) {
            clearInterval(timer);
            popup.close();
            window.location.reload();
          }
        } catch(e) {
          // Ignored (CORS error when popup is on Keycloak domain)
        }
      }
    }, 500);
  };
  
  const logout = () => keycloak.logout({ redirectUri: window.location.origin });

  const apps = [
    {
      id: "dukcapil",
      name: "Dukcapil",
      desc: "Data Kependudukan & Pencatatan Sipil",
      icon: "👥",
      url: "http://localhost:3000",
      color: "var(--indigo)"
    },
    {
      id: "kominfo",
      name: "Kominfo",
      desc: "Registrasi SIM Card & Domain",
      icon: "📱",
      url: "http://localhost:3001",
      color: "var(--amber)"
    },
    {
      id: "pendidikan",
      name: "Layanan Pendidikan",
      desc: "Data Siswa & Nilai Akademik",
      icon: "🎓",
      url: "http://localhost:3002",
      color: "var(--emerald)"
    }
  ];

  return (
    <div className="portal-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">🏛️</span>
          <span className="brand-text">Portal Smart Service</span>
        </div>
        <div className="nav-actions">
          {authenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Halo, {userProfile?.firstName || userProfile?.username || "Warga"}!</span>
              <button onClick={logout} className="btn-outline">Logout SSO</button>
            </div>
          ) : (
            <button onClick={login} className="btn-primary">Login / Daftar</button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Satu Portal Untuk Semua Layanan</h1>
          <p>
            Akses berbagai layanan publik dengan mudah dan aman menggunakan satu akun SSO (Single Sign-On).
            Pilih layanan yang Anda butuhkan di bawah ini.
          </p>
        </div>
      </header>

      {/* Apps Grid */}
      <main className="apps-section">
        <h2 className="section-title">Layanan Tersedia</h2>
        <div className="apps-grid">
          {apps.map(app => (
            <a 
              key={app.id} 
              href={app.url} 
              className="app-card" 
              style={{"--theme": app.color}}
            >
              <div className="app-icon">{app.icon}</div>
              <div className="app-info">
                <h3>{app.name}</h3>
                <p>{app.desc}</p>
              </div>
              <div className="app-arrow">➔</div>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Portal Smart Service. Terintegrasi dengan Keycloak SSO.</p>
      </footer>
    </div>
  );
}
