import React, { useState } from 'react';
import { registerUser } from '../api/authAPI'; 
import type { RegisterDTO } from '../types/register';
import { Link, useNavigate } from 'react-router-dom';
import type { ApiError } from '../../../api/apiClient';
import styles from './Register.module.css';
import { UserRoundPlus } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
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

    const registerDto: RegisterDTO = {
      firstname: firstname,
      lastname: lastname, 
      email, 
      password,
    };

    try {
      await registerUser(registerDto);
      navigate('/logga-in');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    }
  };

  return (
    <>
      <h1 className={styles.h1}>Stegvis</h1>
      <div className={styles.registerContainer}>
         <UserRoundPlus className={styles.icon} size={26} />
        <form onSubmit={handleSubmit}>
          <div className={styles.nameFields}>
            <div>
              <label className={styles.label} htmlFor="firstname">Förnamn</label>
              <input
                id="firstname"
                type="text"
                placeholder="Förnamn"
                value={firstname}
                onChange={e => setFirstname(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="lastname">Efternamn</label>
              <input
                id="lastname"
                type="text"
                placeholder="Efternamn"
                value={lastname}
                onChange={e => setLastname(e.target.value)}
                required
              />
            </div>
          </div>

          <label className={styles.label} htmlFor="email">E-post</label>
          <input
            id="email"
            type="email"
            placeholder="E-post"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className={styles.label} htmlFor="password">Lösenord</label>
          <input
            id="password"
            type="password"
            placeholder="Nytt lösenord"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <label className={styles.label} htmlFor="repeatPassword">Bekräfta lösenord</label>
          <input
            id="repeatPassword"
            type="password"
            placeholder="Bekräfta lösenord"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            required
          />

          <div className={styles.errorMessage}>{error}</div>
          <button type="submit">Gå med</button>
        </form>
        <p className={styles.bottomText}>
          Har du redan ett konto? <Link to="/logga-in" className={styles.buttonLink}>Logga in här</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
