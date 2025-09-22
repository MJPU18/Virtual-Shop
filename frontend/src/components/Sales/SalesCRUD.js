import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { salesService } from '../../services/salesService';
import { clientService } from '../../services/clientService';
import { productService } from '../../services/productService';
import './SalesCRUD.css';

const SalesCRUD = ({ currentUser }) => {
  const [sales, setSales] = useState([]);
  const [sale, setSale] = useState({
    products: [],
    currentProduct: {}
  });
  const [saleDialog, setSaleDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const toast = useRef(null);

  useEffect(() => {
    loadSales();
    loadClients();
    loadProducts();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const salesData = await salesService.getAll();
      setSales(salesData);
    } catch (error) {
      showError('Error al cargar ventas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const clientsData = await clientService.getAll();
      
      const formattedClients = clientsData.map(client => ({
        id: client.documentId,
        cedula: client.documentId.toString(),
        nombre: client.fullName || client.userName || `Cliente ${client.documentId}`
      }));
      
      setClients(formattedClients);
    } catch (error) {
      showError('Error al cargar clientes: ' + error.message);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const productsData = await productService.getAll();
      
      const formattedProducts = productsData.map(product => ({
        id: product.productCode,
        codigo: product.productCode,
        nombre: product.productName,
        precioVenta: product.salePrice,
        iva: product.ivaPurchase
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      showError('Error al cargar productos: ' + error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000
    });
  };

  const openNew = () => {
    setSale({
      codeSale: null,
      idClient: '',
      idUser: currentUser ? currentUser.documentId : null,
      products: [],
      currentProduct: {},
      ivaSale: 0,
      totalSale: 0,
      valueSale: 0
    });
    setSubmitted(false);
    setSaleDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setSaleDialog(false);
  };

  const saveSale = async () => {
    setSubmitted(true);

    if (sale.idClient && sale.products.length > 0) {
      try {
        // Preparar datos para el backend - ahora enviamos el objeto Sale completo
        const saleData = {
          codeSale: null, // Se asigna en el backend
          idClient: parseInt(sale.idClient),
          idUser: sale.idUser,
          ivaSale: sale.ivaSale, // Valor absoluto del IVA calculado en frontend
          totalSale: sale.totalSale, // Total con IVA calculado en frontend
          valueSale: sale.valueSale // Valor base sin IVA
        };

        console.log('Datos enviados al backend:', saleData);

        await salesService.create(saleData);
        showSuccess('Venta registrada correctamente');
        
        await loadSales();
        setSaleDialog(false);
        setSale({ products: [], currentProduct: {} });
      } catch (error) {
        showError('Error al guardar venta: ' + error.message);
      }
    }
  };

  const deleteSale = async (sale) => {
    try {
      await salesService.delete(sale.codeSale);
      showSuccess('Venta eliminada correctamente');
      await loadSales();
    } catch (error) {
      showError('Error al eliminar venta: ' + error.message);
    }
  };

  const findClient = (cedula) => {
    return clients.find(client => client.cedula === cedula);
  };

  const findProduct = (codigo) => {
    const codigoNum = parseInt(codigo);
    return products.find(product => product.codigo === codigoNum);
  };

  const handleClientSearch = (cedula) => {
    const client = findClient(cedula);
    if (client) {
      setSale({...sale, idClient: client.cedula, clientName: client.nombre});
    } else {
      setSale({...sale, idClient: cedula, clientName: ''});
    }
  };

  const handleProductSearch = (codigo) => {
    const product = findProduct(codigo);
    if (product) {
      setSale({
        ...sale, 
        currentProduct: {
          ...product,
          cantidad: 1,
          total: product.precioVenta
        }
      });
    } else {
      setSale({...sale, currentProduct: {}});
    }
  };

  const addProductToSale = () => {
    if (sale.currentProduct.codigo && sale.currentProduct.cantidad > 0) {
      const updatedProducts = [...sale.products, sale.currentProduct];
      
      // Calcular valores - Frontend hace el cálculo completo
      const valueSale = updatedProducts.reduce((sum, product) => 
        sum + (product.precioVenta * product.cantidad), 0);
      
      const ivaSale = updatedProducts.reduce((sum, product) => 
        sum + (product.precioVenta * product.cantidad * (product.iva / 100)), 0);
      
      const totalSale = valueSale + ivaSale;

      setSale({
        ...sale,
        products: updatedProducts,
        currentProduct: {},
        valueSale: Math.round(valueSale * 100) / 100, // Redondear a 2 decimales
        ivaSale: Math.round(ivaSale * 100) / 100,
        totalSale: Math.round(totalSale * 100) / 100
      });
    }
  };

  const removeProduct = (index) => {
    const updatedProducts = sale.products.filter((_, i) => i !== index);
    
    // Recalcular valores después de quitar producto
    const valueSale = updatedProducts.reduce((sum, product) => 
      sum + (product.precioVenta * product.cantidad), 0);
    
    const ivaSale = updatedProducts.reduce((sum, product) => 
      sum + (product.precioVenta * product.cantidad * (product.iva / 100)), 0);
    
    const totalSale = valueSale + ivaSale;

    setSale({
      ...sale,
      products: updatedProducts,
      valueSale: Math.round(valueSale * 100) / 100,
      ivaSale: Math.round(ivaSale * 100) / 100,
      totalSale: Math.round(totalSale * 100) / 100
    });
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return '$0';
    }
    return value.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  const valueSaleBodyTemplate = (rowData) => {
    return formatCurrency(rowData.valueSale);
  };

  const ivaSaleBodyTemplate = (rowData) => {
    return formatCurrency(rowData.ivaSale);
  };

  const totalSaleBodyTemplate = (rowData) => {
    return formatCurrency(rowData.totalSale);
  };

  const clientBodyTemplate = (rowData) => {
    const client = clients.find(c => c.cedula === rowData.idClient.toString());
    return client ? `${client.cedula} - ${client.nombre}` : rowData.idClient;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" 
              onClick={() => deleteSale(rowData)} />
    );
  };

  const productTotalBodyTemplate = (rowData) => {
    return formatCurrency(rowData.precioVenta * rowData.cantidad);
  };

  const saleDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Confirmar Venta" icon="pi pi-check" onClick={saveSale} 
              disabled={!sale.idClient || sale.products.length === 0} />
    </React.Fragment>
  );

  return (
    <div className="crud-container">
      <Toast ref={toast} />
      
      <div className="card">
        <div className="table-header">
          <h2>Gestión de Ventas</h2>
          <Button label="Nueva Venta" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
        </div>

        <DataTable value={sales} responsiveLayout="scroll" paginator rows={10} 
                   loading={loading} emptyMessage="No se encontraron ventas.">
          <Column field="codeSale" header="Código Venta" sortable></Column>
          <Column field="idClient" header="Cliente" body={clientBodyTemplate}></Column>
          <Column field="valueSale" header="Valor Venta" body={valueSaleBodyTemplate}></Column>
          <Column field="ivaSale" header="IVA" body={ivaSaleBodyTemplate}></Column>
          <Column field="totalSale" header="Total con IVA" body={totalSaleBodyTemplate}></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '6rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={saleDialog} style={{ width: '800px' }} header="Registrar Nueva Venta" 
              modal className="p-fluid" footer={saleDialogFooter} onHide={hideDialog}>
        
        <div className="p-field">
          <label htmlFor="idClient">Cédula del Cliente *</label>
          <InputText id="idClient" value={sale.idClient || ''} 
                     onChange={(e) => handleClientSearch(e.target.value)}
                     required className={submitted && !sale.idClient ? 'p-invalid' : ''} 
                     placeholder="Ingrese la cédula del cliente" />
          {sale.clientName && <small className="p-text-success">Cliente: {sale.clientName}</small>}
          {submitted && !sale.idClient && <small className="p-error">Cédula del cliente es requerida.</small>}
          {loadingClients && <small className="p-text-muted">Cargando clientes...</small>}
        </div>

        <Divider />

        <h4>Agregar Productos</h4>
        
        <div className="p-grid p-fluid">
          <div className="p-col-6">
            <label htmlFor="productCode">Código del Producto</label>
            <InputNumber id="productCode" value={sale.currentProduct.codigo || ''} 
                         onValueChange={(e) => handleProductSearch(e.value)}
                         placeholder="Ingrese código del producto" 
                         disabled={loadingProducts} />
            {loadingProducts && <small className="p-text-muted">Cargando productos...</small>}
          </div>
          <div className="p-col-6">
            <label htmlFor="productName">Nombre del Producto</label>
            <InputText id="productName" value={sale.currentProduct.nombre || ''} disabled />
          </div>
        </div>

        <div className="p-grid p-fluid">
          <div className="p-col-4">
            <label htmlFor="productPrice">Precio Unitario</label>
            <InputNumber id="productPrice" value={sale.currentProduct.precioVenta || 0} 
                         mode="currency" currency="COP" locale="es-CO" disabled />
          </div>
          <div className="p-col-4">
            <label htmlFor="productQuantity">Cantidad *</label>
            <InputNumber id="productQuantity" value={sale.currentProduct.cantidad || 1} 
                         onValueChange={(e) => setSale({
                           ...sale, 
                           currentProduct: {
                             ...sale.currentProduct,
                             cantidad: e.value || 1,
                             total: (sale.currentProduct.precioVenta || 0) * (e.value || 1)
                           }
                         })}
                         min={1} />
          </div>
          <div className="p-col-4">
            <label htmlFor="productTotal">Total Producto</label>
            <InputNumber id="productTotal" value={sale.currentProduct.total || 0} 
                         mode="currency" currency="COP" locale="es-CO" disabled />
          </div>
        </div>

        <Button label="Agregar Producto" icon="pi pi-plus" 
                className="p-button-primary p-mt-2" 
                onClick={addProductToSale}
                disabled={!sale.currentProduct.codigo || !sale.currentProduct.cantidad || loadingProducts} />

        {sale.products.length > 0 && (
          <>
            <Divider />
            <h4>Productos en la Venta</h4>
            <DataTable value={sale.products} responsiveLayout="scroll" className="p-datatable-sm">
              <Column field="codigo" header="Código"></Column>
              <Column field="nombre" header="Producto"></Column>
              <Column field="precioVenta" header="Precio" body={(rowData) => formatCurrency(rowData.precioVenta)}></Column>
              <Column field="cantidad" header="Cantidad"></Column>
              <Column field="iva" header="IVA %" body={(rowData) => `${rowData.iva}%`}></Column>
              <Column field="total" header="Total" body={productTotalBodyTemplate}></Column>
              <Column body={(rowData, { rowIndex }) => (
                <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-sm" 
                        onClick={() => removeProduct(rowIndex)} />
              )} header="Quitar"></Column>
            </DataTable>
          </>
        )}

        <Divider />

        <Card>
          <div className="p-grid">
            <div className="p-col-6">
              <strong>Valor de Venta (Sin IVA):</strong>
            </div>
            <div className="p-col-6 text-right">
              {formatCurrency(sale.valueSale || 0)}
            </div>
          </div>
          <div className="p-grid">
            <div className="p-col-6">
              <strong>Total IVA:</strong>
            </div>
            <div className="p-col-6 text-right">
              {formatCurrency(sale.ivaSale || 0)}
            </div>
          </div>
          <Divider />
          <div className="p-grid">
            <div className="p-col-6">
              <strong>Total con IVA:</strong>
            </div>
            <div className="p-col-6 text-right">
              <strong>{formatCurrency(sale.totalSale || 0)}</strong>
            </div>
          </div>
        </Card>

      </Dialog>
    </div>
  );
};

export default SalesCRUD;