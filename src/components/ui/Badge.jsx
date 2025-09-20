import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Badge = forwardRef(({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  ...props
}, ref) => {
  const baseClasses = 'badge';
  
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    neutral: 'badge-neutral',
    primary: 'bg-red-100 text-red-800',
    secondary: 'bg-metallic-100 text-metallic-800',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };
  
  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
  
  return (
    <span
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
