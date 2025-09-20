import { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { carsService, requestsService } from '../../services/api';
import { Button, Card, CardContent, Badge, Input, Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, SegmentedControl } from '../ui';
import { Wrench, Clock, CheckCircle, Eye, Play, Square, DollarSign, Car, Calendar, Clock3, CalendarCheck, Shield } from 'lucide-react';

const MecanicoHome = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pendientes');
  const [searchResult, setSearchResult] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [finishModalOpen, setFinishModalOpen] = useState(null);

  const mechanicId = user?.mechanic?.id;

  const load = async () => {
    if (!mechanicId) return;
    try {
      // Load own assigned requests
      const r = await fetch(`http://localhost:3001/api/requests/mechanic/${mechanicId}`);
      const data = await r.json();
      setRequests(data.data || []);
    } catch (_) {
      toast.error('Error cargando solicitudes');
    }
  };

  useEffect(() => { load(); }, [mechanicId]);

  const doSearch = async () => {
    if (!query) return;
    try {
      const res = await carsService.getByPlate(query.trim().toUpperCase());
      setSearchResult(res.data.data);
    } catch (_) {
      setSearchResult(null);
      toast.error('Patente inexistente');
    }
  };

  const startWork = async (reqItem) => {
    try {
      await requestsService.updateStatus(reqItem.id, { status: 'IN_PROGRESS' });
      toast.success('Trabajo iniciado');
      load();
    } catch (e) { toast.error('Error al iniciar'); }
  };

  const finishWork = async (reqItem, payload) => {
    try {
      await requestsService.updateStatus(reqItem.id, { status: 'COMPLETED', description: payload.description, cost: payload.cost });
      toast.success('Trabajo finalizado');
      load();
    } catch (e) { toast.error('Error al finalizar'); }
  };

  const getStatusIcon = (status) => {
    if (status === 'ASSIGNED') return <Clock className="h-4 w-4" />;
    if (status === 'IN_PROGRESS') return <Wrench className="h-4 w-4" />;
    if (status === 'COMPLETED') return <CheckCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getStatusVariant = (status) => {
    if (status === 'ASSIGNED') return 'warning';
    if (status === 'IN_PROGRESS') return 'info';
    if (status === 'COMPLETED') return 'success';
    return 'neutral';
  };

  const getStatusLabel = (status) => {
    if (status === 'ASSIGNED') return 'Pendiente';
    if (status === 'IN_PROGRESS') return 'En Proceso';
    if (status === 'COMPLETED') return 'Finalizado';
    return status;
  };

  const tabOptions = [
    { value: 'pendientes', label: 'Pendientes', icon: <Clock className="h-4 w-4" /> },
    { value: 'en-proceso', label: 'En Proceso', icon: <Wrench className="h-4 w-4" /> },
    { value: 'finalizados', label: 'Finalizados', icon: <CheckCircle className="h-4 w-4" /> },
  ];

  const filteredRequests = requests.filter(r => 
    (activeTab === 'pendientes' && r.status === 'ASSIGNED') || 
    (activeTab === 'en-proceso' && r.status === 'IN_PROGRESS') || 
    (activeTab === 'finalizados' && r.status === 'COMPLETED')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar roleBadge={true} showHistory={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Mecánico
          </h1>
          <p className="text-gray-600">
            Gestiona tus trabajos asignados y busca vehículos
          </p>
        </div>

        {/* Búsqueda de vehículos */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xl">
                <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
                  Buscar Vehículo
                </h2>
                <div className="flex">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ingrese patente exacta"
                    className="flex-1 px-4 py-2 h-11 rounded-l-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 text-black"
                  />
                  <button 
                    onClick={doSearch}
                    className="px-6 h-11 bg-red-600 text-white font-medium rounded-r-lg hover:bg-red-700 transition"
                  >
                    Buscar
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Ingrese una patente exacta para buscar información del vehículo
                </p>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Filtros de estado */}
        <div className="mb-6">
          <SegmentedControl
            options={tabOptions}
            value={activeTab}
            onChange={setActiveTab}
            size="lg"
          />
        </div>

        {/* Lista de trabajos */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay trabajos {activeTab === 'pendientes' ? 'pendientes' : activeTab === 'en-proceso' ? 'en proceso' : 'finalizados'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'pendientes' 
                    ? 'No tienes trabajos pendientes asignados' 
                    : activeTab === 'en-proceso' 
                    ? 'No tienes trabajos en proceso actualmente'
                    : 'No hay trabajos finalizados recientemente'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((item) => (
              <Card key={item.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <Car className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.car.licensePlate}
                          </h3>
                          <Badge 
                            variant={getStatusVariant(item.status)}
                            size="sm"
                          >
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{getStatusLabel(item.status)}</span>
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          {item.car.brand} {item.car.model}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cliente: {item.client?.user?.name} {item.client?.user?.lastName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRequest(item)}
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Ver Detalles
                      </Button>
                      
                      {activeTab === 'pendientes' && (
                        <Button
                          onClick={() => startWork(item)}
                          size="sm"
                          leftIcon={<Play className="h-4 w-4" />}
                        >
                          Comenzar
                        </Button>
                      )}
                      
                      {activeTab === 'en-proceso' && (
                        <Button
                          onClick={() => setFinishModalOpen(item)}
                          size="sm"
                          leftIcon={<Square className="h-4 w-4" />}
                        >
                          Finalizar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedRequest && (
        <RequestDetailModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}

      {/* Modal de finalización */}
      {finishModalOpen && (
        <FinalizeModal 
          request={finishModalOpen}
          onClose={() => setFinishModalOpen(null)}
          onSubmit={(payload) => {
            finishWork(finishModalOpen, payload);
            setFinishModalOpen(null);
          }}
        />
      )}
    </div>
  );
};

const RequestDetailModal = ({ request, onClose }) => {
  if (!request) return null;
  
  return (
    <Modal isOpen={!!request} onClose={onClose} size="lg">
      <ModalHeader onClose={onClose}>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Car className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <ModalTitle>Detalle de Solicitud</ModalTitle>
            <p className="text-sm text-gray-600">{request.car.licensePlate}</p>
          </div>
        </div>
      </ModalHeader>
      
      <ModalContent>
        <div className="space-y-6">
          {/* Información del vehículo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Vehículo</label>
                <p className="text-lg font-semibold text-gray-900">
                  {request.car.licensePlate} - {request.car.brand} {request.car.model}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cliente</label>
                <p className="text-lg font-semibold text-gray-900">
                  {request.client?.user?.name} {request.client?.user?.lastName}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant={request.status === 'ASSIGNED' ? 'warning' : request.status === 'IN_PROGRESS' ? 'info' : 'success'}
                    size="md"
                  >
                    {request.status === 'ASSIGNED' ? <Clock className="h-4 w-4" /> : 
                     request.status === 'IN_PROGRESS' ? <Wrench className="h-4 w-4" /> : 
                     <CheckCircle className="h-4 w-4" />}
                    <span className="ml-1">
                      {request.status === 'ASSIGNED' ? 'Pendiente' : 
                       request.status === 'IN_PROGRESS' ? 'En Proceso' : 'Finalizado'}
                    </span>
                  </Badge>
                </div>
              </div>
              
              {request.cost && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Costo</label>
                  <p className="text-lg font-semibold text-gray-900">
                    ${request.cost}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información detallada para reparaciones finalizadas */}
          {request.status === 'COMPLETED' && request.repair && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Información Detallada de Esta Reparación ID#{request.repair.id}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Costo Final de Esta Reparación</p>
                      <p className="text-xl font-bold text-green-700">
                        ${request.repair.cost?.toLocaleString('es-ES') || 'No especificado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Solicitud Creada</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'No disponible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock3 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Hora de Solicitud</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {request.createdAt ? new Date(request.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No disponible'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CalendarCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fecha de Finalización de Esta Reparación</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {request.repair.createdAt ? new Date(request.repair.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'No disponible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Hora de Finalización de Esta Reparación</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {request.repair.createdAt ? new Date(request.repair.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No disponible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Garantía de Esta Reparación</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {request.repair.warranty || 90} días
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {request.repair.description && request.repair.description !== request.description && (
                <div className="mt-6 pt-4 border-t border-green-200">
                  <h5 className="font-medium text-green-900 mb-2">Detalles Adicionales del Trabajo Realizado</h5>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <p className="text-gray-800 whitespace-pre-wrap">{request.repair.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Descripción del problema */}
          <div className="border-t border-gray-200 pt-6">
            <label className="text-sm font-medium text-gray-500">Descripción del Problema Original</label>
            <p className="mt-2 text-gray-900 bg-gray-50 rounded-lg p-4">
              {request.description || 'No se proporcionó descripción'}
            </p>
          </div>

          {/* Descripción del arreglo (solo para estados no completados) */}
          {request.status !== 'COMPLETED' && request.repairDescription && (
            <div className="border-t border-gray-200 pt-6">
              <label className="text-sm font-medium text-gray-500">Descripción del Arreglo en Progreso</label>
              <p className="mt-2 text-gray-900 bg-gray-50 rounded-lg p-4">
                {request.repairDescription}
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

const FinalizeModal = ({ request, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error('La descripción del arreglo es requerida');
      return;
    }
    if (!cost.trim() || isNaN(parseFloat(cost))) {
      toast.error('El costo debe ser un número válido');
      return;
    }
    onSubmit({ description, cost: parseFloat(cost) });
  };

  return (
    <Modal isOpen={!!request} onClose={onClose} size="md">
      <ModalHeader onClose={onClose}>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <ModalTitle>Finalizar Trabajo</ModalTitle>
            <p className="text-sm text-gray-600">{request?.car?.licensePlate}</p>
          </div>
        </div>
      </ModalHeader>
      
      <ModalContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Arreglo *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Describe el trabajo realizado..."
              rows={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo Final *
            </label>
            <Input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
              type="number"
              step="0.01"
              leftIcon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} leftIcon={<CheckCircle className="h-4 w-4" />}>
          Finalizar Trabajo
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MecanicoHome;


