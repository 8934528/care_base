import React from 'react';

export type StatusVariant =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'deactivated'
  | 'locked'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'waiting'
  | 'in-progress'
  | 'in-consultation'
  | 'emergency'
  | 'priority'
  | 'normal'
  | 'info';

interface BadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, className = '' }) => {
  const getVariant = (val: string): StatusVariant => {
    const s = val.toLowerCase();
    if (s.includes('active')) return 'active';
    if (s.includes('inactive')) return 'inactive';
    if (s.includes('suspend')) return 'suspended';
    if (s.includes('deactivat')) return 'deactivated';
    if (s.includes('lock')) return 'locked';
    if (s.includes('pend')) return 'pending';
    if (s.includes('complet')) return 'completed';
    if (s.includes('cancel') || s.includes('miss')) return 'cancelled';
    if (s.includes('wait')) return 'waiting';
    if (s.includes('consult') || s.includes('progress')) return 'in-consultation';
    if (s.includes('emerg')) return 'emergency';
    if (s.includes('prior') || s.includes('urgent')) return 'priority';
    if (s.includes('normal') || s.includes('schedul')) return 'normal';
    return 'info';
  };

  const v = variant || getVariant(status);

  return (
    <span className={`cb-badge cb-badge-${v} ${className}`}>
      {status}
    </span>
  );
};

