import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  Home,
  FileText,
  BookOpen,
  GraduationCap,
  Zap,
  Settings
} from "lucide-react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../redux/store";

// Importera bilden
import TreeStairsImg from "../layout/images/treestairs.png";
import { LogoutButton } from "../features/auth/components/Logout";

function Sidebar() {
  // const hasCompletedOnboarding = useSelector(
  //   (state: RootState) => state.auth.hasCompletedOnboarding
  // );
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Hem", path: "/hem", icon: <Home size={18} /> },
    { name: "Studieprofil", path: "/studieprofil", icon: <GraduationCap size={18} /> },
    { name: "Studieplaneraren", path: "/studieplaneraren", icon: <BookOpen size={18} /> },
    { name: "Anteckningar", path: "/anteckningar", icon: <FileText size={18} /> },
    { name: "Studera", path: "/quiz", icon: <Zap size={18} /> },
    { name: "Inställningar", path: "/installningar", icon: <Settings size={18} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Header med bild */}
      <div className={styles.sidebarHeader}>
        <img src={TreeStairsImg} alt="Treestairs" className={styles.logo} />
        <span>Stegvis</span>
      </div>

      {/* Meny centrerad lodrätt */}
      <div className={styles.navWrapper}>
        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className={`${styles.navItem} ${isActive ? styles.activeNavItem : ""}`}
                onClick={() => navigate(item.path)}
                style={{ cursor: "pointer" }}
              >
                <span className={styles.iconWrapper}>{item.icon}</span>
                <span className={styles.navText}>{item.name}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Logout-knappen längst ner */}
  <div className={styles.logoutWrapper}>
  {/* Logout-knappen */}
  <LogoutButton />

  {/* Vågmönster under knappen */}
  <svg className={styles.waveDecoration} viewBox="0 0 1440 80" preserveAspectRatio="none">
    <path
      d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
      fill="url(#gradientWave)"
    ></path>
    <defs>
      <linearGradient id="gradientWave" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#285986" />
        <stop offset="50%" stopColor="#47c6ec" />
        <stop offset="100%" stopColor="#fd7c25" />
      </linearGradient>
    </defs>
  </svg>
</div>


    </aside>
  );
}

export default Sidebar;
