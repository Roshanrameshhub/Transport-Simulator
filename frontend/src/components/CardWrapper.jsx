import React from 'react';

const CardWrapper = ({ children, title, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ${className}`}>
      {title && <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>}
      {children}
    </div>
  );
};

export default CardWrapper;
