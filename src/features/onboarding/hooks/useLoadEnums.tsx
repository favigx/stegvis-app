import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserPreferenceEnums } from "../api/userPreferences/userPreferencesAPI"; 
import { setEnums } from "../../../redux/slices/enumSlice";
import type { ApiError } from "../../../api/apiClient";

export function useLoadEnums() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const data = await getUserPreferenceEnums();
        dispatch(setEnums(data));
      } catch (err) {
        console.error("Failed to load enums:", (err as ApiError).message);
      }
    };

    fetchEnums();
  }, [dispatch]);
}
