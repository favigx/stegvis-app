import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCalenderTypeEnum } from "../../api/calender/task/enum"; 
import { setCalenderEnums } from "../../redux/slices/calenderEnum"; 
import type { ApiError } from "../../api/apiClient";

export function LoadCalenderEnums() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCalenderEnums = async () => {
      try {
        const data = await getCalenderTypeEnum();
        dispatch(setCalenderEnums(data));
      } catch (err) {
        console.error("Failed to load calenderenums:", (err as ApiError).message);
      }
    };

    fetchCalenderEnums();
  }, [dispatch]);

  return null;
}