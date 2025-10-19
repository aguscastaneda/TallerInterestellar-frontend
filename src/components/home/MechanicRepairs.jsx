import { useEffect, useMemo, useState } from 'react';
import NavBar from '../NavBar';
import { useAuth } from '../../contexts/AuthContext';
import { requestsService, carsService, repairsService } from '../../services/api';
import PropTypes from 'prop-types';

const MechanicRepairs = () => {
  const { user, roleKey } = useAuth();
  const mechanicId = user?.mechanic?.id;
  const clientId = user?.client?.id;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todas');

  const loadForMechanic = async () => {
    const res = await requestsService.getByMechanic(mechanicId);
    setItems(res.data.data || []);
  };

  const loadForClient = async () => {
    // Traer solicitudes del cliente y reparaciones de sus autos
    const [carsRes, reqRes] = await Promise.all([
      carsService.getByClient(clientId),
      requestsService.getByClient(clientId)
    ]);
    const cars = carsRes.data.data || [];
    const requests = reqRes.data.data || [];
    const all = [];
    // Normalizar solicitudes
    for (const r of requests) {
      all.push({ type: 'request', request: r, car: r.car });
    }
    // Agregar reparaciones por auto
    for (const car of cars) {
      try {
        const repRes = await repairsService.getByCar(car.id);
        const reps = repRes.data.data || [];
        reps.forEach(rep => all.push({ type: 'repair', car, repair: rep }));
      } catch (error) {
        console.error('Error loading repairs for car:', car.id, error);
      }
    }
    setItems(all);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (roleKey === 'mecanico' && mechanicId) {
        await loadForMechanic();
      } else if (roleKey === 'cliente' && clientId) {
        await loadForClient();
      } else {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [roleKey, mechanicId, clientId]);

  const filteredItems = useMemo(() => {
    if (statusFilter === 'Todas') return items;
    const mapLabelToCar = {
      'Pendiente': 'Pendiente',
      'En reparacion': 'En reparacion',
      'Finalizado': 'Finalizado',
    };
    return items.filter(it => {
      // Para cliente usamos SIEMPRE el estado real del auto
      if (it.type === 'request') {
        const carTarget = mapLabelToCar[statusFilter];
        return carTarget ? (String(it.car?.status?.name) === carTarget) : false;
      }
      if (it.type === 'repair') {
        const carTarget = mapLabelToCar[statusFilter];
        if (!carTarget) return statusFilter === 'Todas';
        return String(it.car?.status?.name) === carTarget;
      }
      // Mecánico items no tipados: r de mechanic requests
      if (!it.type && it.status) {
        // Para mecánico seguimos usando status de request
        const reqMap = { 'Pendiente': 'PENDING', 'En reparacion': 'IN_PROGRESS', 'Finalizado': 'COMPLETED' };
        const target = reqMap[statusFilter];
        return target ? it.status === target : false;
      }
      return true;
    });
  }, [items, statusFilter]);

  const StatusBadge = ({ value }) => {
    if (!value) return null;
    const stylesReq = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
    };
    const stylesCar = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En reparacion': 'bg-blue-100 text-blue-800',
      'Finalizado': 'bg-green-100 text-green-800',
    };
    const isReq = typeof value === 'string' && value === value.toUpperCase();
    const cls = isReq ? (stylesReq[value] || 'bg-gray-100 text-gray-700') : (stylesCar[value] || 'bg-gray-100 text-gray-700');
    const label = isReq ? (value === 'PENDING' ? 'Pendiente' : value === 'IN_PROGRESS' ? 'En reparacion' : 'Finalizado') : value;
    return <span className={`ml-2 text-xs px-2 py-0.5 rounded ${cls}`}>{label}</span>;
  };

  StatusBadge.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar roleBadge={roleKey === 'mecanico' ? 'Mecánico' : null} />
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Mis Arreglos</h2>
        {loading && <div className="text-sm text-gray-600">Cargando...</div>}
        {!loading && (
          <div className="flex w-full justify-center mb-3">
            <div className="flex bg-white rounded-full shadow p-1">
              {['Todas', 'Pendiente', 'En reparacion', 'Finalizado'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-6 py-2 rounded-full text-xs border ${statusFilter === s ? 'bg-green-100 text-green-900 font-medium border-green-400' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
        {!loading && roleKey === 'mecanico' && (
          <div className="space-y-3">
            {filteredItems.map(r => (
              <div key={r.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.car?.licensePlate} · {r.car?.brand} {r.car?.model}</p>
                  <p className="text-sm text-gray-600 flex items-center">Estado: <StatusBadge value={r.status} /></p>
                  {r.cost && (
                    <p className="text-sm text-gray-600">Costo final: ${r.cost}</p>
                  )}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-gray-500">No hay arreglos asignados</div>
            )}
          </div>
        )}

        {!loading && roleKey === 'cliente' && (
          <div className="space-y-3">
            {filteredItems.map((it, idx) => (
              <div key={`${it.repair?.id || idx}`} className="bg-white rounded shadow p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{it.car.licensePlate} · {it.car.brand} {it.car.model}</p>
                  {it.type === 'request' && (
                    <>
                      <p className="text-sm text-gray-600 flex items-center">Estado: <StatusBadge value={it.car?.status?.name} /></p>
                      <p className="text-xs text-gray-500">{new Date(it.request.createdAt).toLocaleString()}</p>
                    </>
                  )}
                  {it.type === 'repair' && (
                    <>
                      <p className="text-sm text-gray-600">Descripción: {it.repair?.description}</p>
                      <p className="text-sm text-gray-600">Costo final: ${it.repair?.cost}</p>
                      <p className="text-xs text-gray-500">Garantía: {it.repair?.warranty || 0} días</p>
                    </>
                  )}
                </div>
                {it.repair && (
                  <button className="px-3 py-1 rounded bg-emerald-600 text-white">Pagar</button>
                )}
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-gray-500">No hay reparaciones registradas</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicRepairs;


