import { forwardRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

const Modal = forwardRef(({
  isOpen = false,
  onClose,
  children,
  size = 'md',
  className,
  ...props
}, ref) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={ref}
        className={clsx(
          'modal-content',
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

const ModalHeader = forwardRef(({
  children,
  onClose,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('flex items-center justify-between p-6 border-b border-gray-200', className)}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

const ModalTitle = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <h2
      ref={ref}
      className={clsx('text-xl font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </h2>
  );
});

ModalTitle.displayName = 'ModalTitle';

const ModalDescription = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={clsx('text-sm text-gray-600 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
});

ModalDescription.displayName = 'ModalDescription';

const ModalContent = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ModalContent.displayName = 'ModalContent';

const ModalFooter = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter };
