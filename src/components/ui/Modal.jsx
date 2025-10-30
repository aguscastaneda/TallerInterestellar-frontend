import { forwardRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

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
    sm: 'max-w-sm w-full',
    md: 'max-w-lg w-full',
    lg: 'max-w-2xl w-full',
    xl: 'max-w-4xl w-full',
    full: 'max-w-full w-full mx-0 sm:mx-4',
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
Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  className: PropTypes.string,
};

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
      <div className="flex-1 min-w-0">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';
ModalHeader.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

const ModalTitle = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <h2
      ref={ref}
      className={clsx('text-xl font-semibold text-gray-900 truncate', className)}
      {...props}
    >
      {children}
    </h2>
  );
});

ModalTitle.displayName = 'ModalTitle';
ModalTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const ModalDescription = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={clsx('text-sm text-gray-600 mt-1 break-words', className)}
      {...props}
    >
      {children}
    </p>
  );
});

ModalDescription.displayName = 'ModalDescription';
ModalDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const ModalContent = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('p-6 flex-1 overflow-y-auto', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ModalContent.displayName = 'ModalContent';
ModalContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const ModalFooter = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';
ModalFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter };