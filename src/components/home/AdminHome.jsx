import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import NavBar from "../NavBar";
import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import { carsService, usersService } from "../../services/api";
import { fetchWithCache, clearCache } from "../../services/cache";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
  SegmentedControl,
  LoadingSpinner,
} from "../ui";
import {
  User,
  Users,
  Wrench,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Car,
} from "lucide-react";
import { validateUserCreationForm } from "../../utils/validation";

const ROLE_IDS = {
  CLIENT: 1,
  MECHANIC: 2,
  BOSS: 3,
  ADMIN: 4,
  RECEPTIONIST: 5,
};

const ROLE_NAMES = {
  CLIENT: "clientes",
  MECHANIC: "mecanicos",
  BOSS: "jefes",
  ADMIN: "admins",
  RECEPTIONIST: "recepcionistas",
};

const AdminHome = () => {
  useAuth();
  useConfig();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(ROLE_NAMES.CLIENT);
  const [searchResult, setSearchResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [bosses, setBosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    lastName: "",
    cuil: "",
    email: "",
    password: "",
    roleId: ROLE_IDS.CLIENT,
    bossId: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    lastName: "",
    cuil: "",
    email: "",
    password: "",
  });

  const getRoleIdForActiveTab = () => {
    const roleMap = {
      [ROLE_NAMES.CLIENT]: ROLE_IDS.CLIENT,
      [ROLE_NAMES.MECHANIC]: ROLE_IDS.MECHANIC,
      [ROLE_NAMES.BOSS]: ROLE_IDS.BOSS,
      [ROLE_NAMES.ADMIN]: ROLE_IDS.ADMIN,
      [ROLE_NAMES.RECEPTIONIST]: ROLE_IDS.RECEPTIONIST,
    };

    return roleMap[activeTab] || ROLE_IDS.CLIENT;
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchWithCache(
        'admin_users',
        async () => await usersService.getAll(),
        {}
      );

      if (res?.data?.success && res?.data?.data) {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } catch (e) {
      console.error("Error loading users:", e);
      toast.error(
        "Error loading users: " + (e.response?.data?.message || e.message)
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBosses = async () => {
    try {
      const res = await fetchWithCache(
        'admin_bosses',
        async () => await usersService.getBosses(),
        {}
      );
      if (res?.data?.success && res?.data?.data) {
        setBosses(res.data.data);
      } else {
        setBosses([]);
      }
    } catch (e) {
      console.error("Error loading bosses:", e);
      toast.error(
        "Error loading bosses: " + (e.response?.data?.message || e.message)
      );
      setBosses([]);
    }
  };

  const handleViewUserDetails = async (userItem) => {
    setShowUserDetails(userItem);
  };

  useEffect(() => {
    loadUsers();
    loadBosses();

    const handleRefresh = () => {
      loadUsers();
      loadBosses();
    };

    window.addEventListener('app-refresh', handleRefresh);
    return () => {
      window.removeEventListener('app-refresh', handleRefresh);
    };
  }, []);

  const doSearch = async () => {
    if (!query) return;
    try {
      const res = await carsService.getByPlate(query.trim().toUpperCase());
      setSearchResult(res.data.data);
    } catch (error) {
      setSearchResult(null);
      toast.error(error.response?.data?.message || "License plate not found");
    }
  };

  const handleCreateUser = async () => {
    try {
      const roleId = getRoleIdForActiveTab();
      const validation = validateUserCreationForm(createForm, roleId);

      if (!validation.isValid) {
        validation.errors.forEach((error) => toast.error(error));
        return;
      }

      const formData = {
        ...createForm,
        roleId,
      };

      if (roleId === ROLE_IDS.MECHANIC) {
        formData.bossId = parseInt(formData.bossId);
      } else {
        delete formData.bossId;
      }

      await usersService.create(formData);
      clearCache('admin_users');
      clearCache('admin_bosses');
      toast.success("Usuario creado exitosamente");
      setShowCreateForm(false);
      window.dispatchEvent(new CustomEvent('app-refresh'));
      setCreateForm({
        name: "",
        lastName: "",
        cuil: "",
        email: "",
        password: "",
        roleId: ROLE_IDS.CLIENT,
        bossId: "",
      });
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating user");
    }
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find((u) => u.id === userId);
    const action = user?.active ? "desactivar" : "activar";

    if (!confirm(`¿Estás seguro de ${action} este usuario?`)) return;

    try {
      await usersService.delete(userId);
      clearCache('admin_users');
      clearCache('admin_bosses');
      toast.success(`Usuario ${action}do correctamente`);
      loadUsers();
      window.dispatchEvent(new CustomEvent('app-refresh'));
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Error al ${action} usuario`
      );
    }
  };

  const handleEditUser = (userItem) => {
    setEditingUser(userItem);
    setEditForm({
      name: userItem.name,
      lastName: userItem.lastName,
      cuil: userItem.cuil || "",
      email: userItem.email,
      password: "",
    });
    setShowEditForm(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updateData = {
        name: editForm.name,
        lastName: editForm.lastName,
        cuil: editForm.cuil,
        email: editForm.email,
      };

      if (editForm.password.trim()) {
        updateData.password = editForm.password;
      }

      await usersService.update(editingUser.id, updateData);
      clearCache('admin_users');
      clearCache('admin_bosses');
      toast.success("Usuario actualizado correctamente");
      setShowEditForm(false);
      setEditingUser(null);
      window.dispatchEvent(new CustomEvent('app-refresh'));
      loadUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al actualizar usuario"
      );
    }
  };

  const getUsersByRole = (roleId) => {
    console.log(
      "Filtrando usuarios por roleId:",
      roleId,
      "Total usuarios:",
      users.length
    );

    const filtered = users.filter((u) => {
      return u.role?.id === roleId;
    });
    console.log(
      "Usuarios filtrados para roleId",
      roleId,
      ":",
      filtered.length,
      "usuarios"
    );
    return filtered;
  };

  const getRoleName = (user) => {
    return user.role?.name || "Desconocido";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar roleBadge={true} showHistory={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios del sistema y busca vehículos
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xl">
                <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
                  Buscar Vehículo
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ingresa la patente del vehículo"
                    className="flex-1 px-4 py-2 h-11 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 text-black"
                  />
                  <button
                    onClick={doSearch}
                    className="px-6 h-11 bg-red-600 text-white font-medium rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-red-700 transition"
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
                        {searchResult.licensePlate} - {searchResult.brand}{" "}
                        {searchResult.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cliente: {searchResult.client?.user?.name}{" "}
                        {searchResult.client?.user?.lastName}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <div className="mb-8">
          <SegmentedControl
            options={[
              {
                value: "clientes",
                label: "Clientes",
                icon: <User className="h-4 w-4" />,
                count: getUsersByRole(1).length,
              },
              {
                value: "mecanicos",
                label: "Mecánicos",
                icon: <Wrench className="h-4 w-4" />,
                count: getUsersByRole(2).length,
              },
              {
                value: "jefes",
                label: "Jefes de Mecánicos",
                icon: <Users className="h-4 w-4" />,
                count: getUsersByRole(3).length,
              },
            ]}
            value={activeTab}
            onChange={setActiveTab}
            size="lg"
          />
        </div>

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setShowCreateForm(true)}
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Crear{" "}
            {activeTab === "clientes"
              ? "Cliente"
              : activeTab === "mecanicos"
                ? "Mecánico"
                : "Jefe de Mecánicos"}
          </Button>
        </div>

        {/* Formulario de creación */}
        {showCreateForm && (
          <Modal
            isOpen={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            size="lg"
          >
            <ModalHeader>
              <ModalTitle>
                Crear{" "}
                {activeTab === ROLE_NAMES.CLIENT
                  ? "Cliente"
                  : activeTab === ROLE_NAMES.MECHANIC
                    ? "Mecánico"
                    : "Jefe de Mecánicos"}
              </ModalTitle>
            </ModalHeader>
            <ModalContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <Input
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    placeholder="Nombre"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <Input
                    value={createForm.lastName}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, lastName: e.target.value })
                    }
                    placeholder="Apellido"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    CUIL
                  </label>
                  <Input
                    value={createForm.cuil}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, cuil: e.target.value })
                    }
                    placeholder="CUIL"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, email: e.target.value })
                    }
                    placeholder="Email"
                    type="email"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <Input
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, password: e.target.value })
                    }
                    placeholder="Contraseña"
                    type="password"
                    className="w-full"
                  />
                </div>
                {getRoleIdForActiveTab() === ROLE_IDS.MECHANIC && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jefe de Mecánicos *
                    </label>
                    <div className="relative">
                      <select
                        value={createForm.bossId}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            bossId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                      >
                        <option value="">
                          Selecciona un jefe de mecánicos
                        </option>
                        {bosses.map((boss) => (
                          <option key={boss.id} value={boss.id}>
                            {boss.user.name} {boss.user.lastName}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ModalContent>
            <ModalFooter>
              <Button onClick={() => setShowCreateForm(false)} variant="ghost">
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} variant="primary">
                Crear
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Formulario de edición */}
        {showEditForm && (
          <Modal
            isOpen={showEditForm}
            onClose={() => {
              setShowEditForm(false);
              setEditingUser(null);
            }}
            size="lg"
          >
            <ModalHeader>
              <ModalTitle>Editar {getRoleName(editingUser)}</ModalTitle>
            </ModalHeader>
            <ModalContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <Input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Nombre"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <Input
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    placeholder="Apellido"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    CUIL
                  </label>
                  <Input
                    value={editForm.cuil}
                    onChange={(e) =>
                      setEditForm({ ...editForm, cuil: e.target.value })
                    }
                    placeholder="CUIL"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="Email"
                    type="email"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nueva contraseña (opcional)
                  </label>
                  <Input
                    value={editForm.password}
                    onChange={(e) =>
                      setEditForm({ ...editForm, password: e.target.value })
                    }
                    placeholder="Nueva contraseña"
                    type="password"
                    className="w-full"
                  />
                </div>
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
              <Button onClick={handleUpdateUser} variant="primary">
                Actualizar
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Lista de usuarios */}
        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner text="Cargando usuarios..." />
          ) : getUsersByRole(
            activeTab === "clientes" ? 1 : activeTab === "mecanicos" ? 2 : 3
          ).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay {activeTab} registrados
                </h3>
                <p className="text-gray-600">
                  Crea el primer{" "}
                  {activeTab === "clientes"
                    ? "cliente"
                    : activeTab === "mecanicos"
                      ? "mecánico"
                      : "jefe de mecánicos"}{" "}
                  para comenzar
                </p>
              </CardContent>
            </Card>
          ) : (
            getUsersByRole(
              activeTab === "clientes" ? 1 : activeTab === "mecanicos" ? 2 : 3
            ).map((userItem) => (
              <Card key={userItem.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${userItem.active ? "bg-green-100" : "bg-red-100"
                            }`}
                        >
                          <User
                            className={`h-6 w-6 ${userItem.active
                                ? "text-green-600"
                                : "text-red-600"
                              }`}
                          />
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
                          <Badge
                            variant={userItem.active ? "success" : "danger"}
                          >
                            {userItem.active ? "Activo" : "Inactivo"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {getRoleName(userItem)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() => handleViewUserDetails(userItem)}
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
                        {userItem.active ? "Desactivar" : "Activar"}
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
          <Modal
            isOpen={!!showUserDetails}
            onClose={() => setShowUserDetails(null)}
            size="lg"
          >
            <ModalHeader>
              <ModalTitle>
                Detalles de {getRoleName(showUserDetails)}
              </ModalTitle>
            </ModalHeader>
            <ModalContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center ${showUserDetails.active ? "bg-green-100" : "bg-red-100"
                      }`}
                  >
                    <User
                      className={`h-8 w-8 ${showUserDetails.active
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {showUserDetails.name} {showUserDetails.lastName}
                    </h3>
                    <p className="text-gray-600">
                      {getRoleName(showUserDetails)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            Email
                          </p>
                          <p className="text-gray-900 break-words">
                            {showUserDetails.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 mt-3">
                        <Shield className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            CUIL
                          </p>
                          <p className="text-gray-900 break-words">
                            {showUserDetails.cuil || "No especificado"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 mt-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            Teléfono
                          </p>
                          <p className="text-gray-900 break-words">
                            {showUserDetails.phone || "No especificado"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 mt-3">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            Fecha de creación
                          </p>
                          <p className="text-gray-900 break-words">
                            {new Date(
                              showUserDetails.createdAt
                            ).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role-specific information */}
                {showUserDetails.role?.id === ROLE_IDS.CLIENT &&
                  showUserDetails.client?.cars && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Vehículos Registrados
                      </h4>
                      {showUserDetails.client.cars.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {showUserDetails.client.cars.map((car) => (
                            <div
                              key={car.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <Car className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-900 truncate">
                                    {car.licensePlate}
                                  </p>
                                  <p className="text-sm text-gray-600 truncate">
                                    {car.brand} {car.model}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="secondary"
                                className="flex-shrink-0 ml-2"
                              >
                                {car.status?.name || "Desconocido"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No hay vehículos registrados para este cliente.
                        </p>
                      )}
                    </div>
                  )}

                {showUserDetails.role?.id === ROLE_IDS.MECHANIC &&
                  showUserDetails.mechanic?.boss && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Jefe de Mecánicos
                      </h4>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {showUserDetails.mechanic.boss.user.name}{" "}
                            {showUserDetails.mechanic.boss.user.lastName}
                          </p>
                          <p className="text-sm text-gray-600 break-words">
                            {showUserDetails.mechanic.boss.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {showUserDetails.role?.id === ROLE_IDS.MECHANIC &&
                  !showUserDetails.mechanic?.boss && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Jefe de Mecánicos
                      </h4>
                      <p className="text-gray-600">
                        Este mecánico no tiene un jefe asignado.
                      </p>
                    </div>
                  )}

                {showUserDetails.role?.id === ROLE_IDS.BOSS &&
                  showUserDetails.boss?.mechanics?.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Mecánicos a Cargo
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {showUserDetails.boss.mechanics.map((mechanic) => (
                          <div
                            key={mechanic.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                              <Wrench className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 truncate">
                                  {mechanic.user.name} {mechanic.user.lastName}
                                </p>
                                <p className="text-sm text-gray-600 break-words">
                                  {mechanic.user.email}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                mechanic.user.active ? "success" : "danger"
                              }
                              className="flex-shrink-0"
                            >
                              {mechanic.user.active ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {showUserDetails.role?.id === ROLE_IDS.BOSS &&
                  (!showUserDetails.boss?.mechanics ||
                    showUserDetails.boss.mechanics.length === 0) && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Mecánicos a Cargo
                      </h4>
                      <p className="text-gray-600">
                        Este jefe no tiene mecánicos asignados.
                      </p>
                    </div>
                  )}

                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    {showUserDetails.active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-700">
                        Estado:
                      </p>
                      <Badge
                        variant={showUserDetails.active ? "success" : "danger"}
                      >
                        {showUserDetails.active
                          ? "Usuario Activo"
                          : "Usuario Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button onClick={() => setShowUserDetails(null)} variant="ghost">
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
