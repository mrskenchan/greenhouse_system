import React from 'react';
import './Card.css'; 

const Card = ({ children, className = '', onClick }) => {
  return (
    <div className={`common-card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;