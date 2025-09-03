import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { logoutUser } from "../../api/user/auth";
import { persistor } from "../../redux/store";
import { resetPreferences } from "../../redux/slices/userPreferenceSlice";
import { resetCalenderEnums } from "../../redux/slices/calenderEnum";

export async function handleLogout(dispatch: ReturnType<typeof useDispatch>) {
  try {
    await logoutUser();
    dispatch(logout());
    dispatch(resetPreferences());
    dispatch(resetCalenderEnums());
    await persistor.purge();
  } catch (err) {
    console.error("Logout failed:", err);
  }
}