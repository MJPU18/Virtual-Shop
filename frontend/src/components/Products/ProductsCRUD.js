import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { productService } from '../../services/productService';
import './ProductsCRUD.css';

const ProductsCRUD = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    nombre: '',
    nitProveedor: null,
    precioCompra: null,
    ivaPurchase: null,
    precioVenta: null
  });
  const [productDialog, setProductDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  // Cargar productos al iniciar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getAll();
      setProducts(productsData);
    } catch (error) {
      showError('Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
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
    setProduct({
      nombre: '',
      nitProveedor: null,
      precioCompra: null,
      ivaPurchase: null,
      precioVenta: null
    });
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    // Validar que todos los campos requeridos estén presentes
    const hasAllRequiredFields = 
      product.nombre && 
      product.nitProveedor !== null && 
      product.precioCompra !== null && 
      product.ivaPurchase !== null && 
      product.precioVenta !== null;

    if (hasAllRequiredFields) {
      try {
        // Convertir NIT a número
        const productData = {
          ...product,
          nitProveedor: Number(product.nitProveedor)
        };

        if (product.productCode) {
          // Editar producto existente
          await productService.update(product.productCode, productData);
          showSuccess('Producto actualizado correctamente');
        } else {
          // Crear nuevo producto
          await productService.create(productData);
          showSuccess('Producto creado correctamente');
        }

        // Recargar la lista de productos
        await loadProducts();
        setProductDialog(false);
        setProduct({
          nombre: '',
          nitProveedor: null,
          precioCompra: null,
          ivaPurchase: null,
          precioVenta: null
        });
      } catch (error) {
        showError('Error al guardar producto: ' + error.message);
      }
    } else {
      showError('Por favor, complete todos los campos requeridos');
    }
  };

  const editProduct = (product) => {
    setProduct({
      productCode: product.productCode,
      nombre: product.productName,
      nitProveedor: product.providerNit,
      precioCompra: product.purchasePrice,
      ivaPurchase: product.ivaPurchase,
      precioVenta: product.salePrice
    });
    setProductDialog(true);
  };

  const deleteProduct = async (product) => {
    try {
      await productService.delete(product.productCode);
      showSuccess('Producto eliminado correctamente');
      await loadProducts();
    } catch (error) {
      showError('Error al eliminar producto: ' + error.message);
    }
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

  const calculatePrecioVenta = (precioCompra, ivaPurchase) => {
    if (precioCompra !== null && ivaPurchase !== null) {
      const ivaValue = precioCompra * (ivaPurchase / 100);
      return precioCompra + ivaValue;
    }
    return null;
  };

  const handlePrecioCompraChange = (value) => {
    onNumberChange(value, 'precioCompra');
    if (product.ivaPurchase !== null) {
      const nuevoPrecioVenta = calculatePrecioVenta(value, product.ivaPurchase);
      setProduct({...product, precioCompra: value, precioVenta: nuevoPrecioVenta});
    }
  };

  const handleIvaChange = (value) => {
    onNumberChange(value, 'ivaPurchase');
    if (product.precioCompra !== null) {
      const nuevoPrecioVenta = calculatePrecioVenta(product.precioCompra, value);
      setProduct({...product, ivaPurchase: value, precioVenta: nuevoPrecioVenta});
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  const precioCompraBodyTemplate = (rowData) => {
    return formatCurrency(rowData.purchasePrice);
  };

  const ivaBodyTemplate = (rowData) => {
    return `${rowData.ivaPurchase}%`;
  };

  const precioVentaBodyTemplate = (rowData) => {
    return formatCurrency(rowData.salePrice);
  };

  const nitProveedorBodyTemplate = (rowData) => {
    return rowData.providerNit;
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
                   loading={loading} emptyMessage="No se encontraron productos.">
          <Column field="productName" header="Nombre del Producto" sortable></Column>
          <Column field="providerNit" header="NIT Proveedor" body={nitProveedorBodyTemplate} sortable></Column>
          <Column field="purchasePrice" header="Precio Compra" body={precioCompraBodyTemplate}></Column>
          <Column field="ivaPurchase" header="IVA" body={ivaBodyTemplate}></Column>
          <Column field="salePrice" header="Precio Venta" body={precioVentaBodyTemplate}></Column>
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
          <InputNumber 
            id="nitProveedor" 
            value={product.nitProveedor} 
            onValueChange={(e) => onNumberChange(e.value, 'nitProveedor')}
            mode="decimal" 
            useGrouping={false}
            min={0}
            className={submitted && product.nitProveedor === null ? 'p-invalid' : ''} 
          />
          {submitted && product.nitProveedor === null && <small className="p-error">NIT del proveedor es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="precioCompra">Precio de Compra *</label>
          <InputNumber 
            id="precioCompra" 
            value={product.precioCompra} 
            onValueChange={(e) => handlePrecioCompraChange(e.value)}
            mode="currency" 
            currency="COP" 
            locale="es-CO"
            className={submitted && product.precioCompra === null ? 'p-invalid' : ''} 
          />
          {submitted && product.precioCompra === null && <small className="p-error">Precio de compra es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="ivaPurchase">IVA (%) *</label>
          <InputNumber 
            id="ivaPurchase" 
            value={product.ivaPurchase} 
            onValueChange={(e) => handleIvaChange(e.value)}
            min={0} 
            max={100} 
            suffix="%"
            className={submitted && product.ivaPurchase === null ? 'p-invalid' : ''} 
          />
          {submitted && product.ivaPurchase === null && <small className="p-error">IVA es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="precioVenta">Precio de Venta *</label>
          <InputNumber 
            id="precioVenta" 
            value={product.precioVenta} 
            mode="currency" 
            currency="COP" 
            locale="es-CO"
            disabled 
          />
          <small className="p-text-muted">Calculado automáticamente</small>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductsCRUD;