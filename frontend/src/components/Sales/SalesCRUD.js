import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import './SalesCRUD.css';

const SalesCRUD = () => {
  const [sales, setSales] = useState([]);
  const [sale, setSale] = useState({
    products: [],
    currentProduct: {}
  });
  const [saleDialog, setSaleDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [clients] = useState([
    { id: 1, cedula: '123456789', nombre: 'Juan Pérez' },
    { id: 2, cedula: '987654321', nombre: 'María García' }
  ]);
  const [products] = useState([
    { id: 1, codigo: 1, nombre: 'Melocotones', precioVenta: 30351, iva: 19 },
    { id: 2, codigo: 2, nombre: 'Manzanas', precioVenta: 21549, iva: 19 },
    { id: 3, codigo: 3, nombre: 'Plátanos', precioVenta: 35320, iva: 19 }
  ]);
  const toast = useRef(null);

  // Simular código consecutivo de venta
  const [nextSaleCode, setNextSaleCode] = useState(1000);

  const openNew = () => {
    setSale({
      codeSale: nextSaleCode,
      idClient: '',
      idUser: 1, // Simular usuario logueado
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

  const saveSale = () => {
    setSubmitted(true);

    if (sale.idClient && sale.products.length > 0) {
      let _sales = [...sales];
      
      // Crear nueva venta
      const newSale = {
        id: Math.random(),
        codeSale: sale.codeSale,
        idClient: sale.idClient,
        idUser: sale.idUser,
        ivaSale: sale.ivaSale,
        totalSale: sale.totalSale,
        valueSale: sale.valueSale,
        products: [...sale.products],
        fecha: new Date().toLocaleDateString()
      };

      _sales.push(newSale);
      setSales(_sales);
      setNextSaleCode(nextSaleCode + 1);
      
      toast.current.show({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Venta registrada correctamente', 
        life: 3000 
      });
      
      setSaleDialog(false);
      setSale({ products: [], currentProduct: {} });
    }
  };

  const deleteSale = (sale) => {
    let _sales = sales.filter(s => s.id !== sale.id);
    setSales(_sales);
    toast.current.show({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Venta eliminada', 
      life: 3000 
    });
  };

  const findClient = (cedula) => {
    return clients.find(client => client.cedula === cedula);
  };

  const findProduct = (codigo) => {
    return products.find(product => product.codigo === codigo);
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
    const product = findProduct(Number(codigo));
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
      const valueSale = updatedProducts.reduce((sum, product) => sum + (product.precioVenta * product.cantidad), 0);
      const ivaSale = updatedProducts.reduce((sum, product) => sum + (product.precioVenta * product.cantidad * (product.iva / 100)), 0);
      const totalSale = valueSale + ivaSale;

      setSale({
        ...sale,
        products: updatedProducts,
        currentProduct: {},
        valueSale,
        ivaSale,
        totalSale
      });
    }
  };

  const removeProduct = (index) => {
    const updatedProducts = sale.products.filter((_, i) => i !== index);
    const valueSale = updatedProducts.reduce((sum, product) => sum + (product.precioVenta * product.cantidad), 0);
    const ivaSale = updatedProducts.reduce((sum, product) => sum + (product.precioVenta * product.cantidad * (product.iva / 100)), 0);
    const totalSale = valueSale + ivaSale;

    setSale({
      ...sale,
      products: updatedProducts,
      valueSale,
      ivaSale,
      totalSale
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
    const client = clients.find(c => c.cedula === rowData.idClient);
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
      <Button label="Confirmar Venta" icon="pi pi-check" onClick={saveSale} />
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
                   emptyMessage="No se encontraron ventas.">
          <Column field="codeSale" header="Código Venta" sortable></Column>
          <Column field="idClient" header="Cliente" body={clientBodyTemplate}></Column>
          <Column field="fecha" header="Fecha" sortable></Column>
          <Column field="valueSale" header="Valor Venta" body={valueSaleBodyTemplate}></Column>
          <Column field="ivaSale" header="IVA" body={ivaSaleBodyTemplate}></Column>
          <Column field="totalSale" header="Total con IVA" body={totalSaleBodyTemplate}></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '6rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={saleDialog} style={{ width: '800px' }} header="Registrar Nueva Venta" 
              modal className="p-fluid" footer={saleDialogFooter} onHide={hideDialog}>
        
        <div className="p-field">
          <label htmlFor="codeSale">Código de Venta</label>
          <InputText id="codeSale" value={sale.codeSale || ''} disabled />
        </div>

        <div className="p-field">
          <label htmlFor="idClient">Cédula del Cliente *</label>
          <InputText id="idClient" value={sale.idClient || ''} 
                     onChange={(e) => handleClientSearch(e.target.value)}
                     required className={submitted && !sale.idClient ? 'p-invalid' : ''} 
                     placeholder="Ingrese la cédula del cliente" />
          {sale.clientName && <small className="p-text-success">Cliente: {sale.clientName}</small>}
          {submitted && !sale.idClient && <small className="p-error">Cédula del cliente es requerida.</small>}
        </div>

        <Divider />

        <h4>Agregar Productos</h4>
        
        <div className="p-grid p-fluid">
          <div className="p-col-6">
            <label htmlFor="productCode">Código del Producto</label>
            <InputNumber id="productCode" value={sale.currentProduct.codigo || ''} 
                         onValueChange={(e) => handleProductSearch(e.value)}
                         placeholder="Ingrese código del producto" />
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
                disabled={!sale.currentProduct.codigo || !sale.currentProduct.cantidad} />

        {sale.products.length > 0 && (
          <>
            <Divider />
            <h4>Productos en la Venta</h4>
            <DataTable value={sale.products} responsiveLayout="scroll" className="p-datatable-sm">
              <Column field="codigo" header="Código"></Column>
              <Column field="nombre" header="Producto"></Column>
              <Column field="precioVenta" header="Precio" body={(rowData) => formatCurrency(rowData.precioVenta)}></Column>
              <Column field="cantidad" header="Cantidad"></Column>
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
              <strong>Valor de Venta:</strong>
            </div>
            <div className="p-col-6 text-right">
              {formatCurrency(sale.valueSale)}
            </div>
          </div>
          <div className="p-grid">
            <div className="p-col-6">
              <strong>IVA:</strong>
            </div>
            <div className="p-col-6 text-right">
              {formatCurrency(sale.ivaSale)}
            </div>
          </div>
          <Divider />
          <div className="p-grid">
            <div className="p-col-6">
              <strong>Total con IVA:</strong>
            </div>
            <div className="p-col-6 text-right">
              <strong>{formatCurrency(sale.totalSale)}</strong>
            </div>
          </div>
        </Card>

      </Dialog>
    </div>
  );
};

export default SalesCRUD;