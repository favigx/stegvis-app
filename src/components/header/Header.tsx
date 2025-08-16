import { useNavigate } from "react-router-dom";
import styles from './Header.module.css';
import MyIcon from './book-1157658_960_720.webp';
import LogoutButton from '../logout/Logout';

function Header() {
  const navigate = useNavigate();

  return (
<header className={styles.header}>
  <img src={MyIcon} alt="Logo" className={styles.icon} />
  <span className={styles.text}>Stegvis</span>
  
  <div className={styles.headerButtonWrapper} style={{ marginLeft: "auto" }}>
    <button onClick={() => navigate("/deadline")}>Deadlines</button>
    <LogoutButton />
  </div>
</header>
  );
}

export default Header;