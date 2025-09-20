import { forwardRef } from 'react';
import { clsx } from 'clsx';

const SegmentedControl = forwardRef(({
  options = [],
  value,
  onChange,
  size = 'md',
  className,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-3 py-2',
    lg: 'px-4 py-3',
  };

  const getStatusColors = (option, isActive) => {
    // Colores específicos para estados de vehículos con estilo elegante
    if (option.value === 1) return { // Entrada
      active: 'bg-gray-100 text-gray-900 border-gray-300 shadow-md',
      inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    };
    if (option.value === 2) return { // Pendiente
      active: 'bg-yellow-100 text-yellow-900 border-yellow-300 shadow-md',
      inactive: 'text-yellow-700 hover:text-yellow-900 hover:bg-yellow-50'
    };
    if (option.value === 3) return { // En revisión
      active: 'bg-blue-100 text-blue-900 border-blue-300 shadow-md',
      inactive: 'text-blue-700 hover:text-blue-900 hover:bg-blue-50'
    };
    if (option.value === 4) return { // Rechazado
      active: 'bg-red-100 text-red-900 border-red-300 shadow-md',
      inactive: 'text-red-700 hover:text-red-900 hover:bg-red-50'
    };
    if (option.value === 5) return { // En reparación
      active: 'bg-purple-100 text-purple-900 border-purple-300 shadow-md',
      inactive: 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
    };
    if (option.value === 6) return { // Finalizado
      active: 'bg-green-100 text-green-900 border-green-300 shadow-md',
      inactive: 'text-green-700 hover:text-green-900 hover:bg-green-50'
    };
    if (option.value === 7) return { // Entregado
      active: 'bg-indigo-100 text-indigo-900 border-indigo-300 shadow-md',
      inactive: 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50'
    };
    if (option.value === 8) return { // Cancelado
      active: 'bg-orange-100 text-orange-900 border-orange-300 shadow-md',
      inactive: 'text-orange-700 hover:text-orange-900 hover:bg-orange-50'
    };
    // Default para "Todos"
    return {
      active: 'bg-red-100 text-red-900 border-red-300 shadow-md',
      inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    };
  };

  // Dividir las opciones en dos filas: 5 arriba, 4 abajo
  const topRowOptions = options.slice(0, 5);
  const bottomRowOptions = options.slice(5);

  return (
    <div
      ref={ref}
      className={clsx(
        'w-full max-w-6xl mx-auto space-y-3',
        className
      )}
      {...props}
    >
      {/* Fila superior - 5 estados */}
      <div className="flex justify-center">
        <div className={clsx(
          'flex bg-white rounded-2xl border-2 border-gray-200 shadow-lg backdrop-blur-sm',
          sizeClasses[size]
        )}>
          {topRowOptions.map((option, index) => {
            const isActive = value === option.value;
            const colors = getStatusColors(option, isActive);
            const isFirst = index === 0;
            const isLast = index === topRowOptions.length - 1;
            
            return (
              <button
                key={option.value}
                onClick={() => onChange?.(option.value)}
                className={clsx(
                  'relative flex items-center justify-center font-semibold transition-all duration-500 ease-in-out border-r-2 border-gray-200 last:border-r-0 group min-w-0 whitespace-nowrap',
                  buttonSizeClasses[size],
                  {
                    [colors.active]: isActive,
                    [colors.inactive]: !isActive,
                  },
                  {
                    'rounded-l-2xl': isFirst,
                    'rounded-r-2xl': isLast,
                  },
                  'hover:scale-[1.02] active:scale-[0.98]',
                  'min-w-[140px] sm:min-w-[160px] md:min-w-[180px]'
                )}
              >
                {/* Indicador de estado activo con gradiente elegante */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-2xl pointer-events-none" />
                )}
                
                <div className="flex items-center space-x-2 relative z-10 min-w-0 flex-1 px-3">
                  {option.icon && (
                    <span className={clsx(
                      'transition-all duration-500 ease-in-out flex-shrink-0',
                      isActive ? 'scale-110 rotate-2' : 'scale-100 rotate-0',
                      { 'opacity-70 group-hover:opacity-100': !isActive }
                    )}>
                      {option.icon}
                    </span>
                  )}
                  <span className="truncate font-medium tracking-wide text-sm">
                    {option.label}
                  </span>
                  {option.count !== undefined && (
                    <span className={clsx(
                      'px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-500 ease-in-out flex-shrink-0',
                      isActive 
                        ? 'bg-white/90 text-gray-800 shadow-lg ring-1 ring-white/50' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    )}>
                      {option.count}
                    </span>
                  )}
                </div>
                
                {/* Efecto de hover elegante */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out pointer-events-none rounded-2xl" />
                )}
                
                {/* Borde sutil para el estado activo */}
                {isActive && (
                  <div className="absolute inset-0 ring-2 ring-white/50 rounded-2xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fila inferior - 4 estados */}
      {bottomRowOptions.length > 0 && (
        <div className="flex justify-center">
          <div className={clsx(
            'flex bg-white rounded-2xl border-2 border-gray-200 shadow-lg backdrop-blur-sm',
            sizeClasses[size]
          )}>
            {bottomRowOptions.map((option, index) => {
              const isActive = value === option.value;
              const colors = getStatusColors(option, isActive);
              const isFirst = index === 0;
              const isLast = index === bottomRowOptions.length - 1;
              
              return (
                <button
                  key={option.value}
                  onClick={() => onChange?.(option.value)}
                  className={clsx(
                    'relative flex items-center justify-center font-semibold transition-all duration-500 ease-in-out border-r-2 border-gray-200 last:border-r-0 group min-w-0 whitespace-nowrap',
                    buttonSizeClasses[size],
                    {
                      [colors.active]: isActive,
                      [colors.inactive]: !isActive,
                    },
                    {
                      'rounded-l-2xl': isFirst,
                      'rounded-r-2xl': isLast,
                    },
                    'hover:scale-[1.02] active:scale-[0.98]',
                    'min-w-[140px] sm:min-w-[160px] md:min-w-[180px]'
                  )}
                >
                  {/* Indicador de estado activo con gradiente elegante */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-2xl pointer-events-none" />
                  )}
                  
                  <div className="flex items-center space-x-2 relative z-10 min-w-0 flex-1 px-3">
                    {option.icon && (
                      <span className={clsx(
                        'transition-all duration-500 ease-in-out flex-shrink-0',
                        isActive ? 'scale-110 rotate-2' : 'scale-100 rotate-0',
                        { 'opacity-70 group-hover:opacity-100': !isActive }
                      )}>
                        {option.icon}
                      </span>
                    )}
                    <span className="truncate font-medium tracking-wide text-sm">
                      {option.label}
                    </span>
                    {option.count !== undefined && (
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-500 ease-in-out flex-shrink-0',
                        isActive 
                          ? 'bg-white/90 text-gray-800 shadow-lg ring-1 ring-white/50' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      )}>
                        {option.count}
                      </span>
                    )}
                  </div>
                  
                  {/* Efecto de hover elegante */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out pointer-events-none rounded-2xl" />
                  )}
                  
                  {/* Borde sutil para el estado activo */}
                  {isActive && (
                    <div className="absolute inset-0 ring-2 ring-white/50 rounded-2xl pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;
