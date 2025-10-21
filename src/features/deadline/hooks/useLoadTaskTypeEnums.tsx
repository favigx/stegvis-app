// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { getTaskTypeEnum } from "../api/taskAPI";
// import type { ApiError } from "../../../api/apiClient";

// export function useLoadTaskTypeEnums() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchTaskTypeEnums = async () => {
//       try {
//         const data = await getTaskTypeEnum();
//         dispatch(setCalenderEnums(data));
//       } catch (err) {
//         console.error("Failed to load calenderenums:", (err as ApiError).message);
//       }
//     };

//     fetchTaskTypeEnums();
//   }, [dispatch]);
// }
