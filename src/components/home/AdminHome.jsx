import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import NavBar from '../NavBar';
import { useAuth } from '../../contexts/AuthContext';
import { carsService, usersService } from '../../services/api';

const AdminHome = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('clientes');
  const [searchResult, setSearchResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
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
    switch (activeTab) {
      case 'clientes': return 1;
      case 'mecanicos': return 2;
      case 'jefes': return 3;
      default: return 1;
    }
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
    // TODO: Implementar historial completo de arreglos
    toast.success('Funcionalidad de historial en desarrollo');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar roleBadge={'Admin'} showHistory={true} onHistoryClick={handleHistoryClick} />
      <div className="max-w-6xl mx-auto p-4">
        {/* Barra de búsqueda */}
        <div className="mt-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Buscar por patente"
          />
          <div className="mt-2">
            <button onClick={doSearch} className="px-3 py-2 rounded bg-indigo-600 text-white">
              Buscar
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Ingrese una patente exacta para buscar.</p>
          {searchResult && (
            <div className="mt-3 bg-white p-3 rounded shadow text-sm">
              <p className="font-medium">{searchResult.licensePlate} - {searchResult.brand} {searchResult.model}</p>
              <p>Cliente: {searchResult.client?.user?.name} {searchResult.client?.user?.lastName}</p>
            </div>
          )}
        </div>

        {/* Tabs de gestión */}
        <div className="mt-6 flex space-x-2">
          {['clientes', 'mecanicos', 'jefes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded border ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white'
              }`}
            >
              {tab === 'clientes' && 'Clientes'}
              {tab === 'mecanicos' && 'Mecánicos'}
              {tab === 'jefes' && 'Jefes de Mecánicos'}
            </button>
          ))}
        </div>

        {/* Botón crear usuario */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Crear {activeTab === 'clientes' ? 'Cliente' : activeTab === 'mecanicos' ? 'Mecánico' : 'Jefe de Mecánicos'}
          </button>
        </div>

        {/* Formulario de creación */}
        {showCreateForm && (
          <div className="mt-4 bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              Crear {activeTab === 'clientes' ? 'Cliente' : activeTab === 'mecanicos' ? 'Mecánico' : 'Jefe de Mecánicos'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={createForm.name}
                onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                className="border p-2 rounded"
                placeholder="Nombre"
              />
              <input
                value={createForm.lastName}
                onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})}
                className="border p-2 rounded"
                placeholder="Apellido"
              />
              <input
                value={createForm.cuil}
                onChange={(e) => setCreateForm({...createForm, cuil: e.target.value})}
                className="border p-2 rounded"
                placeholder="CUIL"
              />
              <input
                value={createForm.email}
                onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                className="border p-2 rounded"
                placeholder="Email"
                type="email"
              />
              <input
                value={createForm.password}
                onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                className="border p-2 rounded"
                placeholder="Contraseña"
                type="password"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Crear
              </button>
            </div>
          </div>
        )}

        {/* Formulario de edición */}
        {showEditForm && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-lg font-semibold mb-4">Editar {getRoleName(editingUser)}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="border p-2 rounded"
                placeholder="Nombre"
              />
              <input
                value={editForm.lastName}
                onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                className="border p-2 rounded"
                placeholder="Apellido"
              />
              <input
                value={editForm.cuil}
                onChange={(e) => setEditForm({...editForm, cuil: e.target.value})}
                className="border p-2 rounded"
                placeholder="CUIL"
              />
              <input
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="border p-2 rounded"
                placeholder="Email"
                type="email"
              />
              <input
                value={editForm.password}
                onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                className="border p-2 rounded"
                placeholder="Nueva contraseña (opcional)"
                type="password"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Actualizar
              </button>
            </div>
          </div>
        )}

        {/* Lista de usuarios */}
        <div className="mt-6 space-y-3">
          {getUsersByRole(
            activeTab === 'clientes' ? 1 : 
            activeTab === 'mecanicos' ? 2 : 3
          ).map((userItem) => (
            <div key={userItem.id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{userItem.name} {userItem.lastName}</p>
                  <p className="text-sm text-gray-500">{userItem.email}</p>
                  {!userItem.active && (
                    <p className="text-xs text-red-500 font-medium">Usuario inactivo</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <details>
                    <summary className="px-3 py-1 rounded border cursor-pointer hover:bg-gray-50">
                      Ver
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                      <p><strong>Email:</strong> {userItem.email}</p>
                      <p><strong>CUIL:</strong> {userItem.cuil || 'No especificado'}</p>
                      <p><strong>Teléfono:</strong> {userItem.phone || 'No especificado'}</p>
                      <p><strong>Estado:</strong> {userItem.active ? 'Activo' : 'Inactivo'}</p>
                      <p><strong>Fecha de creación:</strong> {new Date(userItem.createdAt).toLocaleDateString()}</p>
                    </div>
                  </details>
                  <button
                    onClick={() => handleEditUser(userItem)}
                    className="px-3 py-1 rounded border hover:bg-blue-50 text-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(userItem.id)}
                    className="px-3 py-1 rounded border hover:bg-red-50 text-red-600"
                  >
                    {userItem.active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getUsersByRole(
          activeTab === 'clientes' ? 1 : 
          activeTab === 'mecanicos' ? 2 : 3
        ).length === 0 && (
          <div className="mt-6 text-center text-gray-500">
            <p>No hay {activeTab} registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;