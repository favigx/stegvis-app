import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  X,
  Menu,
  Home,
  FileText,
  BookOpen,
  GraduationCap,
  Zap,
  Lightbulb,
  Edit,
  BarChart2,
  Gem,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.auth.hasCompletedOnboarding
  );
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Hem", path: "/hem", icon: <Home size={18} /> },
    { name: "Min utbildning", path: "/min-utbildning", icon: <GraduationCap size={18} /> },
    { name: "Studieplaneraren", path: "/studieplaneraren", icon: <BookOpen size={18} /> },
    { name: "Anteckningar", path: "/anteckningar", icon: <FileText size={18} /> },
    { name: "Studera", path: "/quiz", icon: <Zap size={18} /> },
  { name: "Minikurser", path: "/minikurser", icon: <GraduationCap size={18} />, disabledItem: true },
    { name: "Mina framsteg", path: "/mina-framsteg", icon: <BarChart2 size={18} />, disabledItem: true },
    { name: "Abonnemang", path: "/abonnemang", icon: <Gem size={18} />, disabledItem: true },
  ];

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <button
          className={styles.toggleButton}
          onClick={() => setIsOpen(!isOpen)}
          disabled={!hasCompletedOnboarding}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isDisabled = !hasCompletedOnboarding || item.disabledItem;
            const handleClick = isDisabled
              ? undefined
              : () => {
                  navigate(item.path);
                  setIsOpen(false);
                };

            return (
              <button
                key={item.path}
                onClick={handleClick}
                className={`${styles.navButton} ${
                  isActive ? styles.activeNavButton : ""
                } ${isDisabled ? styles.disabledNavButton : ""}`}
                disabled={isDisabled}
              >
                <span className={styles.iconWrapper}>{item.icon}</span>
                {isOpen && <span className={styles.navText}>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
