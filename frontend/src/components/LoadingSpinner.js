import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = '#4299e1' }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  return (
    <div className="spinner-container">
      <div 
        className={`spinner ${sizeClass}`}
        style={{ borderTopColor: color }}
      />
    </div>
  );
};

export default LoadingSpinner; 