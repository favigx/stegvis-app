import { useState } from "react";
import type { AppDispatch } from "../../../redux/store";
import { handleLogout as logoutUtil } from "../utils/handleLogout";

export function useLogout(dispatch: AppDispatch, navigate: (path: string) => void) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    setLoggedOut(false);

    const startTime = Date.now();

    const success = await logoutUtil(dispatch);

    if (success) {
      const minOverlayTime = 2000;
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(minOverlayTime - elapsed, 0);

      setTimeout(() => setLoggedOut(true), 300);

      setTimeout(() => {
        setLoggingOut(false);
        navigate("/logga-in");
      }, remainingTime);
    } else {
      setLoggingOut(false);
      alert("Något gick fel vid utloggning.");
    }
  };

  return { loggingOut, loggedOut, logout };
}
