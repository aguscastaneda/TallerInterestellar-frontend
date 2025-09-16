import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = ({ roleBadge, showHistory = false, onHistoryClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <button 
            onClick={() => navigate('/home')}
            className="text-lg font-semibold"
          >
            Taller Interestellar
          </button>
          {roleBadge && (
            <span className="ml-2 text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700">{roleBadge}</span>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-sm text-gray-600 hover:text-gray-900">Ayuda</button>

          <div className="relative group">
            <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
              <span>{user?.email || 'Usuario'}</span>
              <svg className={`h-4 w-4 transition-transform group-hover:rotate-180`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                Configuración
              </button>
              {showHistory && (
                <button 
                  onClick={onHistoryClick}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Historial
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;


