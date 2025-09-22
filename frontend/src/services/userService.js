const API_BASE_URL = 'http://localhost:8086';

export const userService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Crear un usuario
  create: async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear usuario');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Actualizar un usuario
  update: async (documentId, user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/updatebydocumentid/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar usuario');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Eliminar un usuario
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
        throw new Error(errorText || 'Error al eliminar usuario');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Verificar si un usuario existe
  checkExists: async (documentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkuser/${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al verificar usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
};