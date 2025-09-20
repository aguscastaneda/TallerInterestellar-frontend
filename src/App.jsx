import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ClienteHome from './components/home/ClienteHome';
import MecanicoHome from './components/home/MecanicoHome';
import JefeHome from './components/home/JefeHome';
import AdminHome from './components/home/AdminHome';
import RecepcionistaHome from './components/home/RecepcionistaHome';
import ClientHelp from './components/home/ClientHelp';
import JefeHelp from './components/home/JefeHelp';
import AdminHelp from './components/home/AdminHelp';
import MechanicHelp from './components/home/MechanicHelp';
import ReceptionistHelp from './components/home/ReceptionistHelp';
import AdminHistorial from './components/home/AdminHistorial';
import ClientRepairs from './components/home/ClientRepairs';
import MechanicRepairs from './components/home/MechanicRepairs';
import UserConfiguration from './components/UserConfiguration';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Componente para rutas públicas (redirige si ya está autenticado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Redirección a la home según rol
const RoleHomeRedirect = () => {
  const { roleKey } = useAuth();
  const map = {
    cliente: '/home/cliente',
    mecanico: '/home/mecanico',
    jefe: '/home/jefe',
    admin: '/home/admin',
    recepcionista: '/home/recepcionista'
  };
  const target = map[roleKey] || '/home/cliente';
  return <Navigate to={target} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={<ForgotPassword />} 
      />
      <Route 
        path="/reset-password" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <RoleHomeRedirect />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/home/cliente" 
        element={
          <ProtectedRoute>
            <ClienteHome />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/client/help" 
        element={
          <ProtectedRoute>
            <ClientHelp />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/jefe/help" 
        element={
          <ProtectedRoute>
            <JefeHelp />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/mecanico/help" 
        element={
          <ProtectedRoute>
            <MechanicHelp />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/admin/help" 
        element={
          <ProtectedRoute>
            <AdminHelp />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/recepcionista/help" 
        element={
          <ProtectedRoute>
            <ReceptionistHelp />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/admin/historial" 
        element={
          <ProtectedRoute>
            <AdminHistorial />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/client/repairs" 
        element={
          <ProtectedRoute>
            <ClientRepairs />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/mecanico/mis-arreglos" 
        element={
          <ProtectedRoute>
            <MechanicRepairs />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/mecanico" 
        element={
          <ProtectedRoute>
            <MecanicoHome />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/jefe" 
        element={
          <ProtectedRoute>
            <JefeHome />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/admin" 
        element={
          <ProtectedRoute>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/home/recepcionista" 
        element={
          <ProtectedRoute>
            <RecepcionistaHome />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/configuracion" 
        element={
          <ProtectedRoute>
            <UserConfiguration />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
