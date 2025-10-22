import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth, loginSuccess } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../redux/store";

const OAuth2Success = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const result = await dispatch(checkAuth());

      if (checkAuth.fulfilled.match(result)) {
        const response = result.payload;
        dispatch(
          loginSuccess({
            id: response.id!,
            user: response.user!,
            hasCompletedOnboarding: response.hasCompletedOnboarding,
          })
        );
        setTimeout(() => navigate("/hem"), 400);
      } else {
        navigate("/");
      }
    };

    verifyAuth();
  }, [dispatch, navigate]);

  return <p>Verifierar Google-inloggning...</p>;
};

export default OAuth2Success;
