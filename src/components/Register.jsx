import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';
import { toast } from 'react-hot-toast';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui';
import { Eye, EyeOff, User, Mail, Phone, Building, ArrowLeft, ArrowRight } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register: registerUser } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
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

  const password = watch('password');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await registerUser({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        cuil: data.cuil,
        roleId: config.roles.find(r => r.name.toLowerCase() === 'cliente')?.id || 1
      });

      if (result.success) {
        toast.success('¡Usuario registrado exitosamente!');

        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {

        setError(result.message || 'Error en el registro');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error en registro:', error);

      setError('Error en el servidor');
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Panel izquierdo - Información */}
          <div className="hidden lg:block">
            <div className="text-center">
              <div className="mx-auto h-32 w-32 rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border-2 border-red-100 flex items-center justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-2xl bg-white shadow-inner">
                  <img src="/logo.png" alt="Logo" className="h-20 w-20 rounded-xl" />
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
                  <span>Seguimiento en tiempo real de reparaciones</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <span>Comunicación directa con mecánicos</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span>Historial completo de servicios</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Cotizaciones transparentes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className="w-full max-w-lg mx-auto">
            <Card className="shadow-strong">
              <CardHeader className="text-center">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 border-red-100 flex items-center justify-center mb-4 lg:hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="p-1 rounded-xl bg-white shadow-inner">
                    <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-lg" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Crear Cuenta
                </CardTitle>
                <CardDescription>
                  Completa tus datos para registrarte como cliente
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Mostrar errores aquí */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-pulse">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} onKeyPress={handleKeyPress} className="space-y-6">
                  {/* Información Personal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <Input
                        {...register('name', {
                          required: 'El nombre es requerido',
                          minLength: {
                            value: 2,
                            message: 'El nombre debe tener al menos 2 caracteres'
                          }
                        })}
                        type="text"
                        id="name"
                        placeholder="Tu nombre"
                        leftIcon={<User className="h-4 w-4" />}
                        error={!!errors.name}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido
                      </label>
                      <Input
                        {...register('lastName', {
                          required: 'El apellido es requerido',
                          minLength: {
                            value: 2,
                            message: 'El apellido debe tener al menos 2 caracteres'
                          }
                        })}
                        type="text"
                        id="lastName"
                        placeholder="Tu apellido"
                        leftIcon={<User className="h-4 w-4" />}
                        error={!!errors.lastName}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email y Teléfono */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        leftIcon={<Mail className="h-4 w-4" />}
                        error={!!errors.email}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <Input
                        {...register('phone', {
                          required: 'El teléfono es requerido',
                          pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: 'Formato de teléfono inválido'
                          }
                        })}
                        type="tel"
                        id="phone"
                        placeholder="+54 11 1234-5678"
                        leftIcon={<Phone className="h-4 w-4" />}
                        error={!!errors.phone}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* CUIL */}
                  <div>
                    <label htmlFor="cuil" className="block text-sm font-medium text-gray-700 mb-2">
                      CUIL
                    </label>
                    <Input
                      {...register('cuil', {
                        required: 'El CUIL es requerido',
                        pattern: {
                          value: /^[0-9]{2}-[0-9]{8}-[0-9]$/,
                          message: 'Formato de CUIL inválido (XX-XXXXXXXX-X)'
                        }
                      })}
                      type="text"
                      id="cuil"
                      placeholder="20-12345678-9"
                      leftIcon={<Building className="h-4 w-4" />}
                      error={!!errors.cuil}
                    />
                    {errors.cuil && (
                      <p className="mt-1 text-sm text-red-600">{errors.cuil.message}</p>
                    )}
                  </div>

                  {/* Contraseñas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
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

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Contraseña
                      </label>
                      <Input
                        {...register('confirmPassword', {
                          required: 'Confirma tu contraseña',
                          validate: value => value === password || 'Las contraseñas no coinciden'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        placeholder="••••••••"
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                        error={!!errors.confirmPassword}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                    className="w-full"
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex-col space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Inicia sesión aquí</span>
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

export default Register;