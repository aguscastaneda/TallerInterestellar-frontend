import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { carStatesService } from '../../services/api';
import { Card, CardContent } from '../ui';
import Button from '../ui/Button';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const RejectBudget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('pending'); 

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const carId = urlParams.get('carId');
    
    if (!carId) {
      toast.error('ID de vehículo no proporcionado');
      navigate('/home/cliente');
      return;
    }
    
    const rejectBudget = async () => {
      try {
        await carStatesService.rejectBudget(carId);
        setStatus('success');
        toast.success('Presupuesto rechazado exitosamente');
      } catch (error) {
        setStatus('error');
        toast.error(error.response?.data?.message || 'Error al rechazar presupuesto');
      }
    };
    
    rejectBudget();
  }, [location, navigate]);

  const handleGoHome = () => {
    navigate('/home/cliente');
  };

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <Loader className="h-12 w-12 text-red-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Procesando</h2>
            <p className="text-gray-600">Rechazando presupuesto, por favor espere...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Presupuesto Rechazado!</h2>
            <p className="text-gray-600 mb-6">
              El presupuesto ha sido rechazado exitosamente. Su vehículo volverá al estado de entrada.
            </p>
            <Button onClick={handleGoHome} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">
            Hubo un error al rechazar el presupuesto. Por favor, intente nuevamente más tarde.
          </p>
          <Button onClick={handleGoHome} className="w-full">
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RejectBudget;