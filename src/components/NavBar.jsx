import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Badge } from './ui';
import {
  Menu,
  X,
  ChevronDown,
  History,
  LogOut,
  HelpCircle,
  User,
  Wrench,
  Shield,
  ClipboardList,
  Settings
} from 'lucide-react';

const NavBar = ({ roleBadge, showHistory = false, onHistoryClick }) => {
  const { user, logout, roleKey } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: Shield,
      jefe: Wrench,
      mecanico: Wrench,
      cliente: User,
      recepcionista: ClipboardList,
    };
    const Icon = icons[role] || User;
    return <Icon className="h-4 w-4" />;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'primary',
      jefe: 'warning',
      mecanico: 'info',
      cliente: 'success',
      recepcionista: 'secondary',
    };
    return colors[role] || 'neutral';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      jefe: 'Jefe de Mecánicos',
      mecanico: 'Mecánico',
      cliente: 'Cliente',
      recepcionista: 'Recepcionista',
    };
    return labels[role] || 'Usuario';
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-soft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y marca */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-8 rounded-lg"
              />
            </div>
            <button
              onClick={() => navigate('/home')}
              className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors duration-200"
            >
              Taller Interestellar
            </button>
            {roleBadge && (
              <Badge
                variant={getRoleColor(roleKey)}
                size="sm"
                className="ml-2"
              >
                {getRoleIcon(roleKey)}
                <span className="ml-1">{getRoleLabel(roleKey)}</span>
              </Badge>
            )}
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (roleKey === 'jefe') {
                  navigate('/home/jefe/help');
                } else if (roleKey === 'cliente') {
                  navigate('/home/client/help');
                } else if (roleKey === 'mecanico') {
                  navigate('/home/mecanico/help');
                } else if (roleKey === 'admin') {
                  navigate('/home/admin/help');
                } else if (roleKey === 'recepcionista') {
                  navigate('/home/recepcionista/help');
                } else {
                  // Navegar a ayuda general
                }
              }}
              leftIcon={<HelpCircle className="h-4 w-4" />}
            >
              Ayuda
            </Button>

            {/* Menú de perfil */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                rightIcon={<ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="hidden lg:block">{user?.email || 'Usuario'}</span>
                </div>
              </Button>

              {/* Dropdown del perfil */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-gray-100 py-2 z-50 animate-slide-down">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    {roleKey === 'cliente' && (
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/configuracion');
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Configuración
                      </button>
                    )}

                    {showHistory && (
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onHistoryClick?.();
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <History className="h-4 w-4 mr-3" />
                        Historial
                      </button>
                    )}

                    {roleKey === 'admin' && (
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/home/admin/historial');
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <History className="h-4 w-4 mr-3" />
                        Historial
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-down">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (roleKey === 'jefe') {
                    navigate('/home/jefe/help');
                  } else if (roleKey === 'cliente') {
                    navigate('/home/client/help');
                  } else if (roleKey === 'mecanico') {
                    navigate('/home/mecanico/help');
                  } else if (roleKey === 'admin') {
                    navigate('/home/admin/help');
                  } else if (roleKey === 'recepcionista') {
                    navigate('/home/recepcionista/help');
                  } else {
                    // Navegar a ayuda general
                  }
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
              >
                <HelpCircle className="h-4 w-4 mr-3" />
                Ayuda
              </button>

              {roleKey === 'cliente' && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/configuracion');
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Configuración
                </button>
              )}

              {showHistory && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onHistoryClick?.();
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  <History className="h-4 w-4 mr-3" />
                  Historial
                </button>
              )}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;


