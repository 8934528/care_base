import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cb-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`cb-modal cb-modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="cb-modal-header d-flex align-items-center justify-content-between">
          <h4 id="modal-title" className="cb-modal-title m-0">{title}</h4>
          <button
            type="button"
            className="cb-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="cb-modal-body">{children}</div>
        {footer && <div className="cb-modal-footer d-flex justify-content-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

