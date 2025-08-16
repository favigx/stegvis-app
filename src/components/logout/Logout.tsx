import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { logoutUser } from "../../api/user/auth";

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logga ut
    </button>
  );
}
