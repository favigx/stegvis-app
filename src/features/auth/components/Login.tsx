import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSucess } from '../../../redux/slices/authSlice';
import { loginUser } from '../api/authAPI';
import type { LoginDTO } from '../types/login';
import type { ApiError } from '../../../api/apiClient';
import styles from './Login.module.css';
import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";

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
            dispatch(loginSucess({
                id: response.id,
                user: response.email,
                hasCompletedOnboarding: response.hasCompletedOnboarding
            }));
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message);
        }
    };

    return (
        <div className={styles.loginContainer}>
             <LogIn size={27} className={styles.loginIcon} />
            <form onSubmit={handleSubmit}>
                <label className={styles.label}>E-post</label>
                <input
                    type="email"
                    placeholder="username@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

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

            <p className={styles.bottomText}>
                Har du inte ett konto?{' '}
                <Link to="/register" className={styles.registerLink}>
                    Registrera dig här
                </Link>
            </p>
        </div>
    );
}

export default Login;
