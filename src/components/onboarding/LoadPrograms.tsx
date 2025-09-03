import { useEffect } from "react";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchPrograms } from "../../redux/slices/programs";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export function LoadPrograms() {
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.programs);

  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch]);

  if (loading) return <p>Laddar program...</p>;
  if (error) return <p>Ett fel inträffade: {error}</p>;

  return null;
}