const API_BASE_URL = 'http://localhost:8082';

export const salesService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener ventas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Crear una venta
  create: async (saleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear venta');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Actualizar una venta
  update: async (codeSale, saleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update/${codeSale}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar venta');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Eliminar una venta
  delete: async (codeSale) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${codeSale}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar venta');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Verificar si una venta existe
  checkExists: async (codeSale) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checksale/${codeSale}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al verificar venta');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Validar valores de venta
  validateValues: async (codeSale, valueSale, totalSale) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checksale/values?codeSale=${codeSale}&valueSale=${valueSale}&totalSale=${totalSale}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al validar valores de venta');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
};