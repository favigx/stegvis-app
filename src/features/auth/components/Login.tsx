import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/slices/authSlice';
import { loginUser } from '../api/authAPI';
import type { LoginDTO } from '../types/login';
import type { ApiError } from '../../../api/apiClient';
import styles from './Login.module.css';
import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc"; // Google-ikon

const Login = () => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const loginDto: LoginDTO = { email, password };

        try {
            const response = await loginUser(loginDto);
            dispatch(loginSuccess({
                id: response.id,
                user: response.email,
                hasCompletedOnboarding: response.hasCompletedOnboarding
            }));
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message);
        }
    };

    const handleGoogleLogin = () => {
        // Full redirect till backend OAuth2-endpoint
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className={styles.loginContainer}>
            <LogIn size={27} className={styles.loginIcon} />

            <form onSubmit={handleSubmit}>
                <label className={styles.label}>E-post</label>
                <div className={styles.passwordWrapper}>
                <input
                    type="email"
                    placeholder="username@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                </div>
                <label className={styles.label}>Lösenord</label>
                <div className={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Lösenord"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    {password.length > 0 && (
                        showPassword ? (
                            <EyeOff
                                size={18}
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(false)}
                                aria-label="Dölj lösenord"
                            />
                        ) : (
                            <Eye
                                size={18}
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(true)}
                                aria-label="Visa lösenord"
                            />
                        )
                    )}
                </div>

                <p className={styles.forgotPassword}>Glömt lösenord?</p>

                <div className={styles.errorMessage}>{error}</div>
                <button type="submit">Logga in</button>
            </form>

         <button
  className={styles.googleButton}
  onClick={handleGoogleLogin}
>
  <FcGoogle size={22} style={{ marginRight: "8px" }} />
  Logga in med Google
</button>

            <p className={styles.bottomText}>
                Har du inte ett konto?{' '}
                <Link to="/registrera-dig" className={styles.registerLink}>
                    Registrera dig här
                </Link>
            </p>
        </div>
    );
};

export default Login;
