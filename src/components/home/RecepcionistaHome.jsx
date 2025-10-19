import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import NavBar from '../NavBar';
import { useConfig } from '../../contexts/ConfigContext';
import { carsService, carStatesService } from '../../services/api';
import { Button, Card, CardContent, Badge, Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, SegmentedControl } from '../ui';
import { Car, Eye, CheckCircle, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

const RecepcionistaHome = () => {
  const { config } = useConfig();
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showClientDetails, setShowClientDetails] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(null);

  const loadCars = async () => {
    try {
      setLoading(true);
      const response = await carsService.getAll();
      if (response.data?.success && response.data?.data) {
        setAllCars(response.data.data);
        setCars(response.data.data);
      } else {
        setAllCars([]);
        setCars([]);
      }
    } catch (error) {
      console.error('Error cargando autos:', error);
      toast.error('Error cargando autos');
      setAllCars([]);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const doSearch = async () => {
    if (!query) return;
    try {
      const res = await carsService.getByPlate(query.trim().toUpperCase());
      setSearchResult(res.data.data);
    } catch {
      setSearchResult(null);
      toast.error('Patente inexistente');
    }
  };

  const handleDeliverCar = async (carId) => {
    try {
      await carStatesService.deliverCar(carId);
      toast.success('Auto entregado exitosamente');
      setShowDeliveryModal(null);
      loadCars();
    } catch (error) {
      console.error('Error entregando auto:', error);
      toast.error('Error al entregar el auto');
    }
  };

  const getStatusColor = (statusId) => {
    const colors = {
      1: 'bg-gray-100 text-gray-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-blue-100 text-blue-800',
      4: 'bg-red-100 text-red-800',
      5: 'bg-purple-100 text-purple-800',
      6: 'bg-green-100 text-green-800',
      7: 'bg-indigo-100 text-indigo-800',
      8: 'bg-orange-100 text-orange-800'
    };
    return colors[statusId] || 'bg-gray-100 text-gray-800';
  };

  const getStatusCount = (statusId) => {
    if (statusId === 'all') return allCars.length;
    return allCars.filter(car => car.statusId === statusId).length;
  };

  const handleStatusFilter = (statusId) => {
    setSelectedStatus(statusId);
    if (statusId === 'all') {
      setCars(allCars);
    } else {
      setCars(allCars.filter(car => car.statusId === statusId));
    }
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
      icon: <Car className="h-4 w-4" />,
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Recepcionista
          </h1>
          <p className="text-gray-600">
            Gestiona la recepción y entrega de vehículos
          </p>
        </div>

        {/* Búsqueda de vehículos */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xl">
                <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
                  Buscar Vehículo por Patente
                </h2>
                <div className="flex">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ingresa la patente del vehículo"
                    className="flex-1 px-4 py-2 h-11 rounded-l-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 text-black"
                    onKeyPress={(e) => e.key === 'Enter' && doSearch()}
                  />
                  <button
                    onClick={doSearch}
                    className="px-6 h-11 bg-red-600 text-white font-medium rounded-r-lg hover:bg-red-700 transition"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>

            {searchResult && (
              <Card className="mt-6 bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Car className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {searchResult.licensePlate} - {searchResult.brand} {searchResult.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cliente: {searchResult.client?.user?.name} {searchResult.client?.user?.lastName}
                      </p>
                      <div className="mt-2">
                        <Badge className={getStatusColor(searchResult.statusId)}>
                          {config.carStatuses?.find(s => s.id === searchResult.statusId)?.name || 'Desconocido'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => setShowClientDetails(searchResult.client)}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Ver Cliente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Título de la sección */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Autos Registrados
          </h2>
          <p className="text-gray-600">
            Filtra los vehículos por su estado actual
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-8">
          <SegmentedControl
            options={tabOptions}
            value={selectedStatus}
            onChange={handleStatusFilter}
            size="lg"
          />
        </div>

        {/* Lista de vehículos */}
        <div className="space-y-4">
          {cars.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay vehículos
                </h3>
                <p className="text-gray-600">
                  {selectedStatus === 'all'
                    ? 'No hay vehículos registrados en el sistema'
                    : `No hay vehículos en estado ${config.carStatuses?.find(s => s.id === selectedStatus)?.name || 'seleccionado'}`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            cars.map((car) => (
              <Card key={car.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Car className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {car.licensePlate} - {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Cliente: {car.client?.user?.name} {car.client?.user?.lastName}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={getStatusColor(car.statusId)}>
                            {config.carStatuses?.find(s => s.id === car.statusId)?.name || 'Desconocido'}
                          </Badge>
                          {car.year && (
                            <span className="text-sm text-gray-500">
                              Año: {car.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setShowClientDetails(car.client)}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Ver
                      </Button>
                      {car.statusId === 6 && (
                        <Button
                          onClick={() => setShowDeliveryModal(car)}
                          variant="primary"
                          size="sm"
                          leftIcon={<CheckCircle className="h-4 w-4" />}
                        >
                          Entregar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal de detalles del cliente */}
        {showClientDetails && (
          <Modal isOpen={!!showClientDetails} onClose={() => setShowClientDetails(null)}>
            <ModalHeader>
              <ModalTitle>Información del Cliente</ModalTitle>
            </ModalHeader>
            <ModalContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {showClientDetails.user?.name} {showClientDetails.user?.lastName}
                    </h3>
                    <p className="text-gray-600">Cliente del taller</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-gray-900">{showClientDetails.user?.email}</p>
                      </div>
                    </div>

                    {showClientDetails.user?.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Teléfono</p>
                          <p className="text-gray-900">{showClientDetails.user.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {showClientDetails.address && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Dirección</p>
                          <p className="text-gray-900">{showClientDetails.address}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Cliente desde</p>
                        <p className="text-gray-900">
                          {(() => {
                            try {

                              const dateValue = showClientDetails.user?.createdAt || showClientDetails.createdAt;

                              if (!dateValue) return 'Fecha no disponible';

                              const date = new Date(dateValue);

                              if (isNaN(date.getTime())) return 'Fecha no disponible';

                              return date.toLocaleDateString('es-ES');
                            } catch (error) {
                              console.error('Error parsing date:', error);
                              return 'Fecha no disponible';
                            }
                          })()
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {showClientDetails.user?.cuil && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">CUIL</p>
                        <p className="text-gray-900">{showClientDetails.user.cuil}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ModalContent>
            <ModalFooter>
              <Button onClick={() => setShowClientDetails(null)} variant="ghost">
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Modal de confirmación de entrega */}
        {showDeliveryModal && (
          <Modal isOpen={!!showDeliveryModal} onClose={() => setShowDeliveryModal(null)}>
            <ModalHeader>
              <ModalTitle>Confirmar Entrega de Vehículo</ModalTitle>
            </ModalHeader>
            <ModalContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Entrega de {showDeliveryModal.licensePlate}
                  </h3>
                  <p className="text-gray-600">
                    ¿Confirmas la entrega de este vehículo al cliente?
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Detalles del vehículo:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patente:</span>
                      <span className="font-medium">{showDeliveryModal.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehículo:</span>
                      <span className="font-medium">{showDeliveryModal.brand} {showDeliveryModal.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cliente:</span>
                      <span className="font-medium">
                        {showDeliveryModal.client?.user?.name} {showDeliveryModal.client?.user?.lastName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">Importante</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        Al confirmar, el vehículo cambiará automáticamente a estado &quot;Entregado&quot;.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button onClick={() => setShowDeliveryModal(null)} variant="ghost">
                Cancelar
              </Button>
              <Button
                onClick={() => handleDeliverCar(showDeliveryModal.id)}
                variant="primary"
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                Confirmar Entrega
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default RecepcionistaHome;
