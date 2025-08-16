import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice"; 

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button onClick={handleLogout}>
      Logga ut
    </button>
  );
}