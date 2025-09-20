import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import NavBar from '../NavBar';
import { useAuth } from '../../contexts/AuthContext';
import { useConfig } from '../../contexts/ConfigContext';
import { clientRepairsService, paymentsService } from '../../services/api';
import { Button, Card, CardContent, Badge, SegmentedControl } from '../ui';
import { Car, Wrench, Clock, CheckCircle, AlertCircle, DollarSign, Calendar, User, Settings, Eye, X, CreditCard } from 'lucide-react';

const ClientRepairs = () => {
  const { user } = useAuth();
  const { config, translateServiceRequestStatus } = useConfig();
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]); // Para mantener todos los autos
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const clientId = user?.client?.id;

  const handlePayment = async (repair) => {
    if (!user?.client?.id || !repair.id) {
      toast.error('Error: datos de usuario o reparación no disponibles');
      return;
    }

    try {
      console.log('Iniciando pago para reparación:', repair.id, 'con costo:', repair.cost);
      
      const response = await paymentsService.createMercadoPagoPreference(repair.id, user.client.id);
      
      if (response.data.success) {
        const { sandboxInitPoint, initPoint, simulation } = response.data.data;
        // Usar sandbox para testing, init_point para producción
        const paymentUrl = sandboxInitPoint || initPoint;
        
        if (paymentUrl) {
          if (simulation) {
            // Para simulación, redirigir directamente
            toast.info('Modo simulación: MercadoPago no configurado');
            window.location.href = paymentUrl;
          } else {
            // Redirigir a MercadoPago real
            window.open(paymentUrl, '_blank');
            toast.success('Redirigiendo a MercadoPago...');
          }
        } else {
          toast.error('Error al obtener URL de pago');
        }
      }
    } catch (error) {
      console.error('Error al crear preferencia de pago:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.data?.error === 'MERCADOPAGO_NOT_CONFIGURED') {
        toast.error('El sistema de pagos no está configurado. Contacte al administrador.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al procesar el pago. Intente nuevamente.');
      }
    }
  };

  const loadRepairs = async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      const response = await clientRepairsService.getRepairs(clientId);
      setAllCars(response.data.data.cars); // Guardar todos los autos
      setCars(response.data.data.cars); // Mostrar todos inicialmente
    } catch (error) {
      console.error('Error cargando arreglos:', error);
      toast.error('Error cargando arreglos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (statusId) => {
    setSelectedStatus(statusId);
    if (statusId === 'all') {
      setCars(allCars); // Usar todos los autos guardados
    } else {
      // Filtrar localmente en lugar de hacer otra petición
      const filteredCars = allCars.filter(car => car.statusId === statusId);
      setCars(filteredCars);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, [clientId]);

  // Manejar parámetros de retorno de MercadoPago
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const isSimulation = urlParams.get('simulation');
    
    if (paymentStatus) {
      switch (paymentStatus) {
        case 'success':
          if (isSimulation) {
            toast.success('Pago simulado exitoso (MercadoPago no configurado)');
          } else {
            toast.success('Pago procesado exitosamente');
          }
          break;
        case 'failure':
          toast.error('El pago no pudo ser procesado');
          break;
        case 'pending':
          toast.info('Tu pago está siendo procesado');
          break;
      }
      
      // Limpiar los parámetros de la URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);


  const getStatusCount = (statusId) => {
    if (statusId === 'all') {
      return allCars.length;
    }
    return allCars.filter(car => car.statusId === statusId).length;
  };

  const getStatusIcon = (statusId) => {
    if (statusId === 1) return <Car className="h-4 w-4" />; // Entrada
    if (statusId === 2) return <Clock className="h-4 w-4" />; // Pendiente
    if (statusId === 3) return <Eye className="h-4 w-4" />; // En revisión
    if (statusId === 4) return <X className="h-4 w-4" />; // Rechazado
    if (statusId === 5) return <Wrench className="h-4 w-4" />; // En reparación
    if (statusId === 6) return <CheckCircle className="h-4 w-4" />; // Finalizado
    if (statusId === 7) return <CheckCircle className="h-4 w-4" />; // Entregado
    if (statusId === 8) return <X className="h-4 w-4" />; // Cancelado
    return <AlertCircle className="h-4 w-4" />;
  };

  const getStatusVariant = (statusId) => {
    if (statusId === 1) return 'neutral'; // Entrada
    if (statusId === 2) return 'warning'; // Pendiente
    if (statusId === 3) return 'info'; // En revisión
    if (statusId === 4) return 'danger'; // Rechazado
    if (statusId === 5) return 'info'; // En reparación
    if (statusId === 6) return 'success'; // Finalizado
    if (statusId === 7) return 'success'; // Entregado
    if (statusId === 8) return 'danger'; // Cancelado
    return 'neutral';
  };

  const getStatusLabel = (statusId) => {
    const status = config.carStatuses?.find(s => s.id === statusId);
    return status?.name || 'Sin estado';
  };

  const tabOptions = [
    { 
      value: 'all', 
      label: 'Todos', 
      icon: <Car className="h-4 w-4" />,
      count: getStatusCount('all')
    },
    ...(config.carStatuses?.map(status => ({
      value: status.id,
      label: status.name,
      icon: getStatusIcon(status.id),
      count: getStatusCount(status.id)
    })) || [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar roleBadge={true} showHistory={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar roleBadge={true} showHistory={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Arreglos
          </h1>
          <p className="text-gray-600">
            Gestiona y sigue el estado de tus reparaciones vehiculares
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-8 px-4 sm:px-0">
          <SegmentedControl
            options={tabOptions}
            value={selectedStatus}
            onChange={handleStatusFilter}
            size="lg"
          />
        </div>

        {/* Lista de vehículos */}
        <div className="space-y-6">
          {cars.filter(car => selectedStatus === 'all' || car.statusId === selectedStatus).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedStatus === 'all' 
                    ? 'No tienes vehículos registrados' 
                    : 'No hay vehículos en este estado'
                  }
                </h3>
                <p className="text-gray-600">
                  {selectedStatus === 'all' 
                    ? 'Registra tu primer vehículo para comenzar a solicitar servicios'
                    : 'No hay vehículos en el estado seleccionado'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            cars.filter(car => selectedStatus === 'all' || car.statusId === selectedStatus).map((car) => (
              <Card key={car.id} className="card-hover">
                <CardContent className="p-6">
                  {/* Header del vehículo */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <Car className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {car.licensePlate}
                          </h3>
                          <Badge 
                            variant={getStatusVariant(car.statusId)}
                            size="md"
                          >
                            {getStatusIcon(car.statusId)}
                            <span className="ml-1">{getStatusLabel(car.statusId)}</span>
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          {car.brand} {car.model}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Registrado el {new Date(car.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Información básica */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Car className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-500">Vehículo</p>
                        <p className="text-gray-900 truncate">{car.brand} {car.model}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-500">Mecánico</p>
                        <p className="text-gray-900 truncate">
                          {car.mechanic?.user 
                            ? `${car.mechanic.user.name} ${car.mechanic.user.lastName}`
                            : 'No asignado'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 min-w-0 sm:col-span-2 lg:col-span-1">
                      <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <Settings className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-500">Prioridad</p>
                        <p className="text-gray-900 truncate">{car.priority}</p>
                      </div>
                    </div>
                  </div>

                  {/* Descripción del problema */}
                  {car.description && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                        Descripción del problema
                      </h4>
                      <p className="text-gray-700">{car.description}</p>
                    </div>
                  )}

                  {/* Reparaciones realizadas */}
                  {car.repairs && car.repairs.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Reparaciones realizadas ({car.repairs.length})
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {car.repairs.map((repair, index) => (
                          <Card key={index} className="bg-green-50 border-green-200">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                                <h5 className="font-medium text-gray-900">Reparación #{index + 1}</h5>
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="font-bold text-green-600 text-lg">
                                      ${repair.cost}
                                    </span>
                                  </div>
                                  {/* Botón Pagar para reparaciones finalizadas */}
                                  {car.statusId === 6 && ( // 6 = Finalizado
                                    <Button
                                      onClick={() => handlePayment(repair)}
                                      size="sm"
                                      leftIcon={<CreditCard className="h-4 w-4" />}
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      Pagar
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-3 line-clamp-3">{repair.description}</p>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0">
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{repair.mechanic?.user?.name} {repair.mechanic?.user?.lastName}</span>
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                  {new Date(repair.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Solicitudes de servicio */}
                  {car.serviceRequests && car.serviceRequests.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Solicitudes de servicio ({car.serviceRequests.length})
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {car.serviceRequests.map((request, index) => (
                          <Card key={index} className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                                <h5 className="font-medium text-gray-900">Solicitud #{index + 1}</h5>
                                <Badge 
                                  variant={
                                    request.status === 'PENDING' ? 'warning' :
                                    request.status === 'ASSIGNED' ? 'info' :
                                    request.status === 'IN_PROGRESS' ? 'info' :
                                    request.status === 'COMPLETED' ? 'success' : 'neutral'
                                  }
                                  size="sm"
                                >
                                  {translateServiceRequestStatus(request.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-3 line-clamp-3">{request.description}</p>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0">
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">
                                    {request.assignedMechanic?.user 
                                      ? `${request.assignedMechanic.user.name} ${request.assignedMechanic.user.lastName}`
                                      : 'Pendiente de asignación'
                                    }
                                  </span>
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mensaje si no hay reparaciones ni solicitudes */}
                  {(!car.repairs || car.repairs.length === 0) && (!car.serviceRequests || car.serviceRequests.length === 0) && (
                    <div className="text-center py-6 text-gray-500">
                      <Wrench className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No hay reparaciones o solicitudes registradas para este vehículo</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientRepairs;
