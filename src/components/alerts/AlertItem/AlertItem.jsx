import React from 'react';
import Alert from '../../common/Alert/Alert';
import './AlertItem.css';

const AlertItem = ({ alert, onResolve }) => {
 const severity = alert.getSeverity(); // Asume que el modelo Alert tiene getSeverity

 return (
 <Alert type={severity}>
 <div className="alert-content">
 <span className="alert-message">{alert.message}</span>
 <span className="alert-time">{alert.getRelativeTime()}</span>
 </div>
 <button className="btn-resolve" onClick={() => onResolve(alert.id)}>Resolver</button>
 </Alert>
 );
};

export default AlertItem;