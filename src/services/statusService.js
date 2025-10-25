/**
 * Servicio unificado para manejo de estados del sistema
 * Centraliza toda la lógica de estados para evitar inconsistencias
 */

class StatusService {
  constructor() {
    this.statusConfig = null;
  }

  /**
   * Inicializa el servicio con la configuración del sistema
   * @param {Object} config - Configuración del sistema desde el backend
   */
  initialize(config) {
    this.statusConfig = config;
  }

  /**
   * Obtiene el nombre de un estado por su ID
   * @param {number} statusId - ID del estado
   * @returns {string} Nombre del estado
   */
  getStatusName(statusId) {
    if (!this.statusConfig?.carStatuses) {
      return 'Sin estado';
    }

    const status = this.statusConfig.carStatuses.find(s => s.id === statusId);
    return status?.name || 'Sin estado';
  }

  /**
   * Obtiene el color de un estado por su ID
   * @param {number} statusId - ID del estado
   * @returns {string} Clases CSS del color
   */
  getStatusColor(statusId) {
    if (!this.statusConfig?.carStatuses) {
      return 'bg-gray-100 text-gray-800';
    }

    const status = this.statusConfig.carStatuses.find(s => s.id === statusId);
    return status?.color || 'bg-gray-100 text-gray-800';
  }

  /**
   * Obtiene el color de tab de un estado por su ID
   * @param {number} statusId - ID del estado
   * @returns {string} Clases CSS del color de tab
   */
  getStatusTabColor(statusId) {
    if (!this.statusConfig?.carStatuses) {
      return 'bg-gray-500 hover:bg-gray-600';
    }

    const status = this.statusConfig.carStatuses.find(s => s.id === statusId);
    return status?.tabColor || 'bg-gray-500 hover:bg-gray-600';
  }

  /**
   * Obtiene el icono apropiado para un estado
   * @param {number} statusId - ID del estado
   * @returns {string} Nombre del icono
   */
  getStatusIcon(statusId) {
    const iconMap = {
      1: 'Car', // Entrada
      2: 'Clock', // Pendiente
      3: 'Eye', // En revisión
      4: 'X', // Rechazado
      5: 'Wrench', // En reparación
      6: 'CheckCircle', // Finalizado
      7: 'CheckCircle', // Entregado
      8: 'X' // Cancelado
    };

    return iconMap[statusId] || 'AlertCircle';
  }

  /**
   * Verifica si un estado es terminal (no puede cambiar)
   * @param {number} statusId - ID del estado
   * @returns {boolean} True si es terminal
   */
  isTerminalStatus(statusId) {
    const terminalStatuses = [4, 7, 8]; // Rechazado, Entregado, Cancelado
    return terminalStatuses.includes(statusId);
  }

  /**
   * Verifica si un estado permite transiciones
   * @param {number} statusId - ID del estado
   * @returns {boolean} True si permite transiciones
   */
  allowsTransitions(statusId) {
    return !this.isTerminalStatus(statusId);
  }

  /**
   * Obtiene los estados disponibles para transición desde un estado dado
   * @param {number} currentStatusId - Estado actual
   * @returns {Array} Array de estados disponibles
   */
  getAvailableTransitions(currentStatusId) {
    const transitions = {
      1: [2, 4, 8], // Entrada -> Pendiente, Rechazado, Cancelado
      2: [3, 4, 8], // Pendiente -> En revisión, Rechazado, Cancelado
      3: [4, 5, 8], // En revisión -> Rechazado, En reparación, Cancelado
      5: [6, 8], // En reparación -> Finalizado, Cancelado
      6: [7, 8] // Finalizado -> Entregado, Cancelado
    };

    return transitions[currentStatusId] || [];
  }

  /**
   * Valida si una transición de estado es válida
   * @param {number} fromStatusId - Estado origen
   * @param {number} toStatusId - Estado destino
   * @returns {boolean} True si la transición es válida
   */
  isValidTransition(fromStatusId, toStatusId) {
    const availableTransitions = this.getAvailableTransitions(fromStatusId);
    return availableTransitions.includes(toStatusId);
  }

  /**
   * Obtiene información completa de un estado
   * @param {number} statusId - ID del estado
   * @returns {Object} Información completa del estado
   */
  getStatusInfo(statusId) {
    return {
      id: statusId,
      name: this.getStatusName(statusId),
      color: this.getStatusColor(statusId),
      tabColor: this.getStatusTabColor(statusId),
      icon: this.getStatusIcon(statusId),
      isTerminal: this.isTerminalStatus(statusId),
      allowsTransitions: this.allowsTransitions(statusId),
      availableTransitions: this.getAvailableTransitions(statusId)
    };
  }

  /**
   * Obtiene todos los estados del sistema
   * @returns {Array} Array con información de todos los estados
   */
  getAllStatuses() {
    if (!this.statusConfig?.carStatuses) {
      return [];
    }

    return this.statusConfig.carStatuses.map(status => this.getStatusInfo(status.id));
  }

  /**
   * Filtra elementos por estado
   * @param {Array} items - Array de elementos a filtrar
   * @param {number} statusId - ID del estado para filtrar
   * @returns {Array} Elementos filtrados
   */
  filterByStatus(items, statusId) {
    if (statusId === 'all' || statusId === null || statusId === undefined) {
      return items;
    }

    return items.filter(item => item.statusId === statusId);
  }

  /**
   * Cuenta elementos por estado
   * @param {Array} items - Array de elementos a contar
   * @param {number} statusId - ID del estado para contar
   * @returns {number} Cantidad de elementos
   */
  countByStatus(items, statusId) {
    const filtered = this.filterByStatus(items, statusId);
    return filtered.length;
  }
}


const statusService = new StatusService();

export default statusService;
