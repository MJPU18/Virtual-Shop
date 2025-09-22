// src/services/providerService.js
const API_BASE_URL = 'http://localhost:8083'; // Puerto del backend de proveedores

export const providerService = {
  // Obtener todos los proveedores
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener proveedores');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Crear un proveedor
  create: async (provider) => {
    try {
      // Mapear los campos del frontend al backend
      const providerData = {
        nitprovider: parseInt(provider.nit),
        providerName: provider.nombre,
        providerAddress: provider.direccion,
        providerPhone: parseInt(provider.telefono),
        providerCity: provider.ciudad
      };

      const response = await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear proveedor');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Actualizar un proveedor
  update: async (id, provider) => {
    try {
      // El backend espera un objeto con los campos del record UpdateProvider
      const updateData = {
        provider_city: provider.ciudad,
        provider_address: provider.direccion,
        provider_name: provider.nombre,
        provider_phone: parseInt(provider.telefono)
      };

      const response = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar proveedor');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Eliminar un proveedor
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar proveedor');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Verificar si un proveedor existe
  checkExists: async (nitprovider) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkprovider/${nitprovider}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al verificar proveedor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
};