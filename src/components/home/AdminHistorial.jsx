import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import NavBar from '../NavBar';
import { useConfig } from '../../contexts/ConfigContext';
import { repairsService, carStatesService } from '../../services/api';
import { Button, Card, CardContent, Badge, Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, SegmentedControl } from '../ui';
import { ArrowLeft, Wrench, User, Car, Calendar, DollarSign, Eye, Search } from 'lucide-react';
import PropTypes from 'prop-types';

const AdminHistorial = () => {
  const { config } = useConfig();
  const [repairs, setRepairs] = useState([]);
  const [allRepairs, setAllRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showRepairDetails, setShowRepairDetails] = useState(null);
  const [showModifyStatus, setShowModifyStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultStatuses = [
    { id: 1, name: 'Entrada' },
    { id: 2, name: 'Pendiente' },
    { id: 3, name: 'En revisión' },
    { id: 4, name: 'Rechazado' },
    { id: 5, name: 'En reparación' },
    { id: 6, name: 'Finalizado' },
    { id: 7, name: 'Entregado' },
    { id: 8, name: 'Cancelado' }
  ];

  const carStatuses = config?.carStatuses || defaultStatuses;

  const loadRepairs = async () => {
    try {
      setLoading(true);
      const response = await repairsService.getAll();
      if (response.data?.success && response.data?.data) {
        setAllRepairs(response.data.data);
        setRepairs(response.data.data);
      } else {
        setAllRepairs([]);
        setRepairs([]);
      }
    } catch (error) {
      console.error('Error cargando historial de reparaciones:', error);
      toast.error('Error cargando historial de reparaciones');
      setAllRepairs([]);
      setRepairs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, []);

  const getRepairStatusColor = (carStatusId) => {
    const colors = {
      1: 'bg-gray-100 text-gray-800',    // Entrada
      2: 'bg-yellow-100 text-yellow-800', // Pendiente
      3: 'bg-blue-100 text-blue-800',    // En revision
      4: 'bg-red-100 text-red-800',      // Rechazado
      5: 'bg-purple-100 text-purple-800', // En reparacion
      6: 'bg-green-100 text-green-800',  // Finalizado
      7: 'bg-indigo-100 text-indigo-800', // Entregado
      8: 'bg-orange-100 text-orange-800'  // Cancelado
    };
    return colors[carStatusId] || 'bg-gray-100 text-gray-800';
  };

  const getStatusCount = (statusId) => {
    if (statusId === 'all') return allRepairs.length;
    return allRepairs.filter(repair => repair.car?.statusId === statusId).length;
  };

  const handleStatusFilter = (statusId) => {
    setSelectedStatus(statusId);
    let filteredRepairs = allRepairs;

    if (statusId !== 'all') {
      filteredRepairs = allRepairs.filter(repair => repair.car?.statusId === statusId);
    }

    if (searchQuery.trim()) {
      filteredRepairs = filteredRepairs.filter(repair =>
        repair.car?.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.car?.client?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.car?.client?.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.mechanic?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.mechanic?.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setRepairs(filteredRepairs);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    let filteredRepairs = allRepairs;

    if (selectedStatus !== 'all') {
      filteredRepairs = allRepairs.filter(repair => repair.car?.statusId === selectedStatus);
    }

    if (query.trim()) {
      filteredRepairs = filteredRepairs.filter(repair =>
        repair.car?.licensePlate?.toLowerCase().includes(query.toLowerCase()) ||
        repair.car?.client?.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
        repair.car?.client?.user?.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        repair.mechanic?.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
        repair.mechanic?.user?.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        repair.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setRepairs(filteredRepairs);
  };

  const handleModifyStatus = (repair) => {
    setShowModifyStatus(repair);
  };

  const tabOptions = [
    {
      value: 'all',
      label: 'Todos',
      icon: <Wrench className="h-4 w-4" />,
      count: getStatusCount('all')
    },
    ...(carStatuses?.map(status => ({
      value: status.id,
      label: status.name,
      icon: <Wrench className="h-4 w-4" />,
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
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial Completo de Reparaciones
          </h1>
          <p className="text-gray-600">
            Todas las reparaciones del sistema de todos los clientes
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por patente, cliente, mecánico o descripción..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  onClick={() => handleSearch('')}
                  size="sm"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Filtrar por Estado del Vehículo
          </h2>
          <SegmentedControl
            options={tabOptions}
            value={selectedStatus}
            onChange={handleStatusFilter}
            size="lg"
          />
        </div>

        {/* Repairs List */}
        <div className="space-y-4">
          {repairs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay reparaciones
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? `No se encontraron reparaciones que coincidan con "${searchQuery}"`
                    : selectedStatus === 'all'
                      ? 'No hay reparaciones registradas en el sistema'
                      : `No hay reparaciones en estado ${carStatuses?.find(s => s.id === selectedStatus)?.name || 'seleccionado'}`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            repairs.map((repair) => (
              <Card key={repair.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Wrench className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {repair.car?.licensePlate} - {repair.car?.brand} {repair.car?.model}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <User className="inline h-4 w-4 mr-1" />
                          Cliente: {repair.car?.client?.user?.name} {repair.car?.client?.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <Wrench className="inline h-4 w-4 mr-1" />
                          Mecánico: {repair.mechanic?.user?.name} {repair.mechanic?.user?.lastName}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={getRepairStatusColor(repair.car?.statusId)}>
                            {carStatuses?.find(s => s.id === repair.car?.statusId)?.name || 'Desconocido'}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${parseFloat(repair.cost).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(repair.createdAt).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => setShowRepairDetails(repair)}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Ver Detalles
                      </Button>
                      {selectedStatus === 'all' && (
                        <Button
                          onClick={() => handleModifyStatus(repair)}
                          variant="primary"
                          size="sm"
                          className="ml-2"
                        >
                          Modificar Estado
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detalles modal arreglos */}
        {showRepairDetails && (
          <Modal isOpen={!!showRepairDetails} onClose={() => setShowRepairDetails(null)}>
            <ModalHeader>
              <ModalTitle>Detalles de la Reparación</ModalTitle>
            </ModalHeader>
            <ModalContent>
              <div className="space-y-6">
                {/* info auto */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Información del Vehículo
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Patente:</span>
                      <p className="font-medium">{showRepairDetails.car?.licensePlate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Vehículo:</span>
                      <p className="font-medium">{showRepairDetails.car?.brand} {showRepairDetails.car?.model}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <Badge className={`mt-1 ${getRepairStatusColor(showRepairDetails.car?.statusId)}`}>
                        {carStatuses?.find(s => s.id === showRepairDetails.car?.statusId)?.name || 'Desconocido'}
                      </Badge>
                    </div>
                    {showRepairDetails.car?.kms && (
                      <div>
                        <span className="text-gray-600">Kilómetros:</span>
                        <p className="font-medium">{showRepairDetails.car.kms.toLocaleString()} km</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* info cliente */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Información del Cliente
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nombre:</span>
                      <p className="font-medium">{showRepairDetails.car?.client?.user?.name} {showRepairDetails.car?.client?.user?.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{showRepairDetails.car?.client?.user?.email}</p>
                    </div>
                    {showRepairDetails.car?.client?.user?.phone && (
                      <div>
                        <span className="text-gray-600">Teléfono:</span>
                        <p className="font-medium">{showRepairDetails.car?.client?.user?.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* info mecanico */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    Información del Mecánico
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mecánico:</span>
                      <p className="font-medium">{showRepairDetails.mechanic?.user?.name} {showRepairDetails.mechanic?.user?.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha de Reparación:</span>
                      <p className="font-medium">{new Date(showRepairDetails.createdAt).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                </div>

                {/* detalles arreglo */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Detalles de la Reparación
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Descripción:</span>
                      <p className="font-medium mt-1">{showRepairDetails.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Costo:</span>
                        <p className="font-medium text-lg text-green-600">${parseFloat(showRepairDetails.cost).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Garantía:</span>
                        <p className="font-medium">{showRepairDetails.warranty} días</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button onClick={() => setShowRepairDetails(null)} variant="ghost">
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Modificar estado modal */}
        {showModifyStatus && (
          <ModifyStatusModal
            repair={showModifyStatus}
            onClose={() => setShowModifyStatus(null)}
            carStatuses={carStatuses}
            onStatusChange={loadRepairs}
          />
        )}
      </div>
    </div>
  );
};

const ModifyStatusModal = ({ repair, onClose, carStatuses, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(repair.car?.statusId || '');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error('Por favor seleccione un estado');
      return;
    }

    setLoading(true);
    try {
      await carStatesService.transition(repair.car.id, selectedStatus, description);
      toast.success('Estado actualizado exitosamente');
      onStatusChange();
      onClose();
    } catch (error) {
      console.error('Error updating car status:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!repair} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Modificar Estado del Vehículo</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehículo
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {repair.car?.licensePlate} - {repair.car?.brand} {repair.car?.model}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Actual
            </label>
            <Badge className={getRepairStatusColor(repair.car?.statusId)}>
              {carStatuses?.find(s => s.id === repair.car?.statusId)?.name || 'Desconocido'}
            </Badge>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Estado *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Seleccione un estado</option>
              {carStatuses?.map(status => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Agregue una descripción si es necesario..."
              rows={3}
            />
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !selectedStatus}>
          {loading ? 'Actualizando...' : 'Actualizar Estado'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ModifyStatusModal.propTypes = {
  repair: PropTypes.shape({
    car: PropTypes.shape({
      id: PropTypes.number,
      licensePlate: PropTypes.string,
      brand: PropTypes.string,
      model: PropTypes.string,
      statusId: PropTypes.number
    })
  }),
  onClose: PropTypes.func.isRequired,
  carStatuses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })),
  onStatusChange: PropTypes.func.isRequired
};

const getRepairStatusColor = (carStatusId) => {
  const colors = {
    1: 'bg-gray-100 text-gray-800',    // Entrada
    2: 'bg-yellow-100 text-yellow-800', // Pendiente
    3: 'bg-blue-100 text-blue-800',    // En revision
    4: 'bg-red-100 text-red-800',      // Rechazado
    5: 'bg-purple-100 text-purple-800', // En reparacion
    6: 'bg-green-100 text-green-800',  // Finalizado
    7: 'bg-indigo-100 text-indigo-800', // Entregado
    8: 'bg-orange-100 text-orange-800'  // Cancelado
  };
  return colors[carStatusId] || 'bg-gray-100 text-gray-800';
};

export default AdminHistorial;