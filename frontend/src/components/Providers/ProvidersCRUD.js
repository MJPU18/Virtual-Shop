import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { providerService } from '../../services/providerService';
import './ProvidersCRUD.css';

const ProvidersCRUD = () => {
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState({});
  const [providerDialog, setProviderDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  // Cargar proveedores al iniciar el componente
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const providersData = await providerService.getAll();
      setProviders(providersData);
    } catch (error) {
      showError('Error al cargar proveedores: ' + error.message);
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
    setProvider({});
    setSubmitted(false);
    setProviderDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProviderDialog(false);
  };

  const saveProvider = async () => {
    setSubmitted(true);

    // Validar campos requeridos
    if (!provider.nit || !provider.nombre || !provider.direccion || !provider.telefono || !provider.ciudad) {
      showError('Todos los campos son requeridos');
      return;
    }

    try {
      if (provider.id) {
        // Editar proveedor existente - el id que se usa para actualizar es el nitprovider
        await providerService.update(provider.nit, provider);
        showSuccess('Proveedor actualizado correctamente');
      } else {
        // Crear nuevo proveedor
        await providerService.create(provider);
        showSuccess('Proveedor creado correctamente');
      }

      // Recargar la lista de proveedores
      await loadProviders();
      setProviderDialog(false);
      setProvider({});
    } catch (error) {
      showError('Error al guardar proveedor: ' + error.message);
    }
  };

  const editProvider = (provider) => {
    // Mapear los campos del backend a los nombres del frontend
    setProvider({
      id: provider.nitprovider,
      nit: provider.nitprovider,
      nombre: provider.providerName,
      direccion: provider.providerAddress,
      telefono: provider.providerPhone,
      ciudad: provider.providerCity
    });
    setProviderDialog(true);
  };

  const deleteProvider = async (provider) => {
    try {
      await providerService.delete(provider.nitprovider);
      showSuccess('Proveedor eliminado correctamente');
      await loadProviders();
    } catch (error) {
      showError('Error al eliminar proveedor: ' + error.message);
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _provider = {...provider};
    _provider[`${name}`] = val;
    setProvider(_provider);
  };

  const providerDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProvider} />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" 
                onClick={() => editProvider(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" 
                onClick={() => deleteProvider(rowData)} />
      </React.Fragment>
    );
  };

  return (
    <div className="crud-container">
      <Toast ref={toast} />
      
      <div className="card">
        <div className="table-header">
          <h2>Gestión de Proveedores</h2>
          <Button label="Nuevo Proveedor" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
        </div>

        <DataTable value={providers} responsiveLayout="scroll" paginator rows={10} 
                   loading={loading} emptyMessage="No se encontraron proveedores.">
          <Column field="nitprovider" header="NIT" sortable></Column>
          <Column field="providerName" header="Nombre del Proveedor" sortable></Column>
          <Column field="providerAddress" header="Dirección"></Column>
          <Column field="providerPhone" header="Teléfono"></Column>
          <Column field="providerCity" header="Ciudad" sortable></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={providerDialog} style={{ width: '500px' }} header="Detalles del Proveedor" 
              modal className="p-fluid" footer={providerDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="nit">NIT *</label>
          <InputText 
            id="nit" 
            value={provider.nit || ''} 
            onChange={(e) => onInputChange(e, 'nit')} 
            required 
            autoFocus 
            keyfilter="int" 
            className={submitted && !provider.nit ? 'p-invalid' : ''} 
          />
          {submitted && !provider.nit && <small className="p-error">NIT es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="nombre">Nombre del Proveedor *</label>
          <InputText 
            id="nombre" 
            value={provider.nombre || ''} 
            onChange={(e) => onInputChange(e, 'nombre')} 
            required 
            className={submitted && !provider.nombre ? 'p-invalid' : ''} 
          />
          {submitted && !provider.nombre && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="direccion">Dirección *</label>
          <InputText 
            id="direccion" 
            value={provider.direccion || ''} 
            onChange={(e) => onInputChange(e, 'direccion')} 
            required 
            className={submitted && !provider.direccion ? 'p-invalid' : ''} 
          />
          {submitted && !provider.direccion && <small className="p-error">Dirección es requerida.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="telefono">Teléfono *</label>
          <InputText 
            id="telefono" 
            value={provider.telefono || ''} 
            onChange={(e) => onInputChange(e, 'telefono')} 
            required 
            keyfilter="int" 
            className={submitted && !provider.telefono ? 'p-invalid' : ''} 
          />
          {submitted && !provider.telefono && <small className="p-error">Teléfono es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="ciudad">Ciudad *</label>
          <InputText 
            id="ciudad" 
            value={provider.ciudad || ''} 
            onChange={(e) => onInputChange(e, 'ciudad')} 
            required 
            className={submitted && !provider.ciudad ? 'p-invalid' : ''} 
          />
          {submitted && !provider.ciudad && <small className="p-error">Ciudad es requerida.</small>}
        </div>
      </Dialog>
    </div>
  );
};

export default ProvidersCRUD;