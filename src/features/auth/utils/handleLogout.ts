import { type AppDispatch, persistor } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import { logoutUser } from "../api/authAPI";
import { resetPreferences } from "../../../redux/slices/userPreferenceSlice";
export async function handleLogout(dispatch: AppDispatch): Promise<boolean> {

  try {
    await logoutUser();

    dispatch(logout());
    dispatch(resetPreferences());
  
    await persistor.purge();
    return true;
  } catch (err) {
    console.error("Logout failed:", err);
    return false;
  }
}
