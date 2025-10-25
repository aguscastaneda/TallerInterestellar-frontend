import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import NavBar from "../NavBar";
import { useConfig } from "../../contexts/ConfigContext";
import { repairsService, carsService } from "../../services/api";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
  SegmentedControl,
} from "../ui";
import {
  ArrowLeft,
  Wrench,
  User,
  Car,
  Calendar,
  DollarSign,
  Eye,
  Search,
} from "lucide-react";
import PropTypes from "prop-types";

const AdminHistorial = () => {
  const { config, getStatusColor, getStatusName } = useConfig();
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showItemDetails, setShowItemDetails] = useState(null);
  const [showModifyStatus, setShowModifyStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("cars");

  const carStatuses = config?.carStatuses || [];

  const loadAllItems = async (search = "") => {
    try {
      setLoading(true);

      const params = {};
      if (search.trim()) {
        params.search = search.trim();
      }

      let response;
      if (activeTab === "cars") {
        response = await repairsService.getAllCars(params);
      } else {
        response = await repairsService.getAllRepairsOnly(params);
      }

      if (response.data?.success && response.data?.data) {
        setAllItems(response.data.data);
      } else {
        setAllItems([]);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      toast.error("Error cargando historial");
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (items, statusId, search) => {
    let filteredItems = [...items];

    if (statusId && statusId !== "all") {
      const statusIdInt = parseInt(statusId);
      filteredItems = filteredItems.filter((item) => {
        if (item.type === "repair") {
          return item.statusId === statusIdInt;
        } else {
          return item.statusId === statusIdInt;
        }
      });
    }

    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.car?.licensePlate?.toLowerCase().includes(searchTerm) ||
          item.licensePlate?.toLowerCase().includes(searchTerm) ||
          item.car?.client?.user?.name?.toLowerCase().includes(searchTerm) ||
          item.client?.user?.name?.toLowerCase().includes(searchTerm) ||
          item.car?.client?.user?.lastName
            ?.toLowerCase()
            .includes(searchTerm) ||
          item.client?.user?.lastName?.toLowerCase().includes(searchTerm) ||
          item.mechanic?.user?.name?.toLowerCase().includes(searchTerm) ||
          item.mechanic?.user?.lastName?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm)
      );
    }

    return filteredItems;
  };

  useEffect(() => {
    loadAllItems();
  }, []);

  useEffect(() => {
    loadAllItems(searchQuery);
  }, [activeTab]);

  useEffect(() => {
    const filteredItems = applyFilters(allItems, selectedStatus, searchQuery);
    setItems(filteredItems);
  }, [allItems, selectedStatus, searchQuery]);

  const getRepairStatusColor = (statusId) => {

    return getStatusColor(statusId);
  };

  const getStatusCount = (statusId) => {
    if (statusId === "all") {
      return allItems.length;
    }

    const statusIdInt = parseInt(statusId);
    if (isNaN(statusIdInt)) {
      return 0;
    }

    const repairCount = allItems.filter(
      (item) => item.type === "repair" && item.statusId === statusIdInt
    ).length;

    const carWithoutRepairsCount = allItems.filter(
      (item) => item.type === "car" && item.statusId === statusIdInt
    ).length;

    return repairCount + carWithoutRepairsCount;
  };

  const handleStatusFilter = (statusId) => {
    setSelectedStatus(statusId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    loadAllItems(query);
  };

  const handleModifyStatus = (item) => {
    setShowModifyStatus(item);
  };

  const refreshData = () => {
    loadAllItems(searchQuery);
  };

  const tabOptions = useMemo(
    () => [
      {
        value: "all",
        label: "Todos",
        icon: <Wrench className="h-4 w-4" />,
        count: getStatusCount("all"),
      },
      ...(carStatuses?.map((status) => ({
        value: status.id,
        label: status.name,
        icon: <Wrench className="h-4 w-4" />,
        count: getStatusCount(status.id),
      })) || []),
    ],
    [allItems, carStatuses]
  );

  if (loading && allItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar roleBadge={true} showHistory={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando historial...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && carStatuses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar roleBadge={true} showHistory={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error de configuración
              </h3>
              <p className="text-gray-600">
                No se pudieron cargar los estados del sistema. Contacte al administrador.
              </p>
            </div>
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
            Historial Completo
          </h1>
          <p className="text-gray-600">
            Gestión de autos y reparaciones del sistema
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("cars")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "cars"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4" />
                  <span>Autos ({getStatusCount("all")})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("repairs")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "repairs"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4" />
                  <span>Reparaciones ({getStatusCount("all")})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 w-full">
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
                  onClick={() => handleSearch("")}
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
            Filtrar por Estado
          </h2>
          <SegmentedControl
            options={tabOptions}
            value={selectedStatus}
            onChange={handleStatusFilter}
            size="lg"
          />
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay elementos
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? `No se encontraron autos o reparaciones que coincidan con "${searchQuery}"`
                    : selectedStatus === "all"
                      ? "No hay autos ni reparaciones registrados en el sistema"
                      : `No hay elementos en estado ${carStatuses?.find((s) => s.id === selectedStatus)
                        ?.name || "seleccionado"
                      }`}
                </p>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={`${item.type}-${item.id}`} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {item.type === "repair" ? (
                            <Wrench className="h-6 w-6 text-blue-600" />
                          ) : (
                            <Car className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {item.type === "repair" ? "Reparación" : "Auto"} ID:{" "}
                            {item.id} -{" "}
                            {item.car?.licensePlate || item.licensePlate}
                          </h3>
                          <Badge
                            className={getRepairStatusColor(item.statusId)}
                          >
                            {carStatuses?.find((s) => s.id === item.statusId)
                              ?.name || "Desconocido"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 flex items-center flex-wrap gap-1">
                          <Car className="inline h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            Vehículo: {item.car?.brand || item.brand}{" "}
                            {item.car?.model || item.model}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2 flex items-center flex-wrap gap-1">
                          <User className="inline h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            Cliente:{" "}
                            {item.car?.client?.user?.name ||
                              item.client?.user?.name}{" "}
                            {item.car?.client?.user?.lastName ||
                              item.client?.user?.lastName}
                          </span>
                        </p>
                        {activeTab === "repairs" && item.mechanic && (
                          <p className="text-sm text-gray-600 mb-2 flex items-center flex-wrap gap-1">
                            <Wrench className="inline h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              Mecánico: {item.mechanic?.user?.name}{" "}
                              {item.mechanic?.user?.lastName}
                            </span>
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          {activeTab === "repairs" && (
                            <span className="text-sm text-gray-500 flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>
                                ${parseFloat(item.cost || 0).toLocaleString()}
                              </span>
                            </span>
                          )}
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>
                              {new Date(item.createdAt).toLocaleDateString(
                                "es-ES"
                              )}
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2 break-words">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-2">
                      <Button
                        onClick={() => setShowItemDetails(item)}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                        className="w-full sm:w-auto"
                      >
                        Ver Detalles
                      </Button>
                      {selectedStatus === "all" && (
                        <Button
                          onClick={() => handleModifyStatus(item)}
                          variant="primary"
                          size="sm"
                          className="w-full sm:w-auto"
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

        {/* Detalles modal */}
        {showItemDetails && (
          <Modal
            isOpen={!!showItemDetails}
            onClose={() => setShowItemDetails(null)}
            size="lg"
          >
            <ModalHeader>
              <ModalTitle>
                {showItemDetails.type === "car"
                  ? "Detalles del Auto"
                  : "Detalles de la Reparación"}
              </ModalTitle>
            </ModalHeader>
            <ModalContent>
              <div className="flex flex-col space-y-6">
                {/* info auto */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Información del Vehículo
                  </h4>
                  <div className="flex flex-col space-y-3 text-sm">
                    <div className="break-words">
                      <span className="text-gray-600">Patente:</span>
                      <p className="font-medium">
                        {showItemDetails.car?.licensePlate ||
                          showItemDetails.licensePlate}
                      </p>
                    </div>
                    <div className="break-words">
                      <span className="text-gray-600">Vehículo:</span>
                      <p className="font-medium">
                        {showItemDetails.car?.brand || showItemDetails.brand}{" "}
                        {showItemDetails.car?.model || showItemDetails.model}
                      </p>
                    </div>
                    <div className="break-words">
                      <span className="text-gray-600">Estado del Auto:</span>
                      <Badge
                        className={`mt-1 ${getRepairStatusColor(
                          showItemDetails.car?.statusId ||
                          showItemDetails.statusId
                        )}`}
                      >
                        {carStatuses?.find(
                          (s) =>
                            s.id ===
                            (showItemDetails.car?.statusId ||
                              showItemDetails.statusId)
                        )?.name || "Desconocido"}
                      </Badge>
                    </div>
                    {(showItemDetails.car?.kms || showItemDetails.kms) && (
                      <div className="break-words">
                        <span className="text-gray-600">Kilómetros:</span>
                        <p className="font-medium">
                          {(
                            showItemDetails.car?.kms || showItemDetails.kms
                          ).toLocaleString()}{" "}
                          km
                        </p>
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
                  <div className="flex flex-col space-y-3 text-sm">
                    <div className="break-words">
                      <span className="text-gray-600">Nombre:</span>
                      <p className="font-medium">
                        {showItemDetails.car?.client?.user?.name ||
                          showItemDetails.client?.user?.name}{" "}
                        {showItemDetails.car?.client?.user?.lastName ||
                          showItemDetails.client?.user?.lastName}
                      </p>
                    </div>
                    <div className="break-words">
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium break-words">
                        {showItemDetails.car?.client?.user?.email ||
                          showItemDetails.client?.user?.email}
                      </p>
                    </div>
                    {(showItemDetails.car?.client?.user?.phone ||
                      showItemDetails.client?.user?.phone) && (
                        <div className="break-words">
                          <span className="text-gray-600">Teléfono:</span>
                          <p className="font-medium">
                            {showItemDetails.car?.client?.user?.phone ||
                              showItemDetails.client?.user?.phone}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* info mecanico */}
                {showItemDetails.mechanic && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Wrench className="h-5 w-5 mr-2" />
                      Información del Mecánico
                    </h4>
                    <div className="flex flex-col space-y-3 text-sm">
                      <div className="break-words">
                        <span className="text-gray-600">Mecánico:</span>
                        <p className="font-medium">
                          {showItemDetails.mechanic?.user?.name}{" "}
                          {showItemDetails.mechanic?.user?.lastName}
                        </p>
                      </div>
                      <div className="break-words">
                        <span className="text-gray-600">Fecha:</span>
                        <p className="font-medium">
                          {new Date(
                            showItemDetails.createdAt
                          ).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* detalles */}
                <div
                  className={`p-4 rounded-lg ${showItemDetails.type === "car"
                    ? "bg-orange-50"
                    : "bg-yellow-50"
                    }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    {showItemDetails.type === "car"
                      ? "Detalles del Auto"
                      : "Detalles de la Reparación"}
                  </h4>
                  <div className="flex flex-col space-y-3">
                    <div className="break-words">
                      <span className="text-gray-600">Estado:</span>
                      <Badge
                        className={`mt-1 ${getRepairStatusColor(
                          showItemDetails.statusId
                        )}`}
                      >
                        {carStatuses?.find(
                          (s) => s.id === showItemDetails.statusId
                        )?.name || "Desconocido"}
                      </Badge>
                    </div>
                    <div className="break-words">
                      <span className="text-gray-600">Descripción:</span>
                      <p className="font-medium mt-1 break-words">
                        {showItemDetails.description}
                      </p>
                    </div>
                    {showItemDetails.type === "repair" && (
                      <div className="flex flex-col space-y-3 text-sm">
                        <div className="break-words">
                          <span className="text-gray-600">Costo:</span>
                          <p className="font-medium text-lg text-green-600">
                            $
                            {parseFloat(
                              showItemDetails.cost || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="break-words">
                          <span className="text-gray-600">Garantía:</span>
                          <p className="font-medium">
                            {showItemDetails.warranty || 0} días
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button onClick={() => setShowItemDetails(null)} variant="ghost">
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Modificar estado modal */}
        {showModifyStatus && (
          <ModifyStatusModal
            item={showModifyStatus}
            onClose={() => setShowModifyStatus(null)}
            carStatuses={carStatuses}
            onStatusChange={refreshData}
          />
        )}
      </div>
    </div>
  );
};

const ModifyStatusModal = ({ item, onClose, carStatuses, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(item.statusId || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error("Por favor seleccione un estado");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (item.type === "repair") {
        response = await repairsService.update(item.id, {
          statusId: parseInt(selectedStatus),
        });
        toast.success("Estado de la reparación actualizado exitosamente");
      } else {
        response = await carsService.updateStatus(item.id, parseInt(selectedStatus));
        toast.success("Estado del auto actualizado exitosamente");
      }
      onStatusChange();
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      const itemType = item.type === "repair" ? "reparación" : "auto";

      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.errors?.[0]?.msg || error.response.data?.message || "Datos inválidos";
        toast.error(`Error de validación: ${errorMessage}`);
      } else if (error.response?.status === 403) {
        toast.error(`No tienes permisos para actualizar esta ${itemType}`);
      } else if (error.response?.status === 404) {
        toast.error(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} no encontrada`);
      } else if (error.response?.status === 500) {
        toast.error("Error interno del servidor. Intente nuevamente.");
      } else {
        toast.error(`Error al actualizar el estado del ${itemType}: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!item} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>
          Modificar Estado del {item.type === "repair" ? "Reparación" : "Auto"}
        </ModalTitle>
      </ModalHeader>
      <ModalContent>
        <div className="flex flex-col space-y-4">
          <div className="break-words">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {item.type === "repair" ? "Reparación" : "Auto"}
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {item.car?.licensePlate || item.licensePlate} - {item.car?.brand || item.brand} {item.car?.model || item.model}
            </p>
            <p className="text-sm text-gray-600 mt-1 break-words">
              {item.description}
            </p>
          </div>

          <div className="break-words">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Actual
            </label>
            <Badge className={getRepairStatusColor(item.statusId)}>
              {carStatuses?.find((s) => s.id === item.statusId)?.name ||
                "Desconocido"}
            </Badge>
          </div>

          <div className="break-words">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Estado *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Seleccione un estado</option>
              {carStatuses?.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div className="break-words">
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
          {loading ? "Actualizando..." : `Actualizar Estado del ${item.type === "repair" ? "Reparación" : "Auto"}`}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ModifyStatusModal.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
    statusId: PropTypes.number,
    description: PropTypes.string,
    car: PropTypes.shape({
      id: PropTypes.number,
      licensePlate: PropTypes.string,
      brand: PropTypes.string,
      model: PropTypes.string,
      statusId: PropTypes.number,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  carStatuses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  onStatusChange: PropTypes.func.isRequired,
};

const getRepairStatusColor = (carStatusId) => {

  return "bg-gray-100 text-gray-800 border border-gray-200";
};

export default AdminHistorial;
