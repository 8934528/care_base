import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'bi-inbox',
  title,
  message,
  action
}) => {
  return (
    <div className="cb-empty-state text-center py-5">
      <div className="cb-empty-icon mb-3">
        <i className={`bi ${icon}`}></i>
      </div>
      <h5 className="cb-empty-title mb-1">{title}</h5>
      {message && <p className="cb-empty-message text-muted mb-3">{message}</p>}
      {action && <div className="cb-empty-action">{action}</div>}
    </div>
  );
};

