// src/features/auth/pages/OAuth2Success.tsx
import React, { useEffect } from "react";
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
        // ✅ Här finns din payload (response från /user/check)
        const response = result.payload;

        // Dispatcha loginSuccess för att trigga Redux Persist ordentligt
        dispatch(
          loginSuccess({
            id: response.id!,
            user: response.user!,
            hasCompletedOnboarding: response.hasCompletedOnboarding,
          })
        );

        // Vänta lite så Redux Persist hinner skriva innan redirect
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
