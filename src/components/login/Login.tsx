import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSucess } from '../../redux/slices/authSlice';
import { loginUser } from '../../api/user/auth';
import type { LoginDTO } from '../../interfaces/user/dto/login';
import type { ApiError } from '../../api/apiClient';
import styles from './Login.module.css';
import { Link } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

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
        <>
    <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="E-post"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <div className={styles.errorMessage}>
            {error}
            </div>
            <button type="submit">Logga in</button>
        </form>
        <p>-eller-</p>
        <Link to="/register" className={styles.buttonLink}>
  Skapa nytt konto
</Link>
    </div>
    </>
);
}

export default Login