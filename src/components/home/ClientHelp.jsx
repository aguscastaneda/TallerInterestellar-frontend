import { useState } from 'react';
import NavBar from '../NavBar';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../ui';
import { 
  Car, 
  Wrench, 
  FileText, 
  History, 
  Plus, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  Info,
  CreditCard,
  UserCheck
} from 'lucide-react';

const ClientHelp = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Resumen General', icon: BookOpen },
    { id: 'patentes', title: 'Mis Patentes', icon: Car },
    { id: 'solicitar', title: 'Solicitar Servicio', icon: Wrench },
    { id: 'arreglos', title: 'Mis Arreglos', icon: FileText },
    { id: 'historial', title: 'Historial y Pagos', icon: History },
    { id: 'problemas', title: 'Problemas Comunes', icon: AlertTriangle }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Manual del Cliente
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Esta guía te ayudará a navegar todas las funcionalidades disponibles 
                en tu panel de cliente del taller interestelar.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    <span>Gestión de Vehículos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Registra y administra todos tus vehículos en un solo lugar.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Registrar nuevas patentes</li>
                    <li>• Ver detalles de tus vehículos</li>
                    <li>• Consultar estado actual</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5 text-green-600" />
                    <span>Solicitar Servicios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Solicita atención para tus vehículos de manera fácil y rápida.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Descripción detallada del problema</li>
                    <li>• Selección de mecánico preferido</li>
                    <li>• Seguimiento en tiempo real</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Control de Trabajos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Supervisa el progreso de todos tus trabajos solicitados.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Estados de trabajo en tiempo real</li>
                    <li>• Comunicación con mecánicos</li>
                    <li>• Historial completo de servicios</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-yellow-600" />
                    <span>Pagos y Facturación</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Gestiona tus pagos y revisa tu historial financiero.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Pagos pendientes</li>
                    <li>• Historial de transacciones</li>
                    <li>• Facturación detallada</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'patentes':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Patentes</h2>
                <p className="text-gray-600">Administra todos tus vehículos registrados</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Registrar Nueva Patente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Para agregar un nuevo vehículo a tu cuenta:
                  </p>
                  
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Haz clic en el botón <Badge variant="primary">Registrar Patente</Badge></li>
                    <li>2. Completa la información del vehículo</li>
                    <li>3. Verifica que los datos sean correctos</li>
                    <li>4. Tu vehículo aparecerá en la lista &quot;Mis Patentes&quot;</li>
                  </ol>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Información requerida:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• <strong>Patente:</strong> Número de identificación único</li>
                      <li>• <strong>Marca:</strong> Fabricante del vehículo</li>
                      <li>• <strong>Modelo:</strong> Modelo específico</li>
                      <li>• <strong>Año:</strong> Año de fabricación (opcional)</li>
                      <li>• <strong>Color:</strong> Color del vehículo (opcional)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'solicitar':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Solicitar Servicio</h2>
                <p className="text-gray-600">Proceso para solicitar atención mecánica</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>Cómo Solicitar un Mecánico</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Para solicitar atención mecánica para tu vehículo:
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Pasos a seguir:</h4>
                    <ol className="space-y-1 text-sm text-blue-800">
                      <li>1. Selecciona el vehículo desde &quot;Mis Patentes&quot;</li>
                      <li>2. Haz clic en &quot;Solicitar Mecánico&quot;</li>
                      <li>3. Describe detalladamente el problema</li>
                      <li>4. Opcionalmente, selecciona un mecánico preferido</li>
                      <li>5. Confirma tu solicitud</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Importante:</h4>
                    <p className="text-sm text-yellow-800">
                      No podrás solicitar un nuevo servicio si tu vehículo tiene un trabajo 
                      &quot;En Espera&quot; o &quot;En Reparación&quot;. Debes esperar a que el proceso actual finalice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'arreglos':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mis Arreglos</h2>
                <p className="text-gray-600">Seguimiento de todos tus trabajos solicitados</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Estados de Trabajo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>En Espera</span>
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Tu solicitud fue recibida y está esperando asignación de mecánico.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                        <Wrench className="h-4 w-4" />
                        <span>En Reparación</span>
                      </h4>
                      <p className="text-sm text-blue-800">
                        Un mecánico está trabajando activamente en tu vehículo.
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Reparado</span>
                      </h4>
                      <p className="text-sm text-green-800">
                        El trabajo fue completado y tu vehículo está listo para retirar.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Entregado</span>
                      </h4>
                      <p className="text-sm text-gray-800">
                        El servicio fue completado y tu vehículo fue entregado.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'historial':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <History className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Historial y Pagos</h2>
                <p className="text-gray-600">Revisa tu historial completo y gestiona tus pagos</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Gestión de Pagos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Pagos Pendientes</h4>
                      <p className="text-sm text-red-800">
                        Servicios completados que aún no han sido pagados.
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Pagos Realizados</h4>
                      <p className="text-sm text-green-800">
                        Historial completo de todos los pagos efectuados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'problemas':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Problemas Comunes</h2>
                <p className="text-gray-600">Soluciones a situaciones frecuentes</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>No puedo registrar mi patente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Si tienes problemas para registrar tu vehículo:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>Patente única:</strong> Verifica que la patente no esté ya registrada</li>
                    <li>• <strong>Formato correcto:</strong> Asegúrate de escribir la patente sin espacios</li>
                    <li>• <strong>Campos obligatorios:</strong> Completa patente, marca y modelo</li>
                    <li>• <strong>Conexión:</strong> Verifica tu conexión a internet</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span>Contacto de Soporte</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Si continúas teniendo problemas, contacta al administrador del sistema 
                    o al equipo de soporte técnico para obtener ayuda adicional.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            Centro de Ayuda
          </h1>
          <p className="text-gray-600">
            Manual completo para clientes
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Contenido</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-150 ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHelp;


