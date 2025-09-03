import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Home, SlidersHorizontal, LogOut, CircleX } from "lucide-react"; 
import styles from "./HamburgerMenu.module.css";
import { useDispatch } from "react-redux";
import { handleLogout } from "../logout/Logout";

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

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
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={styles.container} ref={menuRef}>
      <button className={styles.menuButton} onClick={() => setOpen(!open)}>
        {open ? <CircleX size={20} /> : <Settings size={20} />}
      </button>

      <nav className={`${styles.menu} ${open ? styles.open : ""}`}>
        <button onClick={() => handleNavigate("/")} className={styles.menuItem}>
          <Home className={styles.icon} /> Hem
        </button>
        <button onClick={() => handleNavigate("/settings-preferences")} className={styles.menuItem}>
          <SlidersHorizontal className={styles.icon} /> Ändra preferenser
        </button>
        <button
          onClick={async () => {
            await handleLogout(dispatch);
            setOpen(false);
          }}
          className={styles.menuItem}
        >
          <LogOut className={styles.icon} /> Logga ut
        </button>
      </nav>
    </div>
  );
}