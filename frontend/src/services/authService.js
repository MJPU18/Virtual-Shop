const API_BASE_URL = 'http://localhost:8086';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/login/${username}/${password}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        throw new Error('Credenciales inválidas');
      }

      if (!response.ok) {
        throw new Error('Error en la autenticación');
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },
};