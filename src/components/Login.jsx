import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, checkAuth, roleKey } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        toast.success('¡Login exitoso!');

        await checkAuth();
        const map = { cliente: '/home/cliente', mecanico: '/home/mecanico', jefe: '/home/jefe', admin: '/home/admin' };
        setTimeout(() => {
          navigate(map[roleKey] || '/home');
        }, 1000);
      } else {

        setError(result.message || 'Error en el login');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error en login:', error);

      setError('Error en el servidor');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Panel izquierdo - Información */}
          <div className="hidden lg:block">
            <div className="text-center">
              <div className="mx-auto h-28 w-28 rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border-2 border-red-100 flex items-center justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-2xl bg-white shadow-inner">
                  <img src="/logo.png" alt="Logo" className="h-16 w-16 rounded-xl" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Taller Interestellar
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Sistema de Gestión Mecánica Moderno
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span>Gestión completa de vehículos</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <span>Seguimiento en tiempo real</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span>Comunicación directa con mecánicos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-strong">
              <CardHeader className="text-center">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 border-red-100 flex items-center justify-center mb-4 lg:hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="p-1 rounded-xl bg-white shadow-inner">
                    <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-lg" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription>
                  Accede a tu cuenta para gestionar tu taller
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Mostrar errores aquí */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-pulse">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        }
                      })}
                      type="email"
                      id="email"
                      placeholder="tu@email.com"
                      error={!!errors.email}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <Input
                      {...register('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                          value: 6,
                          message: 'La contraseña debe tener al menos 6 caracteres'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="••••••••"
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => {
                            console.log('Toggle clicked, current state:', showPassword);
                            setShowPassword(!showPassword);
                          }}
                          className="text-gray-600 hover:text-gray-800 transition-colors duration-200 focus:outline-none p-1 rounded"
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                      error={!!errors.password}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                    className="w-full"
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex-col space-y-4">
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200 font-medium mb-3"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <button
                      onClick={() => navigate('/register')}
                      className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;