import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({
  type = 'text',
  error = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}, ref) => {
  const baseClasses = error ? 'input-error' : 'input-base';
  
  const classes = clsx(
    baseClasses,
    {
      'pl-10': leftIcon,
      'pr-10': rightIcon,
    },
    className
  );
  
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">{leftIcon}</span>
        </div>
      )}
      <input
        ref={ref}
        type={type}
        className={classes}
        {...props}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <span className="text-gray-400">{rightIcon}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
