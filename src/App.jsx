import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { RefreshProvider } from './contexts/RefreshContext';
import { Toaster } from 'react-hot-toast';
import { setNavigateFunction } from './services/api';
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
import AdminCharts from './components/home/AdminCharts';
import ClientRepairs from './components/home/ClientRepairs';
import MechanicRepairs from './components/home/MechanicRepairs';
import UserConfiguration from './components/UserConfiguration';
import AcceptBudget from './components/home/AcceptBudget';
import RejectBudget from './components/home/RejectBudget';

const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, loading, roleKey } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(roleKey)) {
    const roleRedirectMap = {
      cliente: '/home/cliente',
      mecanico: '/home/mecanico',
      jefe: '/home/jefe',
      admin: '/home/admin',
      recepcionista: '/home/recepcionista'
    };
    const redirectPath = roleRedirectMap[roleKey] || '/home';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

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

const NavigateSetter = () => {
  const navigate = useNavigate();

  setNavigateFunction(navigate);

  return null;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
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
          <ProtectedRoute allowedRoles={['cliente']}>
            <ClienteHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/client/help"
        element={
          <ProtectedRoute allowedRoles={['cliente']}>
            <ClientHelp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/jefe/help"
        element={
          <ProtectedRoute allowedRoles={['jefe']}>
            <JefeHelp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/mecanico/help"
        element={
          <ProtectedRoute allowedRoles={['mecanico', 'jefe', 'admin']}>
            <MechanicHelp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/admin/help"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminHelp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/recepcionista/help"
        element={
          <ProtectedRoute allowedRoles={['recepcionista', 'admin']}>
            <ReceptionistHelp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/admin/historial"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminHistorial />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/client/repairs"
        element={
          <ProtectedRoute allowedRoles={['cliente']}>
            <ClientHelp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/mecanico/mis-arreglos"
        element={
          <ProtectedRoute allowedRoles={['mecanico', 'jefe', 'admin']}>
            <MechanicRepairs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/mecanico"
        element={
          <ProtectedRoute allowedRoles={['mecanico', 'jefe', 'admin']}>
            <MecanicoHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/jefe"
        element={
          <ProtectedRoute allowedRoles={['jefe', 'admin']}>
            <JefeHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/admin/chart"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCharts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/recepcionista"
        element={
          <ProtectedRoute allowedRoles={['recepcionista', 'admin']}>
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
      <Route
        path="/accept-budget"
        element={
          <ProtectedRoute allowedRoles={['cliente']}>
            <AcceptBudget />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reject-budget"
        element={
          <ProtectedRoute allowedRoles={['cliente']}>
            <RejectBudget />
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
        <RefreshProvider>
          <Router>
            <NavigateSetter />
            <ScrollToTop />
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
        </RefreshProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;