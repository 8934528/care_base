import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions
}) => {
  return (
    <div className="cb-page-header d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div>
        <div className="d-flex align-items-center gap-2">
          <h2 className="cb-page-title m-0">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="cb-page-subtitle text-muted m-0 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="cb-page-actions d-flex align-items-center gap-2">{actions}</div>}
    </div>
  );
};

