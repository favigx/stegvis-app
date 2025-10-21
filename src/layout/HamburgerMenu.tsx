import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StatusOverlay } from "./StatusOverlay"; 
import { LogOut } from "lucide-react";
import { useLogout } from "../features/auth/hooks/useLogout"; 
import styles from "./HamburgerMenu.module.css";
import { useState, useRef, useEffect } from "react";
import { UserRoundCog, Home, SlidersHorizontal, CircleX } from "lucide-react";
import type { RootState } from "../redux/store";

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  const hasCompletedOnboarding = useSelector((state: RootState) => state.auth.hasCompletedOnboarding);

  const { loggingOut, loggedOut, logout } = useLogout(dispatch, navigate);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={styles.container} ref={menuRef}>
      <button className={styles.menuButton} onClick={() => setOpen(!open)}>
        {open ? <CircleX size={23} /> : <UserRoundCog size={23} />}
      </button>

      <nav className={`${styles.menu} ${open ? styles.open : ""}`}>
        {/* Inställningar - alltid disabled */}
        <button
          onClick={undefined} // ingen navigering
          className={`${styles.menuItem} ${styles.disabledMenuItem}`}
          disabled={true} // alltid disabled
        >
          <SlidersHorizontal className={styles.icon} /> Inställningar
        </button>

        {/* Logga ut - alltid klickbar */}
        <button onClick={logout} className={styles.menuItem}>
          <LogOut className={styles.icon} /> Logga ut
        </button>
      </nav>

      <StatusOverlay
        active={loggingOut}
        completed={loggedOut}
        loadingText="Loggar ut..."
        doneText="Vi ses snart igen!"
        icon={<LogOut size={48} className={styles.logoutIcon} />}
      />
    </div>
  );
}
