import { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useConfig } from '../../contexts/ConfigContext';
import { usersService, requestsService, carsService } from '../../services/api';
import { Button, Card, CardContent, Badge, Input, Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, SegmentedControl } from '../ui';
import { Wrench, Clock, CheckCircle, Eye, User, Plus, Edit, Trash2, Users, FileText, Calendar, Phone, Mail, Shield, DollarSign, Clock3, CalendarCheck } from 'lucide-react';

const JefeHome = () => {
  const { user } = useAuth();
  const { translateServiceRequestStatus } = useConfig();
  const bossId = user?.boss?.id;
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [searchResult, setSearchResult] = useState(null);
  const [requests, setRequests] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para filtros dinámicos
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMechanic, setSelectedMechanic] = useState('all');
  
  // Estados para formularios
  const [showCreateMechanic, setShowCreateMechanic] = useState(false);
  const [showEditMechanic, setShowEditMechanic] = useState(false);
  const [editingMechanic, setEditingMechanic] = useState(null);
  const [showMechanicDetails, setShowMechanicDetails] = useState(null);
  
  // Formularios
  const [createForm, setCreateForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    cuil: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    cuil: ''
  });

  const load = async () => {
    if (!bossId) return;
    setLoading(true);
    try {
      console.log('Cargando datos para bossId:', bossId);
      const [reqRes, mechsRes] = await Promise.all([
        requestsService.getByBoss(bossId),
        usersService.getMechanics()
      ]);
      console.log('Respuesta de mecánicos:', mechsRes.data);
      setRequests(reqRes.data.data || []);
      const filteredMechanics = (mechsRes.data.data || []).filter(m => m.bossId === bossId);
      console.log('Mecánicos filtrados para este jefe:', filteredMechanics);
      setMechanics(filteredMechanics);
    } catch (e) { 
      console.error('Error cargando datos:', e);
      toast.error('Error cargando datos'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, [bossId]);

  const doSearch = async () => {
    if (!query) return;
    try { const res = await carsService.getByPlate(query.trim().toUpperCase()); setSearchResult(res.data.data); }
    catch { setSearchResult(null); toast.error('Patente inexistente'); }
  };

  const assignMechanic = async (requestId, mechanicId) => {
    try { await requestsService.assignMechanic(requestId, mechanicId); toast.success('Asignado'); load(); }
    catch { toast.error('Error al asignar'); }
  };

  // Funciones para manejar mecánicos
  const handleCreateMechanic = async () => {
    try {
      const mechanicData = {
        ...createForm,
        roleId: 2, // Mecánico
        bossId: bossId // Pasar el bossId directamente
      };
      console.log('Creando mecánico con datos:', mechanicData);
      const response = await usersService.create(mechanicData);
      console.log('Respuesta del servidor:', response.data);
      
      toast.success('Mecánico creado correctamente');
      setShowCreateMechanic(false);
      setCreateForm({ name: '', lastName: '', email: '', password: '', phone: '', cuil: '' });
      load();
    } catch (e) {
      console.error('Error al crear mecánico:', e);
      toast.error(e.response?.data?.message || 'Error al crear mecánico');
    }
  };

  const handleEditMechanic = (mechanic) => {
    setEditingMechanic(mechanic);
    setEditForm({
      name: mechanic.user.name,
      lastName: mechanic.user.lastName,
      email: mechanic.user.email,
      phone: mechanic.user.phone || '',
      cuil: mechanic.user.cuil || '',
      password: ''
    });
    setShowEditMechanic(true);
  };

  const handleUpdateMechanic = async () => {
    try {
      const updateData = {
        name: editForm.name,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        cuil: editForm.cuil
      };
      if (editForm.password.trim()) {
        updateData.password = editForm.password;
      }
      await usersService.update(editingMechanic.user.id, updateData);
      toast.success('Mecánico actualizado correctamente');
      setShowEditMechanic(false);
      setEditingMechanic(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error al actualizar mecánico');
    }
  };

  const handleDeleteMechanic = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este mecánico?')) return;
    try {
      console.log('Eliminando mecánico con userId:', userId);
      const response = await usersService.delete(userId);
      console.log('Respuesta del servidor:', response.data);
      toast.success('Mecánico eliminado correctamente');
      // Forzar recarga de datos
      await load();
    } catch (e) {
      console.error('Error al eliminar mecánico:', e);
      toast.error('Error al eliminar mecánico');
    }
  };

  // Funciones auxiliares
  const getStatusIcon = (status) => {
    if (status === 'PENDING') return <Clock className="h-4 w-4" />;
    if (status === 'ASSIGNED') return <Eye className="h-4 w-4" />;
    if (status === 'IN_PROGRESS') return <Wrench className="h-4 w-4" />;
    if (status === 'COMPLETED') return <CheckCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getStatusVariant = (status) => {
    if (status === 'PENDING') return 'warning';
    if (status === 'ASSIGNED') return 'info';
    if (status === 'IN_PROGRESS') return 'info';
    if (status === 'COMPLETED') return 'success';
    return 'neutral';
  };

  const getStatusCount = (status) => {
    if (status === 'all') {
      return requests.filter(r => ['ASSIGNED','IN_PROGRESS','COMPLETED'].includes(r.status)).length;
    }
    return requests.filter(r => r.status === status).length;
  };

  const getMechanicWorkCount = (mechanicId) => {
    return requests.filter(r => r.assignedMechanic?.id === mechanicId && r.status === 'IN_PROGRESS').length;
  };

  // Funciones de filtrado
  const getFilteredRequests = () => {
    let filtered = requests.filter(r => ['ASSIGNED','IN_PROGRESS','COMPLETED'].includes(r.status));
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }
    
    if (selectedMechanic !== 'all') {
      filtered = filtered.filter(r => r.assignedMechanic?.id === parseInt(selectedMechanic));
    }
    
    return filtered;
  };

  const getPreferredMechanicName = (request) => {
    if (request.preferredMechanic) {
      return `${request.preferredMechanic.user.name} ${request.preferredMechanic.user.lastName}`;
    }
    return 'Sin preferencia';
  };

  // Opciones para el SegmentedControl de estados
  const statusOptions = [
    {
      value: 'all',
      label: 'Todas',
      icon: <FileText className="h-4 w-4" />,
      count: getStatusCount('all')
    },
    {
      value: 'ASSIGNED',
      label: 'Pendientes',
      icon: getStatusIcon('ASSIGNED'),
      count: getStatusCount('ASSIGNED')
    },
    {
      value: 'IN_PROGRESS',
      label: 'En Proceso',
      icon: getStatusIcon('IN_PROGRESS'),
      count: getStatusCount('IN_PROGRESS')
    },
    {
      value: 'COMPLETED',
      label: 'Finalizadas',
      icon: getStatusIcon('COMPLETED'),
      count: getStatusCount('COMPLETED')
    }
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
            Panel de Jefe de Mecánico
          </h1>
          <p className="text-gray-600">
            Gestiona solicitudes, asigna trabajos y administra tu equipo de mecánicos
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
                    placeholder="Ingresa la patente del vehículo"
                    className="flex-1 px-4 py-2 h-11 rounded-l-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 text-black"
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
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-gray-600" />
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

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <SegmentedControl
            options={[
              {
                value: 'solicitudes',
                label: 'Solicitudes Clientes',
                icon: <FileText className="h-4 w-4" />,
                count: requests.filter(r => r.status === 'PENDING').length
              },
              {
                value: 'asignadas',
                label: 'Solicitudes Asignadas',
                icon: <Users className="h-4 w-4" />,
                count: requests.filter(r => ['ASSIGNED','IN_PROGRESS','COMPLETED'].includes(r.status)).length
              },
              {
                value: 'mis-mecanicos',
                label: 'Mis Mecánicos',
                icon: <Wrench className="h-4 w-4" />,
                count: mechanics.length
              }
            ]}
            value={activeTab}
            onChange={setActiveTab}
            size="lg"
          />
        </div>

        {/* Contenido de las pestañas */}
        <div className="space-y-6">
          {activeTab === 'solicitudes' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Solicitudes Pendientes</h2>
              {requests.filter(r => r.status === 'PENDING').length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay solicitudes pendientes
                    </h3>
                    <p className="text-gray-600">
                      Las nuevas solicitudes de clientes aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {requests.filter(r => r.status === 'PENDING').map(r => (
                    <Card key={r.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                  <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {r.car.licensePlate} - {r.car.brand} {r.car.model}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Cliente: {r.client.user.name} {r.client.user.lastName}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {new Date(r.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="mb-4">
                              <p className="text-gray-700">{r.description}</p>
                              <p className="text-sm text-blue-600 font-medium mt-2">
                                Preferencia: {getPreferredMechanicName(r)}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <select 
                              onChange={e => assignMechanic(r.id, parseInt(e.target.value))} 
                              className="input-base"
                              defaultValue=""
                            >
                              <option value="" disabled>Asignar mecánico</option>
                              {mechanics.map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.user.name} {m.user.lastName} ({getMechanicWorkCount(m.id)} trabajos activos)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'asignadas' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Solicitudes Asignadas</h2>
                <div className="flex items-center space-x-4">
                  <select 
                    value={selectedMechanic}
                    onChange={(e) => setSelectedMechanic(e.target.value)}
                    className="input-base"
                  >
                    <option value="all">Todos los mecánicos</option>
                    {mechanics.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.user.name} {m.user.lastName} ({getMechanicWorkCount(m.id)} trabajos activos)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filtros de estado */}
              <div className="flex justify-center">
                <SegmentedControl
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  size="lg"
                />
              </div>

              {/* Lista de solicitudes */}
              {getFilteredRequests().length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay solicitudes asignadas
                    </h3>
                    <p className="text-gray-600">
                      {selectedStatus === 'all' 
                        ? 'No hay solicitudes asignadas con los filtros seleccionados'
                        : 'No hay solicitudes en el estado seleccionado'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {getFilteredRequests().map(r => (
                    <Card key={r.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                  {getStatusIcon(r.status)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {r.car.licensePlate} - {r.car.brand} {r.car.model}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Cliente: {r.client.user.name} {r.client.user.lastName}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Fecha de solicitud: {new Date(r.createdAt).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="mb-4">
                              <p className="text-gray-700">{r.description}</p>
                            </div>

                            {/* Información detallada para reparaciones finalizadas */}
                            {r.status === 'COMPLETED' && r.repair && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                                  <CheckCircle className="h-5 w-5 mr-2" />
                                  Información de la Reparación Finalizada
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Costo Final:</span>
                                    <span className="font-semibold text-green-700">${r.repair.cost?.toLocaleString('es-ES') || 'No especificado'}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Fecha de Inicio:</span>
                                    <span className="text-gray-700">
                                      {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      }) : 'No disponible'}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock3 className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Hora de Inicio:</span>
                                    <span className="text-gray-700">
                                      {r.updatedAt ? new Date(r.updatedAt).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }) : 'No disponible'}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <CalendarCheck className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Fecha de Finalización:</span>
                                    <span className="text-gray-700">
                                      {r.repair.createdAt ? new Date(r.repair.createdAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      }) : 'No disponible'}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Hora de Finalización:</span>
                                    <span className="text-gray-700">
                                      {r.repair.createdAt ? new Date(r.repair.createdAt).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }) : 'No disponible'}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Garantía:</span>
                                    <span className="text-gray-700">{r.repair.warranty || 90} días</span>
                                  </div>
                                </div>
                                {r.repair.description && r.repair.description !== r.description && (
                                  <div className="mt-3 pt-3 border-t border-green-200">
                                    <p className="text-sm">
                                      <span className="font-medium text-green-900">Detalles adicionales del trabajo:</span>
                                      <span className="text-gray-700 ml-2">{r.repair.description}</span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center space-x-4">
                              <Badge variant={getStatusVariant(r.status)}>
                                {translateServiceRequestStatus(r.status)}
                              </Badge>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <User className="h-4 w-4" />
                                <span>
                                  Asignado a: {r.assignedMechanic?.user?.name} {r.assignedMechanic?.user?.lastName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mis-mecanicos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Mis Mecánicos</h2>
                <Button 
                  onClick={() => setShowCreateMechanic(true)}
                  variant="primary"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Crear Mecánico
                </Button>
              </div>

              {/* Lista de mecánicos */}
              {mechanics.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay mecánicos registrados
                    </h3>
                    <p className="text-gray-600">
                      Crea tu primer mecánico para comenzar a asignar trabajos
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {mechanics.map(m => (
                    <Card key={m.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {m.user.name} {m.user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{m.user.email}</span>
                              </p>
                              <p className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Creado: {m.createdAt ? new Date(m.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  }) : 'Fecha no disponible'}
                                </span>
                              </p>
                              {showMechanicDetails === m.id && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span>{m.user.phone || 'No especificado'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Shield className="h-4 w-4 text-gray-500" />
                                      <span>CUIL: {m.user.cuil || 'No especificado'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant={m.user.active ? 'success' : 'danger'}>
                                        {m.user.active ? 'Activo' : 'Inactivo'}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Wrench className="h-4 w-4 text-gray-500" />
                                      <span>{getMechanicWorkCount(m.id)} trabajos activos</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => setShowMechanicDetails(showMechanicDetails === m.id ? null : m.id)}
                              variant="ghost"
                              size="sm"
                            >
                              {showMechanicDetails === m.id ? 'Ocultar' : 'Ver'}
                            </Button>
                            <Button
                              onClick={() => handleEditMechanic(m)}
                              variant="ghost"
                              size="sm"
                              leftIcon={<Edit className="h-4 w-4" />}
                            >
                              Editar
                            </Button>
                            <Button
                              onClick={() => handleDeleteMechanic(m.user.id)}
                              variant="ghost"
                              size="sm"
                              leftIcon={<Trash2 className="h-4 w-4" />}
                              className="text-red-600 hover:text-red-700"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Modal de creación de mecánico */}
        <Modal isOpen={showCreateMechanic} onClose={() => setShowCreateMechanic(false)}>
          <ModalHeader>
            <ModalTitle>Crear Nuevo Mecánico</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                placeholder="Nombre"
                label="Nombre"
              />
              <Input
                value={createForm.lastName}
                onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})}
                placeholder="Apellido"
                label="Apellido"
              />
              <Input
                value={createForm.email}
                onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                placeholder="Email"
                type="email"
                label="Email"
                leftIcon={<Mail className="h-4 w-4" />}
              />
              <Input
                value={createForm.password}
                onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                placeholder="Contraseña"
                type="password"
                label="Contraseña"
              />
              <Input
                value={createForm.phone}
                onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                placeholder="Teléfono"
                label="Teléfono"
                leftIcon={<Phone className="h-4 w-4" />}
              />
              <Input
                value={createForm.cuil}
                onChange={(e) => setCreateForm({...createForm, cuil: e.target.value})}
                placeholder="CUIL"
                label="CUIL"
                leftIcon={<Shield className="h-4 w-4" />}
              />
            </div>
          </ModalContent>
          <ModalFooter>
            <Button
              onClick={() => setShowCreateMechanic(false)}
              variant="ghost"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateMechanic}
              variant="primary"
            >
              Crear Mecánico
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal de edición de mecánico */}
        <Modal isOpen={showEditMechanic} onClose={() => {
          setShowEditMechanic(false);
          setEditingMechanic(null);
        }}>
          <ModalHeader>
            <ModalTitle>Editar Mecánico</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="Nombre"
                label="Nombre"
              />
              <Input
                value={editForm.lastName}
                onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                placeholder="Apellido"
                label="Apellido"
              />
              <Input
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                placeholder="Email"
                type="email"
                label="Email"
                leftIcon={<Mail className="h-4 w-4" />}
              />
              <Input
                value={editForm.password}
                onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                placeholder="Nueva contraseña (opcional)"
                type="password"
                label="Nueva contraseña"
              />
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                placeholder="Teléfono"
                label="Teléfono"
                leftIcon={<Phone className="h-4 w-4" />}
              />
              <Input
                value={editForm.cuil}
                onChange={(e) => setEditForm({...editForm, cuil: e.target.value})}
                placeholder="CUIL"
                label="CUIL"
                leftIcon={<Shield className="h-4 w-4" />}
              />
            </div>
          </ModalContent>
          <ModalFooter>
            <Button
              onClick={() => {
                setShowEditMechanic(false);
                setEditingMechanic(null);
              }}
              variant="ghost"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateMechanic}
              variant="primary"
            >
              Actualizar Mecánico
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default JefeHome;


