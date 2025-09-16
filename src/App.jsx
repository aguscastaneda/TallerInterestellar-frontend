import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClienteHome from './components/home/ClienteHome';
import MecanicoHome from './components/home/MecanicoHome';
import JefeHome from './components/home/JefeHome';
import AdminHome from './components/home/AdminHome';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (solo para usuarios no autenticados)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

// Redirección a la home según rol
const RoleHomeRedirect = () => {
  const { roleKey } = useAuth();
  const map = {
    cliente: '/home/cliente',
    mecanico: '/home/mecanico',
    jefe: '/home/jefe',
    admin: '/home/admin'
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
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
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
  );
};

export default App;
