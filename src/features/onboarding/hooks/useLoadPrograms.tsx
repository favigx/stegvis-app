import { useEffect } from "react";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { fetchPrograms } from "../../../redux/slices/programs";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useLoadPrograms() {
  const dispatch = useAppDispatch();
  const { loading, error, data } = useAppSelector((state) => state.programs);

  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch]);

  return { loading, error, data };
}
