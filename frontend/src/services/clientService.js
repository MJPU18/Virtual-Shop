const API_BASE_URL = 'http://localhost:8085'; 

export const clientService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Crear un cliente
  create: async (client) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear cliente');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Actualizar un cliente
  update: async (documentId, client) => {
    try {
      const response = await fetch(`${API_BASE_URL}/updatebydocumentid/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar cliente');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Eliminar un cliente
  delete: async (documentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deletebydocumentid/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar cliente');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Verificar si un cliente existe
  checkExists: async (documentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkclient/${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al verificar cliente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
};