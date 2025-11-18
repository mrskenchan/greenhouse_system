import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
    </nav>
  );
};

export default Navbar;
