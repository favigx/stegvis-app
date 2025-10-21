import { useState, type JSX } from "react";
import { User, Shield, Lock } from "lucide-react"; // Lock för integritet
import styles from './UserSettingsSidebar.module.css';

interface UserSettingsSidebarProps {
  onSelectCategory?: (category: string) => void;
}

function UserSettingsSidebar({ onSelectCategory }: UserSettingsSidebarProps) {
  const [selected, setSelected] = useState<string>("profil"); // default: Profil

  const IconTextButton = ({
    icon,
    text,
    id,
  }: {
    icon: JSX.Element;
    text: string;
    id: string;
  }) => (
    <button
      className={`${styles.iconTextButton} ${
        selected === id ? styles.selected : ""
      }`}
      onClick={() => {
        setSelected(id);
        onSelectCategory?.(id);
      }}
    >
      <span className={styles.iconButton}>{icon}</span>
      <span className={styles.navText}>{text}</span>
    </button>
  );

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <IconTextButton icon={<User size={20} />} text="Profil" id="profil" />
        <IconTextButton icon={<Shield size={20} />} text="Säkerhet" id="säkerhet" />
        <IconTextButton icon={<Lock size={20} />} text="Integritet" id="integritet" />
      </nav>
    </aside>
  );
}

export default UserSettingsSidebar;
