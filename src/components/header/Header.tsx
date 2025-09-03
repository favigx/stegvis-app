import { useNavigate } from "react-router-dom";
import styles from './Header.module.css';
import MyIcon from './book-1157658_960_720.webp';
import { HamburgerMenu } from "../hamurgermenu/HamburgerMenu";

function Header() {
  const navigate = useNavigate();

  return (
<header className={styles.header}>
  <img src={MyIcon} alt="Logo" className={styles.icon} />
  <span className={styles.text}>Stegvis</span>
  
  <div className={styles.headerButtonWrapper} style={{ marginLeft: "auto" }}>
      <button onClick={() => navigate("/goalplanner")}>Målplaneraren</button>
      <button onClick={() => navigate("/studyplanner")}>Studieplaneraren</button>
      <button onClick={() => navigate("/deadlines")}>Deadlines</button>
       <button onClick={() => navigate("/minicourses")}>Minikurser</button>
        <button onClick={() => navigate("/quiz")}>Quiz</button>
         <button onClick={() => navigate("/flashcards")}>Flashcards</button>
          <button onClick={() => navigate("/studytips")}>Studietips</button>
           <button onClick={() => navigate("/reflection")}>Reflektion</button>
            <button onClick={() => navigate("/myprogress")}>Mina framsteg</button>
    <HamburgerMenu />
  </div>
</header>
  );
}

export default Header;