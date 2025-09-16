import { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { carsService, requestsService } from '../../services/api';

const MecanicoHome = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pendientes');
  const [searchResult, setSearchResult] = useState(null);
  const [requests, setRequests] = useState([]);

  const mechanicId = user?.mechanic?.id;

  const load = async () => {
    if (!mechanicId) return;
    try {
      const res = await requestsService.getByBoss(0); // placeholder not used here
    } catch (_) {}
    try {
      // Load own assigned requests
      const r = await fetch(`http://localhost:3001/api/requests/mechanic/${mechanicId}`);
      const data = await r.json();
      setRequests(data.data || []);
    } catch (e) {
      toast.error('Error cargando solicitudes');
    }
  };

  useEffect(() => { load(); }, [mechanicId]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar roleBadge={'Mecánico'} />
      <div className="max-w-5xl mx-auto p-4">
        <div className="mt-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Buscar por patente"
          />
          <div className="mt-2"><button onClick={doSearch} className="px-3 py-2 rounded bg-indigo-600 text-white">Buscar</button></div>
          <p className="text-sm text-gray-500 mt-1">Ingrese una patente exacta para buscar.</p>
          {searchResult && (
            <div className="mt-3 bg-white p-3 rounded shadow text-sm">
              <p className="font-medium">{searchResult.licensePlate} - {searchResult.brand} {searchResult.model}</p>
              <p>Cliente: {searchResult.client?.user?.name} {searchResult.client?.user?.lastName}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-2">
          {['pendientes','en-proceso','finalizados'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-2 rounded border ${activeTab===t ? 'bg-indigo-600 text-white' : ''}`}>
              {t === 'pendientes' && 'Pendientes'}
              {t === 'en-proceso' && 'En proceso'}
              {t === 'finalizados' && 'Finalizados'}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {requests
            .filter(r => (activeTab==='pendientes' && r.status==='ASSIGNED') || (activeTab==='en-proceso' && r.status==='IN_PROGRESS') || (activeTab==='finalizados' && r.status==='COMPLETED'))
            .map(item => (
            <div key={item.id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.car.licensePlate}</p>
                  <p className="text-sm text-gray-500">{item.client?.user?.name} {item.client?.user?.lastName}</p>
                </div>
                <div className="flex space-x-2">
                  <details>
                    <summary className="px-3 py-1 rounded border cursor-pointer">Ver</summary>
                    <div className="mt-2 text-sm text-gray-600">{item.description}</div>
                  </details>
                  {activeTab === 'pendientes' && (
                    <button onClick={()=>startWork(item)} className="px-3 py-1 rounded bg-indigo-600 text-white">Comenzar</button>
                  )}
                  {activeTab === 'en-proceso' && (
                    <FinalizeForm onSubmit={(payload)=>finishWork(item, payload)} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FinalizeForm = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  if (!open) return <button onClick={()=>setOpen(true)} className="px-3 py-1 rounded bg-green-600 text-white">Finalizar</button>;
  return (
    <div className="bg-white border p-2 rounded shadow">
      <input value={description} onChange={e=>setDescription(e.target.value)} className="border p-1 rounded mr-2" placeholder="Descripción de arreglo" />
      <input value={cost} onChange={e=>setCost(e.target.value)} className="border p-1 rounded mr-2" placeholder="Costo final" />
      <button onClick={()=>{ onSubmit({ description, cost }); setOpen(false); }} className="px-2 py-1 rounded bg-green-600 text-white">Confirmar</button>
    </div>
  );
};

export default MecanicoHome;


