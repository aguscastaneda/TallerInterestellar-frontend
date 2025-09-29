import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import NavBar from '../NavBar';
import { useAuth } from '../../contexts/AuthContext';
import { useConfig } from '../../contexts/ConfigContext';
import { carsService, usersService, requestsService, carStatesService } from '../../services/api';
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Input, Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui';
import { Plus, Car, Wrench, Settings, Eye, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { licensePlateValidator } from '../../utils/licensePlateValidator';
import PropTypes from 'prop-types';

const ClienteHome = () => {
  const { user } = useAuth();
  const { getConstants } = useConfig();
  const [showAdd, setShowAdd] = useState(false);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ licensePlate: '', brand: '', model: '', year: '', kms: '', chassis: '' });
  const [requestOpenId, setRequestOpenId] = useState(null);
  const [detailCarId, setDetailCarId] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [requestForm, setRequestForm] = useState({ description: '', preferredMechanicId: '' });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [carToCancel, setCarToCancel] = useState(null);

  const clientId = user?.client?.id;

  const load = async () => {
    if (!clientId) return;
    try {
      const [carsRes, mechsRes] = await Promise.all([
        carsService.getByClient(clientId),
        usersService.getMechanics()
      ]);
      setCars(carsRes.data.data || []);
      setMechanics((mechsRes.data.data || []).map(m => ({ id: m.id, name: `${m.user.name} ${m.user.lastName}` })));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error cargando datos');
    }
  };

  // Load data on component mount
  useEffect(() => { 
    load(); 
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      load();
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [clientId]);

  const handleCreateCar = async () => {
    if (!clientId) return;
    try {
      const normalizedLicensePlate = licensePlateValidator(form.licensePlate);
      
      const payload = {
        clientId,
        licensePlate: normalizedLicensePlate,
        brand: form.brand,
        model: form.model,
        kms: form.kms ? parseInt(form.kms) : null,
        chassis: form.chassis || null,
        description: null,
        statusId: 1,
        priority: 1
      };
      await carsService.create(payload);
      toast.success('Patente registrada');
      setShowAdd(false);
      setForm({ licensePlate: '', brand: '', model: '', year: '', kms: '', chassis: '' });
      load();
    } catch (error) {
      console.error('Error creating car:', error);
      toast.error(error.message || 'Error al crear');
    }
  };

  const openRequest = (carId) => {
    setRequestOpenId(carId);
    setRequestForm({ description: '', preferredMechanicId: '' });
  };

  const openCancelConfirm = (carId) => {
    setCarToCancel(carId);
    setShowCancelConfirm(true);
  };

  const createRequest = async () => {
    if (!clientId || !requestOpenId) return;
    try {
      await requestsService.create({
        carId: requestOpenId,
        clientId,
        description: requestForm.description,
        preferredMechanicId: requestForm.preferredMechanicId ? parseInt(requestForm.preferredMechanicId) : undefined
      });
      
      // Cambiar estado del auto a "Pendiente"
      const constants = getConstants();
      await carStatesService.transition(requestOpenId, constants.CAR_STATUS.PENDIENTE);
      
      toast.success('Solicitud enviada');
      setRequestOpenId(null);
      // Refrescar completamente los datos
      load();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || 'Error al solicitar');
    }
  };

  const cancelRequest = async () => {
    if (!carToCancel) return;
    
    try {
      // First, find the service request associated with this car
      // We'll need to get all client requests and find the one for this car
      const response = await requestsService.getByClient(clientId);
      const requests = response.data.data || [];
      const requestToCancel = requests.find(req => req.carId === carToCancel && req.status !== 'CANCELLED');
      
      if (requestToCancel) {
        await requestsService.cancelRequest(requestToCancel.id);
        toast.success('Solicitud cancelada');
        // Refrescar completamente los datos
        load();
      } else {
        toast.error('No se encontró una solicitud activa para este vehículo');
      }
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error('Error al cancelar solicitud');
    } finally {
      setShowCancelConfirm(false);
      setCarToCancel(null);
    }
  };

  const getStatusIcon = (statusId) => {
    const constants = getConstants();
    if (statusId === constants.CAR_STATUS.ENTRADA) return <Car className="h-4 w-4" />;
    if (statusId === constants.CAR_STATUS.PENDIENTE) return <Clock className="h-4 w-4" />;
    if (statusId === constants.CAR_STATUS.EN_PROCESO) return <Wrench className="h-4 w-4" />;
    if (statusId === constants.CAR_STATUS.FINALIZADO) return <CheckCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getStatusVariant = (statusId) => {
    const constants = getConstants();
    if (statusId === constants.CAR_STATUS.ENTRADA) return 'neutral';
    if (statusId === constants.CAR_STATUS.PENDIENTE) return 'warning';
    if (statusId === constants.CAR_STATUS.EN_PROCESO) return 'info';
    if (statusId === constants.CAR_STATUS.FINALIZADO) return 'success';
    return 'neutral';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar roleBadge={true} showHistory={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Vehículos
          </h1>
          <p className="text-gray-600">
            Gestiona tus vehículos y solicita servicios de reparación
          </p>
        </div>

        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={() => setShowAdd(!showAdd)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="sm:w-auto"
          >
            Agregar Vehículo
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => window.location.href = '/home/client/repairs'}
            leftIcon={<Settings className="h-4 w-4" />}
            className="sm:w-auto"
          >
            Mis Arreglos
          </Button>
        </div>

        {/* Formulario de agregar vehículo */}
        {showAdd && (
          <Card className="mb-8 animate-slide-down">
            <CardHeader>
              <CardTitle>Agregar Nuevo Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  value={form.licensePlate}
                  onChange={e => setForm({...form, licensePlate: e.target.value})}
                  placeholder="Patente"
                  leftIcon={<Car className="h-4 w-4" />}
                />
                <Input
                  value={form.brand}
                  onChange={e => setForm({...form, brand: e.target.value})}
                  placeholder="Marca"
                />
                <Input
                  value={form.model}
                  onChange={e => setForm({...form, model: e.target.value})}
                  placeholder="Modelo"
                />
                <Input
                  value={form.year}
                  onChange={e => setForm({...form, year: e.target.value})}
                  placeholder="Año"
                  type="number"
                />
                <Input
                  value={form.kms}
                  onChange={e => setForm({...form, kms: e.target.value})}
                  placeholder="Kilómetros"
                  type="number"
                />
                <Input
                  value={form.chassis}
                  onChange={e => setForm({...form, chassis: e.target.value})}
                  placeholder="Número de Chasis"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowAdd(false)}
                leftIcon={<X className="h-4 w-4" />}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateCar}
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Lista de vehículos */}
        <div className="grid gap-6">
          {cars.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes vehículos registrados
                </h3>
                <p className="text-gray-600 mb-6">
                  Agrega tu primer vehículo para comenzar a solicitar servicios
                </p>
                <Button
                  onClick={() => setShowAdd(true)}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Agregar Vehículo
                </Button>
              </CardContent>
            </Card>
          ) : (
            cars.map((car) => (
              <Card key={car.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <Car className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {car.licensePlate}
                          </h3>
                          <Badge 
                            variant={getStatusVariant(car.statusId)}
                            size="sm"
                          >
                            {getStatusIcon(car.statusId)}
                            <span className="ml-1">{car.status?.name || 'Sin estado'}</span>
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          {car.brand} {car.model} {car.year && `(${car.year})`}
                        </p>
                        {car.kms && (
                          <p className="text-sm text-gray-500">
                            {car.kms.toLocaleString()} km
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailCarId(car.id)}
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Ver Detalles
                      </Button>
                      
                      {/* Botón de solicitar mecánico - solo visible si está en estado "Entrada" */}
                      {car.statusId === getConstants().CAR_STATUS.ENTRADA ? (
                        <Button
                          onClick={() => openRequest(car.id)}
                          size="sm"
                          leftIcon={<Wrench className="h-4 w-4" />}
                        >
                          Solicitar Mecánico
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Wrench className="h-4 w-4" />}
                          disabled={true}
                          title="Solo puedes solicitar un mecánico cuando el vehículo está en estado 'Entrada'"
                        >
                          Solicitar Mecánico
                        </Button>
                      )}
                      
                      {/* Botón de cancelar solicitud - solo visible si está en estado "Pendiente" */}
                      {car.statusId === getConstants().CAR_STATUS.PENDIENTE && (
                        <Button
                          onClick={() => openCancelConfirm(car.id)}
                          variant="danger"
                          size="sm"
                          leftIcon={<X className="h-4 w-4" />}
                        >
                          Cancelar Solicitud
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Formulario de solicitud */}
                  {requestOpenId === car.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 animate-slide-down">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Solicitar Servicio de Reparación
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción del problema
                          </label>
                          <textarea
                            value={requestForm.description}
                            onChange={e => setRequestForm({...requestForm, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Describe el problema o servicio que necesitas..."
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mecánico preferido (opcional)
                          </label>
                          <select
                            value={requestForm.preferredMechanicId}
                            onChange={e => setRequestForm({...requestForm, preferredMechanicId: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="">Sin preferencia</option>
                            {mechanics.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="secondary"
                            onClick={() => setRequestOpenId(null)}
                            leftIcon={<X className="h-4 w-4" />}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={createRequest}
                            leftIcon={<CheckCircle className="h-4 w-4" />}
                          >
                            Enviar Solicitud
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal de detalles del vehículo */}
      {detailCarId && (
        <CarDetailModal 
          car={cars.find(c => c.id === detailCarId)} 
          onClose={() => setDetailCarId(null)} 
        />
      )}

      {/* Modal de confirmación de cancelación */}
      <Modal isOpen={showCancelConfirm} onClose={() => setShowCancelConfirm(false)} size="sm">
        <ModalHeader onClose={() => setShowCancelConfirm(false)}>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <ModalTitle>Confirmar Cancelación</ModalTitle>
          </div>
        </ModalHeader>
        
        <ModalContent>
          <p className="text-gray-700">
            ¿Estás seguro de que deseas cancelar esta solicitud? Esta acción no se puede deshacer.
          </p>
        </ModalContent>
        
        <ModalFooter>
          <Button 
            variant="secondary" 
            onClick={() => setShowCancelConfirm(false)}
          >
            No, mantener solicitud
          </Button>
          <Button 
            variant="danger" 
            onClick={cancelRequest}
            leftIcon={<X className="h-4 w-4" />}
          >
            Sí, cancelar solicitud
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ClienteHome;



const CarDetailModal = ({ car, onClose }) => {
  if (!car) return null;
  
  const getStatusIcon = (statusId) => {
    if (statusId === 1) return <Car className="h-4 w-4" />;
    if (statusId === 2) return <Clock className="h-4 w-4" />;
    if (statusId === 3) return <Wrench className="h-4 w-4" />;
    if (statusId === 4) return <CheckCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getStatusVariant = (statusId) => {
    if (statusId === 1) return 'neutral';
    if (statusId === 2) return 'warning';
    if (statusId === 3) return 'info';
    if (statusId === 4) return 'success';
    return 'neutral';
  };

  return (
    <Modal isOpen={!!car} onClose={onClose} size="lg">
      <ModalHeader onClose={onClose}>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Car className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <ModalTitle>Detalle del Vehículo</ModalTitle>
            <p className="text-sm text-gray-600">{car.licensePlate}</p>
          </div>
        </div>
      </ModalHeader>
      
      <ModalContent>
        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Marca</label>
                <p className="text-lg font-semibold text-gray-900">{car.brand}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Modelo</label>
                <p className="text-lg font-semibold text-gray-900">{car.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Año</label>
                <p className="text-lg font-semibold text-gray-900">{car.year || 'No especificado'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Kilómetros</label>
                <p className="text-lg font-semibold text-gray-900">
                  {car.kms ? car.kms.toLocaleString() : 'No especificado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Número de Chasis</label>
                <p className="text-lg font-semibold text-gray-900">{car.chassis || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Prioridad</label>
                <p className="text-lg font-semibold text-gray-900">
                  {car.priority === 1 ? 'Normal' : car.priority === 2 ? 'Alta' : 'Baja'}
                </p>
              </div>
            </div>
          </div>

          {/* Estado actual */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Estado Actual</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant={getStatusVariant(car.statusId)}
                    size="md"
                  >
                    {getStatusIcon(car.statusId)}
                    <span className="ml-1">{car.status?.name || 'Sin estado'}</span>
                  </Badge>
                </div>
              </div>
              
              {car.estimatedDate && (
                <div className="text-right">
                  <label className="text-sm font-medium text-gray-500">Fecha Estimada</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(car.estimatedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          {car.description && (
            <div className="border-t border-gray-200 pt-6">
              <label className="text-sm font-medium text-gray-500">Descripción</label>
              <p className="mt-2 text-gray-900 bg-gray-50 rounded-lg p-4">
                {car.description}
              </p>
            </div>
          )}
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

CarDetailModal.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.number,
    licensePlate: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    year: PropTypes.number,
    kms: PropTypes.number,
    chassis: PropTypes.string,
    description: PropTypes.string,
    statusId: PropTypes.number,
    status: PropTypes.shape({
      name: PropTypes.string
    }),
    estimatedDate: PropTypes.string,
    priority: PropTypes.number
  }),
  onClose: PropTypes.func
};
