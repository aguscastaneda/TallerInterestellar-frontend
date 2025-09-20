import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import NavBar from '../NavBar';
import { useAuth } from '../../contexts/AuthContext';
import { useConfig } from '../../contexts/ConfigContext';
import { carsService, usersService } from '../../services/api';
import { Button, Card, CardContent, Badge, Input, Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, SegmentedControl } from '../ui';
import { User, Users, Wrench, Shield, Eye, Edit, Trash2, Plus, Mail, Phone, Calendar, CheckCircle, XCircle, Car } from 'lucide-react';

const AdminHome = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('clientes');
  const [searchResult, setSearchResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    lastName: '',
    cuil: '',
    email: '',
    password: '',
    roleId: 1
  });
  const [editForm, setEditForm] = useState({
    name: '',
    lastName: '',
    cuil: '',
    email: '',
    password: ''
  });

  // Determinar el roleId basado en la pestaña activa
  const getRoleIdForActiveTab = () => {
    const roleMap = {
      'clientes': 'CLIENT',
      'mecanicos': 'MECHANIC', 
      'jefes': 'BOSS',
      'admins': 'ADMIN',
      'recepcionistas': 'RECEPTIONIST'
    };
    const roleKey = roleMap[activeTab];
    const role = config.roles.find(r => r.name.toLowerCase() === roleKey?.toLowerCase());
    return role?.id || 1;
  };

  const loadUsers = async () => {
    try {
      console.log('Cargando usuarios...');
      const res = await usersService.getAll();
      
      if (res.data?.success && res.data?.data) {
        setUsers(res.data.data);
        console.log('Usuarios cargados:', res.data.data.length);
      } else {
        console.log('No se encontraron usuarios o respuesta inválida');
        setUsers([]);
      }
    } catch (e) {
      console.error('Error cargando usuarios:', e);
      toast.error('Error cargando usuarios: ' + (e.response?.data?.message || e.message));
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const doSearch = async () => {
    if (!query) return;
    try {
      const res = await carsService.getByPlate(query.trim().toUpperCase());
      setSearchResult(res.data.data);
    } catch (e) {
      setSearchResult(null);
      toast.error('Patente inexistente');
    }
  };

  const handleCreateUser = async () => {
    try {
      const formData = {
        ...createForm,
        roleId: getRoleIdForActiveTab()
      };
      await usersService.create(formData);
      toast.success('Usuario creado exitosamente');
      setShowCreateForm(false);
      setCreateForm({
        name: '',
        lastName: '',
        cuil: '',
        email: '',
        password: '',
        roleId: 1
      });
      loadUsers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    const action = user?.active ? 'desactivar' : 'activar';
    
    if (!confirm(`¿Estás seguro de ${action} este usuario?`)) return;
    
    try {
      await usersService.delete(userId);
      toast.success(`Usuario ${action}do correctamente`);
      loadUsers();
    } catch (e) {
      toast.error(`Error al ${action} usuario`);
    }
  };

  const handleEditUser = (userItem) => {
    setEditingUser(userItem);
    setEditForm({
      name: userItem.name,
      lastName: userItem.lastName,
      cuil: userItem.cuil || '',
      email: userItem.email,
      password: '' // No pre-llenar la contraseña por seguridad
    });
    setShowEditForm(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updateData = {
        name: editForm.name,
        lastName: editForm.lastName,
        cuil: editForm.cuil,
        email: editForm.email
      };

      // Solo incluir password si se proporciona una nueva
      if (editForm.password.trim()) {
        updateData.password = editForm.password;
      }

      await usersService.update(editingUser.id, updateData);
      toast.success('Usuario actualizado correctamente');
      setShowEditForm(false);
      setEditingUser(null);
      loadUsers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const getUsersByRole = (roleId) => {
    console.log('Filtrando usuarios por roleId:', roleId, 'Total usuarios:', users.length);
    
    const filtered = users.filter(u => {
      // El backend devuelve role: { id: 1, name: "Cliente" }
      // Mostrar todos los usuarios (activos e inactivos) en AdminHome
      return u.role?.id === roleId;
    });
    console.log('Usuarios filtrados para roleId', roleId, ':', filtered.length, 'usuarios');
    return filtered;
  };

  const getRoleName = (user) => {
    return user.role?.name || 'Desconocido';
  };

  const handleHistoryClick = () => {
    // Admin doesn't need repairs history - different functionality
    toast.info('Panel de administración - Sin historial de reparaciones');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar roleBadge={true} showHistory={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios del sistema y busca vehículos
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

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <SegmentedControl
            options={[
              {
                value: 'clientes',
                label: 'Clientes',
                icon: <User className="h-4 w-4" />,
                count: getUsersByRole(1).length
              },
              {
                value: 'mecanicos',
                label: 'Mecánicos',
                icon: <Wrench className="h-4 w-4" />,
                count: getUsersByRole(2).length
              },
              {
                value: 'jefes',
                label: 'Jefes de Mecánicos',
                icon: <Users className="h-4 w-4" />,
                count: getUsersByRole(3).length
              }
            ]}
            value={activeTab}
            onChange={setActiveTab}
            size="lg"
          />
        </div>

        {/* Botón crear usuario */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setShowCreateForm(true)}
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Crear {activeTab === 'clientes' ? 'Cliente' : activeTab === 'mecanicos' ? 'Mecánico' : 'Jefe de Mecánicos'}
          </Button>
        </div>

        {/* Formulario de creación */}
        {showCreateForm && (
          <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
            <ModalHeader>
              <ModalTitle>
                Crear {activeTab === 'clientes' ? 'Cliente' : activeTab === 'mecanicos' ? 'Mecánico' : 'Jefe de Mecánicos'}
              </ModalTitle>
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
                  value={createForm.cuil}
                  onChange={(e) => setCreateForm({...createForm, cuil: e.target.value})}
                  placeholder="CUIL"
                  label="CUIL"
                  leftIcon={<Shield className="h-4 w-4" />}
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
              </div>
            </ModalContent>
            <ModalFooter>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="ghost"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateUser}
                variant="primary"
              >
                Crear
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Formulario de edición */}
        {showEditForm && (
          <Modal isOpen={showEditForm} onClose={() => {
            setShowEditForm(false);
            setEditingUser(null);
          }}>
            <ModalHeader>
              <ModalTitle>Editar {getRoleName(editingUser)}</ModalTitle>
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
                  value={editForm.cuil}
                  onChange={(e) => setEditForm({...editForm, cuil: e.target.value})}
                  placeholder="CUIL"
                  label="CUIL"
                  leftIcon={<Shield className="h-4 w-4" />}
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
              </div>
            </ModalContent>
            <ModalFooter>
              <Button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingUser(null);
                }}
                variant="ghost"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateUser}
                variant="primary"
              >
                Actualizar
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Lista de usuarios */}
        <div className="space-y-4">
          {getUsersByRole(
            activeTab === 'clientes' ? 1 : 
            activeTab === 'mecanicos' ? 2 : 3
          ).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay {activeTab} registrados
                </h3>
                <p className="text-gray-600">
                  Crea el primer {activeTab === 'clientes' ? 'cliente' : activeTab === 'mecanicos' ? 'mecánico' : 'jefe de mecánicos'} para comenzar
                </p>
              </CardContent>
            </Card>
          ) : (
            getUsersByRole(
              activeTab === 'clientes' ? 1 : 
              activeTab === 'mecanicos' ? 2 : 3
            ).map((userItem) => (
              <Card key={userItem.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          userItem.active ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <User className={`h-6 w-6 ${
                            userItem.active ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {userItem.name} {userItem.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{userItem.email}</span>
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={userItem.active ? 'success' : 'danger'}>
                            {userItem.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {getRoleName(userItem)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setShowUserDetails(userItem)}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Ver
                      </Button>
                      <Button
                        onClick={() => handleEditUser(userItem)}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Edit className="h-4 w-4" />}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(userItem.id)}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        className="text-red-600 hover:text-red-700"
                      >
                        {userItem.active ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal de detalles de usuario */}
        {showUserDetails && (
          <Modal isOpen={!!showUserDetails} onClose={() => setShowUserDetails(null)}>
            <ModalHeader>
              <ModalTitle>
                Detalles de {getRoleName(showUserDetails)}
              </ModalTitle>
            </ModalHeader>
            <ModalContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                    showUserDetails.active ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <User className={`h-8 w-8 ${
                      showUserDetails.active ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {showUserDetails.name} {showUserDetails.lastName}
                    </h3>
                    <p className="text-gray-600">{getRoleName(showUserDetails)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-gray-900">{showUserDetails.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">CUIL</p>
                        <p className="text-gray-900">{showUserDetails.cuil || 'No especificado'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Teléfono</p>
                        <p className="text-gray-900">{showUserDetails.phone || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fecha de creación</p>
                        <p className="text-gray-900">
                          {new Date(showUserDetails.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    {showUserDetails.active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estado</p>
                      <Badge variant={showUserDetails.active ? 'success' : 'danger'}>
                        {showUserDetails.active ? 'Usuario Activo' : 'Usuario Inactivo'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button
                onClick={() => setShowUserDetails(null)}
                variant="ghost"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  setShowUserDetails(null);
                  handleEditUser(showUserDetails);
                }}
                variant="primary"
                leftIcon={<Edit className="h-4 w-4" />}
              >
                Editar Usuario
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AdminHome;