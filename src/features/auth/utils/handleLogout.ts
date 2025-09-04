import { type AppDispatch, persistor } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import { logoutUser } from "../api/authAPI";
import { resetPreferences } from "../../../redux/slices/userPreferenceSlice";
import { resetCalenderEnums } from "../../../redux/slices/calenderEnum";

/**
 * Loggar ut användaren, nollställer Redux-state och tömmer persist-lagringen.
 * @param dispatch Redux dispatch
 * @returns Promise<boolean> true om utloggning lyckades, annars false
 */
export async function handleLogout(dispatch: AppDispatch): Promise<boolean> {
  try {
    // Kör API-anrop först
    await logoutUser();

    // Rensa Redux-state och persisted data
    dispatch(logout());
    dispatch(resetPreferences());
    dispatch(resetCalenderEnums());

    await persistor.purge();
    return true;
  } catch (err) {
    console.error("Logout failed:", err);
    return false;
  }
}
