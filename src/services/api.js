import axios from 'axios';

// Crear instancia de axios
export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios específicos
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

export const usersService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getMechanics: () => api.get('/users/mechanics/list'),
  getBosses: () => api.get('/users/bosses/list'),
  assignBossToMechanic: (mechanicId, bossId) => api.put(`/users/mechanics/${mechanicId}/assign-boss`, { bossId }),
  getClients: () => api.get('/users/clients/list'),
  changePassword: (id, data) => api.put(`/users/${id}/change-password`, data),
};

export const carsService = {
  getAll: () => api.get('/cars'),
  getById: (id) => api.get(`/cars/${id}`),
  getByPlate: (plate) => api.get(`/cars/plate/${plate}`),
  getByClient: (clientId) => api.get(`/cars/client/${clientId}`),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
  getByStatus: (statusId) => api.get(`/cars/status/${statusId}`),
};

export const repairsService = {
  getAll: () => api.get('/repairs'),
  getById: (id) => api.get(`/repairs/${id}`),
  create: (data) => api.post('/repairs', data),
  update: (id, data) => api.put(`/repairs/${id}`, data),
  delete: (id) => api.delete(`/repairs/${id}`),
  getByCar: (carId) => api.get(`/repairs/car/${carId}`),
  getByMechanic: (mechanicId) => api.get(`/repairs/mechanic/${mechanicId}`),
};

export const paymentsService = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
  getByRepair: (repairId) => api.get(`/payments/repair/${repairId}`),
  getByClient: (clientId) => api.get(`/payments/client/${clientId}`),
  getByStatus: (status) => api.get(`/payments/status/${status}`),
};

export const requestsService = {
  create: (data) => api.post('/requests', data),
  getByBoss: (bossId) => api.get(`/requests/boss/${bossId}`),
  getByMechanic: (mechanicId) => api.get(`/requests/mechanic/${mechanicId}`),
  getByClient: (clientId) => api.get(`/requests/client/${clientId}`),
  assignMechanic: (id, mechanicId) => api.put(`/requests/${id}/assign`, { mechanicId }),
  updateStatus: (id, data) => api.put(`/requests/${id}/status`, data),
};

export default api;
