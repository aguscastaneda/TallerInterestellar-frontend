import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/api';
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui';
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Save, 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff,
  Settings,
  KeyRound
} from 'lucide-react';

const UserConfiguration = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Formulario de datos personales
  const [profileForm, setProfileForm] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    cuil: ''
  });

  // Formulario de cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        cuil: user.cuil || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Validar campos requeridos
      if (!profileForm.name || !profileForm.lastName || !profileForm.email) {
        toast.error('Nombre, apellido y email son campos obligatorios');
        return;
      }

      const response = await usersService.update(user.id, profileForm);
      
      if (response.data.success) {
        // Actualizar datos del usuario en el contexto
        updateUser(response.data.data);
        toast.success('Perfil actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Validaciones
      if (!passwordForm.currentPassword) {
        toast.error('Debe ingresar la contraseña actual');
        return;
      }

      if (!passwordForm.newPassword) {
        toast.error('Debe ingresar la nueva contraseña');
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        toast.error('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('Las contraseñas nuevas no coinciden');
        return;
      }

      const response = await usersService.changePassword(user.id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (response.data.success) {
        toast.success('Contraseña cambiada exitosamente');
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswords({
          current: false,
          new: false,
          confirm: false
        });
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      toast.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar roleBadge={true} showHistory={false} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Configuración de Usuario
            </h1>
            <p className="text-gray-600">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Información Personal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <Input
                    value={profileForm.name}
                    onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                    placeholder="Ingrese su nombre"
                    leftIcon={<User className="h-4 w-4" />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <Input
                    value={profileForm.lastName}
                    onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                    placeholder="Ingrese su apellido"
                    leftIcon={<User className="h-4 w-4" />}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  value={profileForm.email}
                  onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                  placeholder="Ingrese su email"
                  type="email"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <Input
                  value={profileForm.phone}
                  onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                  placeholder="Ingrese su teléfono"
                  leftIcon={<Phone className="h-4 w-4" />}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CUIL
                </label>
                <Input
                  value={profileForm.cuil}
                  onChange={e => setProfileForm({...profileForm, cuil: e.target.value})}
                  placeholder="Ingrese su CUIL"
                  leftIcon={<FileText className="h-4 w-4" />}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleProfileUpdate}
                loading={loading}
                leftIcon={<Save className="h-4 w-4" />}
                className="w-full"
              >
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-red-600" />
                <span>Seguridad</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Contraseña</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Cambia tu contraseña para mantener tu cuenta segura
                  </p>
                  <Button
                    onClick={() => setShowPasswordModal(true)}
                    variant="secondary"
                    leftIcon={<KeyRound className="h-4 w-4" />}
                    className="w-full"
                  >
                    Cambiar Contraseña
                  </Button>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Información de Cuenta</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Rol:</span>
                      <span className="font-medium text-blue-900">{user?.role?.name || 'No asignado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Estado:</span>
                      <span className="font-medium text-blue-900">
                        {user?.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Fecha de registro:</span>
                      <span className="font-medium text-blue-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'No disponible'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de cambio de contraseña */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} size="md">
        <ModalHeader onClose={() => setShowPasswordModal(false)}>
          <ModalTitle className="flex items-center space-x-2">
            <KeyRound className="h-5 w-5 text-red-600" />
            <span>Cambiar Contraseña</span>
          </ModalTitle>
        </ModalHeader>
        
        <ModalContent>
          <div className="space-y-4">
            {/* Contraseña actual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual *
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  placeholder="Ingrese su contraseña actual"
                  leftIcon={<Lock className="h-4 w-4" />}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña *
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  placeholder="Ingrese la nueva contraseña"
                  leftIcon={<Lock className="h-4 w-4" />}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Repetir nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repetir Nueva Contraseña *
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  placeholder="Repita la nueva contraseña"
                  leftIcon={<Lock className="h-4 w-4" />}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Validación visual */}
            {passwordForm.newPassword && passwordForm.confirmPassword && (
              <div className="text-sm">
                {passwordForm.newPassword === passwordForm.confirmPassword ? (
                  <p className="text-green-600 flex items-center space-x-1">
                    <span>✓</span>
                    <span>Las contraseñas coinciden</span>
                  </p>
                ) : (
                  <p className="text-red-600 flex items-center space-x-1">
                    <span>✗</span>
                    <span>Las contraseñas no coinciden</span>
                  </p>
                )}
              </div>
            )}

            {/* Botón ¿Olvidaste tu contraseña? */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  navigate('/forgot-password');
                }}
                className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200 font-medium flex items-center space-x-1"
              >
                <KeyRound className="h-4 w-4" />
                <span>¿Olvidaste tu contraseña?</span>
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Recibirás un enlace para restablecer tu contraseña
              </p>
            </div>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePasswordChange}
              loading={loading}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Cambiar Contraseña
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserConfiguration;