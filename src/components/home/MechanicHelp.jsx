import { useState } from 'react';
import NavBar from '../NavBar';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../ui';
import {
  HelpCircle,
  Wrench,
  Search,
  Play,
  Square,
  Eye,
  Clock,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Info,
  Car,
  DollarSign,
  FileText
} from 'lucide-react';

const MechanicHelp = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Resumen General', icon: BookOpen },
    { id: 'trabajos', title: 'Gestión de Trabajos', icon: Wrench },
    { id: 'busqueda', title: 'Búsqueda de Vehículos', icon: Search },
    { id: 'estados', title: 'Estados de Trabajo', icon: CheckCircle },
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
                Manual del Mecánico
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Esta guía te ayudará a navegar y utilizar todas las funcionalidades
                disponibles en tu panel de mecánico para gestionar eficientemente tus trabajos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <span>Gestión de Trabajos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Administra todos tus trabajos asignados desde pendientes hasta completados.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Ver trabajos pendientes asignados</li>
                    <li>• Iniciar trabajos en proceso</li>
                    <li>• Finalizar trabajos completados</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-green-600" />
                    <span>Búsqueda de Vehículos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Busca información de cualquier vehículo por su patente.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Búsqueda por patente exacta</li>
                    <li>• Información del cliente</li>
                    <li>• Historial del vehículo</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'trabajos':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Trabajos</h2>
                <p className="text-gray-600">Administra el ciclo completo de tus trabajos asignados</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span>Trabajos Pendientes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Aquí encontrarás todos los trabajos que te han sido asignados y están listos para comenzar.
                  </p>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Iniciar Trabajo</span>
                    </h4>
                    <p className="text-sm text-yellow-800">
                      Haz clic en "Comenzar" para marcar el trabajo como en proceso y empezar a trabajar en él.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <span>Trabajos En Proceso</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Trabajos que actualmente estás realizando. Puedes finalizarlos cuando estén completos.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                      <Square className="h-4 w-4" />
                      <span>Finalizar Trabajo</span>
                    </h4>
                    <p className="text-sm text-blue-800">
                      Al finalizar, debes proporcionar una descripción detallada del arreglo realizado y el costo final.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Trabajos Finalizados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Historial de todos los trabajos que has completado exitosamente.
                  </p>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Ver Detalles</span>
                    </h4>
                    <p className="text-sm text-green-800">
                      Puedes revisar los detalles completos incluyendo las especificaciones del arreglo y el costo final.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'busqueda':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Búsqueda de Vehículos</h2>
                <p className="text-gray-600">Encuentra información rápida de cualquier vehículo</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Cómo Buscar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    La función de búsqueda te permite encontrar información detallada de cualquier vehículo registrado en el sistema.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold mt-0.5">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Ingresa la Patente</h4>
                        <p className="text-sm text-gray-600">Escribe la patente exacta del vehículo en el campo de búsqueda.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold mt-0.5">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Haz Clic en Buscar</h4>
                        <p className="text-sm text-gray-600">Presiona el botón rojo "Buscar" para ejecutar la búsqueda.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold mt-0.5">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Revisa los Resultados</h4>
                        <p className="text-sm text-gray-600">Si el vehículo existe, verás su información y datos del cliente.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    <span>Información Mostrada</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Cuando encuentres un vehículo, verás la siguiente información:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>Patente:</strong> Identificación única del vehículo</li>
                    <li>• <strong>Marca y Modelo:</strong> Información del fabricante</li>
                    <li>• <strong>Cliente:</strong> Nombre completo del propietario</li>
                    <li>• <strong>Contacto:</strong> Información de contacto del cliente</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'estados':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Estados de Trabajo</h2>
                <p className="text-gray-600">Comprende el flujo de estados de los trabajos</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Flujo de Estados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Badge variant="warning" size="lg">
                        <Clock className="h-4 w-4" />
                        <span className="ml-1">Pendiente</span>
                      </Badge>
                      <div>
                        <h4 className="font-semibold text-gray-900">Trabajo Asignado</h4>
                        <p className="text-sm text-gray-600">El jefe te ha asignado este trabajo. Está listo para comenzar.</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="h-8 w-0.5 bg-gray-300"></div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Badge variant="info" size="lg">
                        <Wrench className="h-4 w-4" />
                        <span className="ml-1">En Proceso</span>
                      </Badge>
                      <div>
                        <h4 className="font-semibold text-gray-900">Trabajando</h4>
                        <p className="text-sm text-gray-600">Has comenzado el trabajo y está en progreso.</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="h-8 w-0.5 bg-gray-300"></div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <Badge variant="success" size="lg">
                        <CheckCircle className="h-4 w-4" />
                        <span className="ml-1">Finalizado</span>
                      </Badge>
                      <div>
                        <h4 className="font-semibold text-gray-900">Trabajo Completado</h4>
                        <p className="text-sm text-gray-600">Has terminado el trabajo con descripción y costo final.</p>
                      </div>
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
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span>No veo mis trabajos asignados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">Si no aparecen tus trabajos asignados:</p>
                    <ul className="space-y-2 text-sm text-gray-600 ml-4">
                      <li>• Verifica que estés en la pestaña correcta (Pendientes, En Proceso, Finalizados)</li>
                      <li>• Recarga la página presionando F5</li>
                      <li>• Contacta a tu jefe de mecánicos para verificar las asignaciones</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Error al buscar vehículo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">Si aparece "Patente inexistente":</p>
                    <ul className="space-y-2 text-sm text-gray-600 ml-4">
                      <li>• Verifica que la patente esté escrita correctamente</li>
                      <li>• Asegúrate de usar el formato correcto (ej: ABC123)</li>
                      <li>• El vehículo debe estar registrado en el sistema</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span>No puedo finalizar un trabajo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">Para finalizar correctamente un trabajo:</p>
                    <ul className="space-y-2 text-sm text-gray-600 ml-4">
                      <li>• La descripción del arreglo es obligatoria y debe ser detallada</li>
                      <li>• El costo debe ser un número válido (ej: 150.50)</li>
                      <li>• Ambos campos son requeridos para completar el trabajo</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <Info className="h-5 w-5" />
                    <span>Consejos Adicionales</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Sé detallado:</strong> Proporciona descripciones claras de los arreglos realizados</li>
                      <li>• <strong>Verifica costos:</strong> Asegúrate de que el costo sea preciso antes de finalizar</li>
                      <li>• <strong>Comunícate:</strong> Si tienes dudas, consulta con tu jefe de mecánicos</li>
                      <li>• <strong>Mantén actualizado:</strong> Actualiza el estado de tus trabajos regularmente</li>
                    </ul>
                  </div>
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
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => window.history.back()}
            className="mb-4"
          >
            Volver al Panel
          </Button>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Centro de Ayuda - Mecánico
            </h1>
            <p className="text-gray-600">
              Encuentra respuestas y guías para usar tu panel de mecánico efectivamente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Secciones de Ayuda</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-700'
                          }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicHelp;