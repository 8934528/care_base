import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading records...' }) => {
  return (
    <div className="cb-loading-state text-center py-5">
      <div className="spinner-border text-primary mb-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted small m-0">{message}</p>
    </div>
  );
};

