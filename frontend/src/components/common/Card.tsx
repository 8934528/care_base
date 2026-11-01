import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = ''
}) => {
  return (
    <div className={`card cb-card ${className}`}>
      {(title || actions) && (
        <div className="cb-card-header d-flex align-items-center justify-content-between">
          <div>
            {typeof title === 'string' ? <h3 className="cb-card-title m-0">{title}</h3> : title}
            {subtitle && <p className="cb-card-subtitle m-0 text-muted">{subtitle}</p>}
          </div>
          {actions && <div className="cb-card-actions">{actions}</div>}
        </div>
      )}
      <div className={`cb-card-body ${bodyClassName}`}>{children}</div>
    </div>
  );
};

