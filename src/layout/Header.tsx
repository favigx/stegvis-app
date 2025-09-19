import styles from './Header.module.css';
import treestairs from '../features/landing/components/images/treestairs.png';
import { HamburgerMenu } from "./HamburgerMenu";
import { Menu } from "lucide-react";
import { getHeaderTitle } from './utils/getHeaderTitle';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

function Header({ collapsed, setCollapsed }: HeaderProps) {
  const location = useLocation();
  const title = getHeaderTitle(location.pathname);

  return (
    <header className={styles.header}>
      <button
        className={styles.topHamburger}
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu size={24} color="white" />
      </button>

      <div className={styles.logoWrapper}>
        <img src={treestairs} alt="Logo" className={styles.icon} />
        <div className={styles.text}>Stegvis</div>
      </div>

      <h2 className={styles.routeTitle}>{title}</h2>

      <div className={styles.rightHamburgerWrapper}>
        <HamburgerMenu />
      </div>
    </header>
  );
}

export default Header;