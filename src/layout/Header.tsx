import styles from './Header.module.css';
import { HamburgerMenu } from "./HamburgerMenu";
import { getHeaderTitle } from './utils/getHeaderTitle';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const title = getHeaderTitle(location.pathname);

  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <div className={styles.text}><u>Stegvis</u></div>
      </div>
      <h2 className={styles.routeTitle}>{title}</h2>
      <div className={styles.rightHamburgerWrapper}>
        <HamburgerMenu />
      </div>
    </header>
  );
}


export default Header;