import { useEffect, useMemo, useState } from 'react';
import NavBar from '../NavBar';
import { analyticsService } from '../../services/api';
import { SegmentedControl, Card } from '../ui';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';

const ALL_STATUSES = [
    { id: 1, name: 'Entrada' },
    { id: 2, name: 'Pendiente' },
    { id: 3, name: 'En Revisión' },
    { id: 4, name: 'Rechazado' },
    { id: 5, name: 'En Reparación' },
    { id: 6, name: 'Finalizado' },
    { id: 7, name: 'Entregado' },
    { id: 8, name: 'Cancelado' },
];
const ROLE_TABS = [
    { value: 'mecanico', label: 'Mecánico' },
    { value: 'jefe', label: 'Jefe de Mecánico' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'recepcionista', label: 'Recepcionista' },
];

const STATUS_COLOR_MAP = {
    1: '#6b7280',
    2: '#f59e0b',
    3: '#3b82f6',
    4: '#ef4444',
    5: '#8b5cf6',
    6: '#10b981',
    7: '#6366f1',
    8: '#f97316',
};

const Dot = ({ color }) => (
    <span className="inline-block h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: color }} />
);

const Section = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>
    </div>
);

const ChartCard = ({ title, subtitle, children }) => (
    <Card className="p-4 bg-white/70 backdrop-blur border border-gray-100 shadow-strong rounded-xl">
        <div className="mb-3">
            <h4 className="text-gray-900 font-semibold">{title}</h4>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="h-72">{children}</div>
    </Card>
);

const Loading = () => (
    <div className="h-72 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
    </div>
);

const Empty = ({ text = 'Sin datos' }) => (
    <div className="h-72 flex items-center justify-center text-sm text-gray-500">{text}</div>
);

