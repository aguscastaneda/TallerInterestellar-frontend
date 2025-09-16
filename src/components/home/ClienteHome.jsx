import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import NavBar from '../NavBar';
import { useAuth } from '../../contexts/AuthContext';
import { carsService, usersService, requestsService } from '../../services/api';

const ClienteHome = () => {
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ licensePlate: '', brand: '', model: '', year: '', kms: '', chassis: '' });
  const [requestOpenId, setRequestOpenId] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [requestForm, setRequestForm] = useState({ description: '', preferredMechanicId: '' });

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
    } catch (e) {
      toast.error('Error cargando datos');
    }
  };

  useEffect(() => { load(); }, [clientId]);

  const handleCreateCar = async () => {
    if (!clientId) return;
    try {
      const payload = {
        clientId,
        licensePlate: form.licensePlate.trim().toUpperCase(),
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
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error al crear');
    }
  };

  const openRequest = (carId) => {
    setRequestOpenId(carId);
    setRequestForm({ description: '', preferredMechanicId: '' });
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
      toast.success('Solicitud enviada');
      setRequestOpenId(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error al solicitar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar roleBadge={null} showHistory={false} />
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mt-6">
          <h2 className="text-xl font-semibold">Mis patentes</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Agregar patente</button>
        </div>

        {showAdd && (
          <div className="mt-4 bg-white p-4 rounded-md shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={form.licensePlate} onChange={e=>setForm({...form, licensePlate:e.target.value})} className="border p-2 rounded" placeholder="Patente" />
              <input value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})} className="border p-2 rounded" placeholder="Marca" />
              <input value={form.model} onChange={e=>setForm({...form, model:e.target.value})} className="border p-2 rounded" placeholder="Modelo" />
              <input value={form.year} onChange={e=>setForm({...form, year:e.target.value})} className="border p-2 rounded" placeholder="Año" />
              <input value={form.kms} onChange={e=>setForm({...form, kms:e.target.value})} className="border p-2 rounded" placeholder="Kilómetros" />
              <input value={form.chassis} onChange={e=>setForm({...form, chassis:e.target.value})} className="border p-2 rounded" placeholder="Nro Chasis" />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-2 rounded border">Cancelar</button>
              <button onClick={handleCreateCar} className="px-3 py-2 rounded bg-green-600 text-white">Confirmar</button>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {cars.map((car) => (
            <div key={car.id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{car.licensePlate}</p>
                  <p className="text-sm text-gray-500">{car.brand} {car.model}</p>
                </div>
                <div className="flex space-x-2">
                  <details className="group">
                    <summary className="px-3 py-1 rounded border cursor-pointer hover:bg-gray-50 list-none">
                      <span className="group-open:hidden">Ver</span>
                      <span className="hidden group-open:inline">Ocultar</span>
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-600">
                      <p><strong>KMs:</strong> {car.kms ?? 'No especificado'}</p>
                      <p><strong>Chasis:</strong> {car.chassis ?? 'No especificado'}</p>
                      <p><strong>Estado:</strong> {car.status?.name ?? 'No especificado'}</p>
                      <p><strong>Prioridad:</strong> {car.priority ?? 'Normal'}</p>
                      <p><strong>Fecha estimada:</strong> {car.estimatedDate ? new Date(car.estimatedDate).toLocaleDateString() : 'No especificada'}</p>
                    </div>
                  </details>
                  <button onClick={() => openRequest(car.id)} className="px-3 py-1 rounded bg-indigo-600 text-white">Solicitar mecánico</button>
                </div>
              </div>
              {requestOpenId === car.id && (
                <div className="mt-3 border-t pt-3">
                  <textarea value={requestForm.description} onChange={e=>setRequestForm({...requestForm, description:e.target.value})} className="w-full border p-2 rounded" placeholder="Descripción de estado" />
                  <div className="mt-2 flex items-center space-x-2">
                    <select value={requestForm.preferredMechanicId} onChange={e=>setRequestForm({...requestForm, preferredMechanicId:e.target.value})} className="border p-2 rounded">
                      <option value="">Sin preferencia</option>
                      {mechanics.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <button onClick={createRequest} className="px-3 py-2 rounded bg-green-600 text-white">Enviar</button>
                    <button onClick={()=>setRequestOpenId(null)} className="px-3 py-2 rounded border">Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClienteHome;


