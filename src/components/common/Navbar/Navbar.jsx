import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { logout, currentUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🌱 Sistema de Invernadero</h1>
      </div>
      
      <ul className="nav-menu">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendario" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Calendario
          </NavLink>
        </li>
        <li>
          <NavLink to="/sensores" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Sensores
          </NavLink>
        </li>
        <li>
          <NavLink to="/alertas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Alertas
          </NavLink>
        </li>
      </ul>
      {/* Sección de Perfil / Salir */}
      <div className="navbar-profile">
        {currentUser && (
            <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión 🚪
            </button>
        )}
      </div>  
    </nav>
  );
};

export default Navbar;
