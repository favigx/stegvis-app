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
      <button onClick={logout}>Logga ut</button>

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
