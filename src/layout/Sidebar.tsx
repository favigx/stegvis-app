import { useNavigate, useLocation } from "react-router-dom";
import styles from './Sidebar.module.css';
import { Home, FileText, Target, BookOpen, Calendar, GraduationCap, HelpCircle, Zap, Lightbulb, Edit, BarChart2, Gem } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Hem", path: "/home", icon: <Home size={18} /> },
    { name: "Anteckningar", path: "/notes", icon: <FileText size={18} /> },
    { name: "Målplaneraren", path: "/goalplanner", icon: <Target size={18} /> },
    { name: "Studieplaneraren", path: "/studyplanner", icon: <BookOpen size={18} /> },
    { name: "Deadlines", path: "/deadlines", icon: <Calendar size={18} /> },
    { name: "Minikurser", path: "/minicourses", icon: <GraduationCap size={18} /> },
    { name: "Quiz", path: "/quiz", icon: <Zap size={18} /> },
    { name: "Flashcards", path: "/flashcards", icon: <HelpCircle size={18} /> },
    { name: "Studietips", path: "/studytips", icon: <Lightbulb size={18} /> },
    { name: "Reflektion", path: "/reflection", icon: <Edit size={18} /> },
    { name: "Mina framsteg", path: "/myprogress", icon: <BarChart2 size={18} /> },
    { name: "Abonnemang", path: "/subscription", icon: <Gem size={18} /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <nav className={styles.nav}>
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`${styles.navButton} ${isActive ? styles.activeNavButton : ""}`}
            >
              <span className={styles.iconWrapper}>{item.icon}</span>
              {!collapsed && <span className={styles.navText}>{item.name}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
