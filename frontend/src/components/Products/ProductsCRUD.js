import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import './ProductsCRUD.css';

const ProductsCRUD = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [productDialog, setProductDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const openNew = () => {
    setProduct({});
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.nombre && product.nitProveedor && product.precioCompra && product.iva && product.precioVenta) {
      let _products = [...products];
      
      const existingProduct = _products.find(p => p.nombre === product.nombre);
      if (existingProduct && (!product.id || product.id !== existingProduct.id)) {
        toast.current.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Ya existe un producto con este nombre', 
          life: 3000 
        });
        return;
      }

      if (product.id) {
        const index = _products.findIndex(p => p.id === product.id);
        _products[index] = product;
        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Producto actualizado', 
          life: 3000 
        });
      } else {
        _products.push({...product, id: Math.random()});
        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Producto creado', 
          life: 3000 
        });
      }
      
      setProducts(_products);
      setProductDialog(false);
      setProduct({});
    }
  };

  const editProduct = (product) => {
    setProduct({...product});
    setProductDialog(true);
  };

  const deleteProduct = (product) => {
    let _products = products.filter(p => p.id !== product.id);
    setProducts(_products);
    toast.current.show({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Producto eliminado', 
      life: 3000 
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = {...product};
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const onNumberChange = (value, name) => {
    let _product = {...product};
    _product[`${name}`] = value;
    setProduct(_product);
  };

  const calculatePrecioVenta = (precioCompra, iva) => {
    if (precioCompra && iva) {
      const ivaValue = precioCompra * (iva / 100);
      return precioCompra + ivaValue;
    }
    return 0;
  };

  const handlePrecioCompraChange = (value) => {
    onNumberChange(value, 'precioCompra');
    if (product.iva) {
      const nuevoPrecioVenta = calculatePrecioVenta(value, product.iva);
      setProduct({...product, precioCompra: value, precioVenta: nuevoPrecioVenta});
    }
  };

  const handleIvaChange = (value) => {
    onNumberChange(value, 'iva');
    if (product.precioCompra) {
      const nuevoPrecioVenta = calculatePrecioVenta(product.precioCompra, value);
      setProduct({...product, iva: value, precioVenta: nuevoPrecioVenta});
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  const precioCompraBodyTemplate = (rowData) => {
    return formatCurrency(rowData.precioCompra);
  };

  const ivaBodyTemplate = (rowData) => {
    return `${rowData.iva}%`;
  };

  const precioVentaBodyTemplate = (rowData) => {
    return formatCurrency(rowData.precioVenta);
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" 
                onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" 
                onClick={() => deleteProduct(rowData)} />
      </React.Fragment>
    );
  };

  return (
    <div className="crud-container">
      <Toast ref={toast} />
      
      <div className="card">
        <div className="table-header">
          <h2>Gestión de Productos</h2>
          <Button label="Nuevo Producto" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
        </div>

        <DataTable value={products} responsiveLayout="scroll" paginator rows={10} 
                   emptyMessage="No se encontraron productos.">
          <Column field="nombre" header="Nombre del Producto" sortable></Column>
          <Column field="nitProveedor" header="NIT Proveedor" sortable></Column>
          <Column field="precioCompra" header="Precio Compra" body={precioCompraBodyTemplate}></Column>
          <Column field="iva" header="IVA" body={ivaBodyTemplate}></Column>
          <Column field="precioVenta" header="Precio Venta" body={precioVentaBodyTemplate}></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productDialog} style={{ width: '500px' }} header="Detalles del Producto" 
              modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="nombre">Nombre del Producto *</label>
          <InputText id="nombre" value={product.nombre || ''} 
                     onChange={(e) => onInputChange(e, 'nombre')} 
                     required autoFocus 
                     className={submitted && !product.nombre ? 'p-invalid' : ''} />
          {submitted && !product.nombre && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="nitProveedor">NIT del Proveedor *</label>
          <InputText id="nitProveedor" value={product.nitProveedor || ''} 
                     onChange={(e) => onInputChange(e, 'nitProveedor')} 
                     required className={submitted && !product.nitProveedor ? 'p-invalid' : ''} />
          {submitted && !product.nitProveedor && <small className="p-error">NIT del proveedor es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="precioCompra">Precio de Compra *</label>
          <InputNumber id="precioCompra" value={product.precioCompra} 
                       onValueChange={(e) => handlePrecioCompraChange(e.value)}
                       mode="currency" currency="COP" locale="es-CO"
                       required className={submitted && !product.precioCompra ? 'p-invalid' : ''} />
          {submitted && !product.precioCompra && <small className="p-error">Precio de compra es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="iva">IVA (%) *</label>
          <InputNumber id="iva" value={product.iva} 
                       onValueChange={(e) => handleIvaChange(e.value)}
                       min={0} max={100} suffix="%"
                       required className={submitted && !product.iva ? 'p-invalid' : ''} />
          {submitted && !product.iva && <small className="p-error">IVA es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="precioVenta">Precio de Venta *</label>
          <InputNumber id="precioVenta" value={product.precioVenta} 
                       mode="currency" currency="COP" locale="es-CO"
                       disabled className="p-disabled" />
          <small className="p-text-muted">Calculado automáticamente</small>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductsCRUD;