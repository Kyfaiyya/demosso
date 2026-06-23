import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import styles from "./Layout.module.css";

const NAV = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/profile",   icon: "◉", label: "Profil Saya" },
  { to: "/data-siswa", icon: "🎓", label: "Data Siswa" },
  { to: "/nilai",      icon: "📊", label: "Data Nilai" },
  { to: "/token",     icon: "⟨/⟩", label: "Token Debug" },
];

export default function Layout() {
  const { userProfile, logout, appRole } = useAuth();
  const initials = userProfile?.fullName?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoMark} style={{background: "var(--emerald)", color: "white"}}>P</span>
          <span className={styles.logoText}>Pendidikan App</span>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, icon, label, adminOnly }) => {
            if (adminOnly && appRole !== "ADMIN") return null;
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.navIcon}>{icon}</span>
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.sideBottom}>
          <div className={styles.userChip}>
            <div className={styles.avatar} style={{background: "var(--emerald)", color: "white"}}>{initials}</div>
            <div className={styles.userMeta}>
              <div className={styles.userName}>{userProfile?.fullName || "..."}</div>
              <div className={styles.userRole}>Aplikasi: {appRole || "USER"}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={logout}>
            ⇠ Logout SSO
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
