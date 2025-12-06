import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StatusOverlay } from "../../../layout/StatusOverlay";
import { LogOut } from "lucide-react";
import { useLogout } from "../hooks/useLogout";
import styles from "./Logout.module.css";

export function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggingOut, loggedOut, logout } = useLogout(dispatch, navigate);

  return (
    <>
      <button
        onClick={logout}
        className={styles.logoutButton} // <-- ny klass för styling
      >
        <LogOut className={styles.iconWrapper} /> Logga ut
      </button>

      <StatusOverlay
        active={loggingOut}
        completed={loggedOut}
        loadingText="Loggar ut..."
        doneText="Vi ses snart igen!"
        icon={<LogOut size={48} className={styles.logoutIcon} />}
      />
    </>
  );
}
