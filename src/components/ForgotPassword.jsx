import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { buildBaseURL } from '../services/api';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
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
      const response = await fetch(`${buildBaseURL()}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailSent(true);
        toast.success('Email enviado correctamente');
        setIsLoading(false);
      } else {

        setError(result.message || 'Error al enviar el email');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-strong">
          <CardHeader className="text-center">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 border-red-100 flex items-center justify-center mb-4">
              <div className="p-1 rounded-xl bg-white shadow-inner">
                <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-lg" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {emailSent ? '¡Email Enviado!' : '¿Olvidaste tu contraseña?'}
            </CardTitle>
            <CardDescription>
              {emailSent
                ? `Hemos enviado un enlace de recuperación a ${getValues('email')}`
                : 'Ingresa tu email para recibir un enlace de recuperación'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit(onSubmit)} onKeyPress={handleKeyPress} className="space-y-6">
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

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-pulse">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  className="w-full"
                  size="lg"
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-sm text-gray-500">
                  Si no ves el email, revisa tu carpeta de spam.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center space-x-2 text-sm text-red-600 hover:text-red-500 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al login</span>
              </button>
            </div>

            {emailSent && (
              <Button
                onClick={() => {
                  setEmailSent(false);
                  setIsLoading(false);
                }}
                variant="secondary"
                className="w-full"
              >
                Enviar a otro email
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;