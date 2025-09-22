const API_BASE_URL = 'http://localhost:8084/product';

export const productService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Crear un producto
  create: async (product) => {
    try {
      // Mapear los campos del frontend al backend
      const productData = {
        productName: product.nombre,
        providerNit: product.nitProveedor, // Ya es un número
        purchasePrice: product.precioCompra,
        ivaPurchase: product.ivaPurchase,
        salePrice: product.precioVenta
      };

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear producto');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Actualizar un producto
  update: async (productCode, product) => {
    try {
      const productData = {
        productName: product.nombre,
        providerNit: product.nitProveedor, // Ya es un número
        purchasePrice: product.precioCompra,
        ivaPurchase: product.ivaPurchase,
        salePrice: product.precioVenta
      };

      const response = await fetch(`${API_BASE_URL}/update/${productCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar producto');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Eliminar un producto
  delete: async (productCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${productCode}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar producto');
      }

      return await response.text();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  },

  // Verificar si un producto existe
  checkExists: async (productCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkproduct/${productCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al verificar producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
};