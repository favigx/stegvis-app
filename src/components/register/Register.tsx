import React, { useState } from 'react';
import { registerUser } from '../../api/user/auth'; 
import type { RegisterDTO } from '../../interfaces/user/dto/register';
import { Link, useNavigate } from 'react-router-dom';
import type { ApiError } from '../../api/apiClient';
import styles from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== repeatPassword) {
    setError('Lösenorden matchar inte.');
    return;
  }

  const registerDto: RegisterDTO = { email, password };

  try {
    await registerUser(registerDto);
    navigate('/login');
  } catch (err) {
    const apiError = err as ApiError;
    setError(apiError.message);
  }
};

    return (
      <>
      <h1>Stegvis</h1>
        <div className={styles.registerContainer}>
            <h2>Skapa ett nytt konto</h2>
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
                <input
                    type="password"
                    placeholder="Bekräfta lösenord"
                    value={repeatPassword}
                    onChange={e => setRepeatPassword(e.target.value)}
                    required
                />
                 <div className={styles.errorMessage}>
                {error}
                </div>
                <button type="submit">Gå med</button>
            </form>
             <Link to="/login" className={styles.buttonLink}>
  Har du redan ett konto? 
</Link>
        </div>
        </>
    );
}

export default Register;