const AdminCharts = () => {
    const [activeRole, setActiveRole] = useState('mecanico');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [repairsLastWeek, setRepairsLastWeek] = useState([]);
    const [carsByStatus, setCarsByStatus] = useState([]);
    const [carsAssignedByMechanic, setCarsAssignedByMechanic] = useState([]);
    const [bossWorkload, setBossWorkload] = useState([]);
    const [clientsLastMonth, setClientsLastMonth] = useState([]);
    const [carsByWeek, setCarsByWeek] = useState([]);
    const [rejectionRate, setRejectionRate] = useState([]);

    const loadData = async () => {
        try {
            setError('');
            setLoading(true);
            const requests = [];

            requests.push(analyticsService.getCarsByStatus());
            if (activeRole === 'mecanico') {
                requests.push(analyticsService.getRepairsLastWeek());
                requests.push(analyticsService.getCarsAssignedByMechanic());
            }
            if (activeRole === 'jefe') {
                requests.push(analyticsService.getBossWorkloadByMechanic());
            }
            if (activeRole === 'cliente') {
                requests.push(analyticsService.getClientsRegisteredLastMonth());
            }
            if (activeRole === 'recepcionista') {
                requests.push(analyticsService.getCarsIngresadosPorSemana());
                requests.push(analyticsService.getRejectionRateWeekly());
            }
            const responses = await Promise.all(requests);
            setRepairsLastWeek([]);
            setCarsAssignedByMechanic([]);
            setBossWorkload([]);
            setClientsLastMonth([]);
            setCarsByWeek([]);
            setRejectionRate([]);
            setCarsByStatus(responses[0]?.data?.data || []);
            let idx = 1;
            if (activeRole === 'mecanico') {
                setRepairsLastWeek(responses[idx++]?.data?.data || []);
                setCarsAssignedByMechanic(responses[idx++]?.data?.data || []);
            }
            if (activeRole === 'jefe') {
                setBossWorkload(responses[idx++]?.data?.data || []);
            }
            if (activeRole === 'cliente') {
                setClientsLastMonth(responses[idx++]?.data?.data || []);
            }
            if (activeRole === 'recepcionista') {
                setCarsByWeek(responses[idx++]?.data?.data || []);
                setRejectionRate(responses[idx++]?.data?.data || []);
            }
        } catch (e) {
            setError('No se pudieron cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeRole]);

    const pieData = useMemo(() => {
        const counts = new Map(carsByStatus.map(s => [s.statusId, s.count]));
        return ALL_STATUSES.map(s => ({
            statusId: s.id,
            name: s.name,
            value: counts.get(s.id) || 0,
            color: STATUS_COLOR_MAP[s.id] || '#9ca3af',
        }));
    }, [carsByStatus]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <NavBar roleBadge />
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-gray-900">Panel de Charts</h2>
                        <p className="text-sm text-gray-500 mt-1">Visualiza métricas por rol del sistema</p>
                    </div>
                    <div className="w-full md:w-auto">
                        <SegmentedControl
                            options={ROLE_TABS}
                            value={activeRole}
                            onChange={setActiveRole}
                        />
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">{error}</div>
                )}

                {loading ? (
                    <Loading />
                ) : (
                    <div className="space-y-10">
                        {/* Común: Autos por estado */}
                        <Section title="Estado de Autos">
                            <ChartCard title="Autos por estado" subtitle="Distribución actual (leyenda de colores por estado)">
                                {pieData.length === 0 ? (
                                    <Empty />
                                ) : (
									<div className="h-full w-full flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="md:flex-1 h-72">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                                                        {pieData.map((p, i) => (
                                                            <Cell key={`cell-${i}`} fill={p.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        {/* Leyenda a la derecha en pantallas medianas+ y abajo en móviles */}
										<div className="md:w-64 md:flex-none">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 text-xs text-gray-700">
                                                {pieData.map((p, i) => (
                                                    <div key={`legend-${i}`} className="flex items-center">
                                                        <Dot color={p.color} />
                                                        <span className="truncate">{p.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ChartCard>
                        </Section>

                        {activeRole === 'mecanico' && (
                            <Section title="Mecánico">
                                <ChartCard title="Reparaciones en la última semana" subtitle="Conteo por día">
                                    {repairsLastWeek.length === 0 ? (
                                        <Empty />
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={repairsLastWeek}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                                <ChartCard title="Autos a cargo por mecánico" subtitle="Total de autos asignados">
                                    {carsAssignedByMechanic.length === 0 ? (
                                        <Empty />
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={carsAssignedByMechanic}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="mechanicName" interval={0} angle={-20} textAnchor="end" height={60} />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </Section>
                        )}

                        {activeRole === 'jefe' && (
                            <Section title="Jefe de Mecánico">
                                <ChartCard title="Carga de trabajo por mecánico" subtitle="Autos en revisión o reparación">
                                    {bossWorkload.length === 0 ? (
                                        <Empty />
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={bossWorkload} layout="vertical" margin={{ left: 40 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" allowDecimals={false} />
                                                <YAxis type="category" dataKey="mechanicName" width={160} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </Section>
                        )}

                        {activeRole === 'cliente' && (
                            <Section title="Cliente">
                                <ChartCard title="Clientes registrados último mes" subtitle="Alta diaria">
                                    {clientsLastMonth.length === 0 ? (
                                        <Empty />
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={clientsLastMonth}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </Section>
                        )}

                        {activeRole === 'recepcionista' && (
                            <Section title="Recepcionista">
                                <ChartCard title="Autos ingresados por semana" subtitle="Últimas semanas">
                                    {carsByWeek.length === 0 ? (
                                        <Empty />
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={carsByWeek}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="weekStart" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                                <ChartCard title="Tasa de solicitudes rechazadas/fallidas" subtitle="Rechazadas + canceladas / total por semana">
                                    {rejectionRate.length === 0 ? (
                                        <Empty />
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={rejectionRate}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="weekStart" />
                                                <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                                                <Tooltip formatter={(v) => `${Math.round(v * 100)}%`} />
                                                <Line type="monotone" dataKey="rate" stroke="#06b6d4" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </Section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCharts;


