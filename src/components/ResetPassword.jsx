import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

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

  useEffect(() => {
    if (!token) {
      toast.error('Token inválido');
      navigate('/login');
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    setError("");

    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: data.password
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswordReset(true);
        toast.success('Contraseña restablecida exitosamente');

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(result.message || 'Error al restablecer la contraseña');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);

      setError('Error de conexión');
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-strong">
          <CardHeader className="text-center">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 border-red-100 flex items-center justify-center mb-4">
              <div className="p-1 rounded-xl bg-white shadow-inner">
                {passwordReset ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-lg" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {passwordReset ? '¡Contraseña Restablecida!' : 'Nueva Contraseña'}
            </CardTitle>
            <CardDescription>
              {passwordReset
                ? 'Tu contraseña ha sido actualizada exitosamente'
                : 'Ingresa tu nueva contraseña'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!passwordReset ? (
              <form onSubmit={handleSubmit(onSubmit)} onKeyPress={handleKeyPress} className="space-y-6">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-pulse">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña
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
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <Input
                    {...register('confirmPassword', {
                      required: 'Confirma tu contraseña',
                      validate: value => value === password || 'Las contraseñas no coinciden'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="••••••••"
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-600 hover:text-gray-800 transition-colors duration-200 focus:outline-none p-1 rounded"
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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

                {/* Longitud de contrasenia */}
                {password && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Fortaleza de la contraseña:</div>
                    <div className="flex space-x-1">
                      <div className={`h-2 flex-1 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-2 flex-1 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-2 flex-1 rounded ${/(?=.*[a-z])(?=.*[A-Z])/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-2 flex-1 rounded ${/(?=.*\d)/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <div className="text-center">
              <button
                onClick={handleGoToLogin}
                className="inline-flex items-center space-x-2 text-sm text-red-600 hover:text-red-500 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{passwordReset ? 'Ir al login' : 'Volver al login'}</span>
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;