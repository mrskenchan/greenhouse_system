import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setError('');
    console.log("Intentando ingresar con:", email); // 1. Ver si llega el dato
    await login(email, password);
    console.log("Login exitoso");
    navigate('/');
  } catch (err) {
    // 2. IMPRIMIR EL ERROR REAL EN CONSOLA
    console.error("🔥 ERROR FIREBASE:", err.code, err.message);
    
    // 3. MOSTRAR EL CÓDIGO DE ERROR EN PANTALLA
    setError(`Error: ${err.code} - ${err.message}`);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🌿 Acceso Invernadero</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;