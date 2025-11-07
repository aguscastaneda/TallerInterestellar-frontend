import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'} ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-red-600 animate-spin mb-4`} />
      {text && (
        <p className="text-gray-600 text-sm mt-2">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  text: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default LoadingSpinner;

