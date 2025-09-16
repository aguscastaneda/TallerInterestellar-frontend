import { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { usersService, requestsService, carsService } from '../../services/api';

const JefeHome = () => {
  const { user } = useAuth();
  const bossId = user?.boss?.id;
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [searchResult, setSearchResult] = useState(null);
  const [requests, setRequests] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  
  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState('todas');
  const [mechanicFilter, setMechanicFilter] = useState('todos');
  
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
    }
  };

  useEffect(()=>{ load(); }, [bossId]);

  const doSearch = async () => {
    if (!query) return;
    try { const res = await carsService.getByPlate(query.trim().toUpperCase()); setSearchResult(res.data.data); }
    catch (_) { setSearchResult(null); toast.error('Patente inexistente'); }
  };

  const assignMechanic = async (requestId, mechanicId) => {
    try { await requestsService.assignMechanic(requestId, mechanicId); toast.success('Asignado'); load(); }
    catch (e) { toast.error('Error al asignar'); }
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

  const handleDeleteMechanic = async (mechanicId) => {
    if (!confirm('¿Estás seguro de eliminar este mecánico?')) return;
    try {
      await usersService.delete(mechanicId);
      toast.success('Mecánico eliminado correctamente');
      load();
    } catch (e) {
      toast.error('Error al eliminar mecánico');
    }
  };

  // Funciones de filtrado
  const getFilteredRequests = () => {
    let filtered = requests.filter(r => ['ASSIGNED','IN_PROGRESS','COMPLETED'].includes(r.status));
    
    if (statusFilter !== 'todas') {
      const statusMap = {
        'pendiente': 'ASSIGNED',
        'en-proceso': 'IN_PROGRESS',
        'finalizadas': 'COMPLETED'
      };
      filtered = filtered.filter(r => r.status === statusMap[statusFilter]);
    }
    
    if (mechanicFilter !== 'todos') {
      filtered = filtered.filter(r => r.assignedMechanic?.id === parseInt(mechanicFilter));
    }
    
    return filtered;
  };

  const getPreferredMechanicName = (request) => {
    if (request.preferredMechanic) {
      return `${request.preferredMechanic.user.name} ${request.preferredMechanic.user.lastName}`;
    }
    return 'Sin preferencia';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar roleBadge={'Jefe de mecánico'} />
      <div className="max-w-6xl mx-auto p-4">
        <div className="mt-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Buscar por patente"
          />
          <div className="mt-2"><button onClick={doSearch} className="px-3 py-2 rounded bg-indigo-600 text-white">Buscar</button></div>
          {searchResult && (
            <div className="mt-3 bg-white p-3 rounded shadow text-sm">
              <p className="font-medium">{searchResult.licensePlate} - {searchResult.brand} {searchResult.model}</p>
              <p>Cliente: {searchResult.client?.user?.name} {searchResult.client?.user?.lastName}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-2">
          {['solicitudes','asignadas','mis-mecanicos'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-2 rounded border ${activeTab===t ? 'bg-indigo-600 text-white' : ''}`}>
              {t === 'solicitudes' && 'Solicitudes clientes'}
              {t === 'asignadas' && 'Solicitudes asignadas'}
              {t === 'mis-mecanicos' && 'Mis mecánicos'}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeTab === 'solicitudes' && (
            <div className="space-y-3">
              {requests.filter(r => r.status==='PENDING').map(r => (
                <div key={r.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
                  <div>
                    <p className="font-medium">{r.car.licensePlate} - {r.client.user.name} {r.client.user.lastName}</p>
                    <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()} · {r.description}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      Preferencia: {getPreferredMechanicName(r)}
                    </p>
                  </div>
                  <div>
                    <select onChange={e=>assignMechanic(r.id, parseInt(e.target.value))} className="border p-2 rounded">
                      <option>Asignar</option>
                      {mechanics.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.user.name} {m.user.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'asignadas' && (
            <div className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {['todas','pendiente','en-proceso','finalizadas'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1 rounded border ${
                        statusFilter === s ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <select 
                  value={mechanicFilter}
                  onChange={(e) => setMechanicFilter(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="todos">Todos los mecánicos</option>
                  {mechanics.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.user.name} {m.user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 space-y-2">
                {getFilteredRequests().map(r => (
                  <div key={r.id} className="p-3 border rounded">
                    <p className="font-medium">{r.car.licensePlate} · {r.assignedMechanic?.user?.name} {r.assignedMechanic?.user?.lastName}</p>
                    <p className="text-sm text-gray-600">{r.description}</p>
                    <p className="text-xs text-gray-500">
                      Estado: {r.status === 'ASSIGNED' ? 'Pendiente' : r.status === 'IN_PROGRESS' ? 'En proceso' : 'Finalizada'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mis-mecanicos' && (
            <div>
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowCreateMechanic(true)}
                  className="px-3 py-2 rounded bg-indigo-600 text-white"
                >
                  Crear mecánico
                </button>
              </div>

              {/* Formulario de creación */}
              {showCreateMechanic && (
                <div className="bg-white p-4 rounded shadow mb-4">
                  <h3 className="text-lg font-semibold mb-4">Crear Mecánico</h3>
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
                    <input
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                      className="border p-2 rounded"
                      placeholder="Teléfono"
                    />
                    <input
                      value={createForm.cuil}
                      onChange={(e) => setCreateForm({...createForm, cuil: e.target.value})}
                      className="border p-2 rounded"
                      placeholder="CUIL"
                    />
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setShowCreateMechanic(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateMechanic}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Crear
                    </button>
                  </div>
                </div>
              )}

              {/* Formulario de edición */}
              {showEditMechanic && (
                <div className="bg-white p-4 rounded shadow mb-4">
                  <h3 className="text-lg font-semibold mb-4">Editar Mecánico</h3>
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
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="border p-2 rounded"
                      placeholder="Teléfono"
                    />
                    <input
                      value={editForm.cuil}
                      onChange={(e) => setEditForm({...editForm, cuil: e.target.value})}
                      className="border p-2 rounded"
                      placeholder="CUIL"
                    />
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowEditMechanic(false);
                        setEditingMechanic(null);
                      }}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpdateMechanic}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {mechanics.map(m => (
                  <div key={m.id} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{m.user.name} {m.user.lastName}</p>
                        <p className="text-sm text-gray-500">{m.user.email}</p>
                        {showMechanicDetails === m.id && (
                          <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                            <p><strong>Teléfono:</strong> {m.user.phone || 'No especificado'}</p>
                            <p><strong>CUIL:</strong> {m.user.cuil || 'No especificado'}</p>
                            <p><strong>Estado:</strong> {m.user.active ? 'Activo' : 'Inactivo'}</p>
                            <p><strong>Fecha de creación:</strong> {new Date(m.user.createdAt).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-x-2">
                        <button 
                          onClick={() => setShowMechanicDetails(showMechanicDetails === m.id ? null : m.id)}
                          className="px-3 py-1 rounded border hover:bg-gray-50"
                        >
                          {showMechanicDetails === m.id ? 'Ocultar' : 'Ver'}
                        </button>
                        <button 
                          onClick={() => handleEditMechanic(m)}
                          className="px-3 py-1 rounded border hover:bg-blue-50 text-blue-600"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteMechanic(m.user.id)}
                          className="px-3 py-1 rounded border hover:bg-red-50 text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JefeHome;


