import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  tooltip?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  tooltip,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) => {
  const titleText = tooltip || label;

  return (
    <button
      type="button"
      className={`cb-icon-btn cb-icon-btn-${variant} cb-icon-btn-${size} ${className}`}
      aria-label={label}
      title={titleText}
      {...props}
    >
      <i className={`bi ${icon}`} aria-hidden="true"></i>
    </button>
  );
};

