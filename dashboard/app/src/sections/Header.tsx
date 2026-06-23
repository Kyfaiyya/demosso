import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { keycloak } from '../main';

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Berita', href: '#berita' },
  { label: 'Kontak', href: '#kontak' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    setAuthenticated(keycloak.authenticated || false);
    
    if (keycloak.authenticated) {
      keycloak.loadUserProfile().then(profile => {
        setUserProfile(profile);
      });
    }

    keycloak.onAuthSuccess = () => setAuthenticated(true);
    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setUserProfile(null);
    };
  }, []);

  const login = () => {
    const width = 500;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const loginUrl = keycloak.createLoginUrl({ redirectUri: window.location.origin });
    const popup = window.open(loginUrl, "SSOLogin", `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`);
    
    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        window.location.reload();
      } else {
        try {
          if (popup?.location.href.includes(window.location.origin)) {
            clearInterval(timer);
            popup.close();
            window.location.reload();
          }
        } catch(e) {}
      }
    }, 500);
  };

  const logout = () => keycloak.logout({ redirectUri: window.location.origin });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] border-b border-white/[0.06]"
      style={{ backgroundColor: 'rgba(20, 51, 38, 0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="mx-auto max-w-[1280px] h-full flex items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-3">
          <Shield className="w-10 h-10 text-pg-accent" />
          <span className="text-xs font-medium tracking-[0.1em] text-white uppercase">
            MPP DIGITAL
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link-underline text-sm font-medium tracking-[0.02em] text-pg-text-secondary hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-4">
          {authenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-medium text-white">Halo, {userProfile?.firstName || userProfile?.username || "Warga"}</span>
              <button onClick={logout} className="p-2 text-pg-text-secondary hover:text-white transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={login} className="hidden md:block px-5 py-2.5 bg-pg-green-light text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all duration-200">
              Login SSO
            </button>
          )}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-[72px] right-0 bottom-0 w-[280px] z-50 md:hidden"
            style={{ backgroundColor: '#143326' }}
          >
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-pg-text-secondary hover:text-white py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {authenticated ? (
                <>
                  <span className="text-base font-medium text-white py-2 border-t border-white/10 mt-2 pt-4">Halo, {userProfile?.firstName || userProfile?.username || "Warga"}</span>
                  <button onClick={logout} className="mt-2 w-full px-5 py-3 bg-red-600/80 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <button onClick={() => { setMobileOpen(false); login(); }} className="mt-4 w-full px-5 py-3 bg-pg-green-light text-white text-sm font-semibold rounded-lg">
                  Login SSO
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
