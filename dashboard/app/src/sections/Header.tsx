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
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    setShowLoginModal(true);
  };

  const logout = () => keycloak.logout({ redirectUri: window.location.origin });

  // Listen for message from login iframe/popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'SSO_LOGIN_SUCCESS') {
        setShowLoginModal(false);
        window.location.reload();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
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

      {/* Login Popup Modal (Overlay) */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            loginUrl={keycloak.createLoginUrl({ redirectUri: window.location.origin })}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Login Modal Component ────────────────────────────────
function LoginModal({ onClose, loginUrl }: { onClose: () => void; loginUrl: string }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Poll the iframe to check if it has redirected back to origin (login success)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const iframe = document.getElementById('sso-login-iframe') as HTMLIFrameElement;
        if (iframe?.contentWindow?.location.href.includes(window.location.origin)) {
          clearInterval(interval);
          onClose();
          window.location.reload();
        }
      } catch (e) {
        // Cross-origin restriction — means iframe is still on Keycloak domain
      }
    }, 500);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: '460px', maxWidth: '95vw', height: '620px', maxHeight: '90vh' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200"
          style={{ background: 'linear-gradient(135deg, #143326, #1B4332)' }}>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-300" />
            <span className="text-sm font-semibold text-white">Login SSO — Portal Smart Service</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Loading State */}
        {!iframeLoaded && (
          <div className="absolute inset-0 top-[48px] flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Memuat halaman login...</span>
            </div>
          </div>
        )}

        {/* Keycloak Login iframe */}
        <iframe
          id="sso-login-iframe"
          src={loginUrl}
          onLoad={() => setIframeLoaded(true)}
          className="w-full border-0"
          style={{ height: 'calc(100% - 48px)' }}
          title="SSO Login"
        />
      </motion.div>
    </motion.div>
  );
}
