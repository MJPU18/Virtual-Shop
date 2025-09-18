import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import './ProvidersCRUD.css';

const ProvidersCRUD = () => {
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState({});
  const [providerDialog, setProviderDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const openNew = () => {
    setProvider({});
    setSubmitted(false);
    setProviderDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProviderDialog(false);
  };

  const saveProvider = () => {
    setSubmitted(true);

    if (provider.nit && provider.nombre && provider.direccion && provider.telefono && provider.ciudad) {
      let _providers = [...providers];
      
      const existingProvider = _providers.find(p => p.nit === provider.nit);
      if (existingProvider && (!provider.id || provider.id !== existingProvider.id)) {
        toast.current.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Ya existe un proveedor con este NIT', 
          life: 3000 
        });
        return;
      }

      if (provider.id) {
        
        const index = _providers.findIndex(p => p.id === provider.id);
        _providers[index] = provider;
        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Proveedor actualizado', 
          life: 3000 
        });
      } else {
        
        _providers.push({...provider, id: Math.random()});
        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Proveedor creado', 
          life: 3000 
        });
      }
      
      setProviders(_providers);
      setProviderDialog(false);
      setProvider({});
    }
  };

  const editProvider = (provider) => {
    setProvider({...provider});
    setProviderDialog(true);
  };

  const deleteProvider = (provider) => {
    let _providers = providers.filter(p => p.id !== provider.id);
    setProviders(_providers);
    toast.current.show({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Proveedor eliminado', 
      life: 3000 
    });
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
                   emptyMessage="No se encontraron proveedores.">
          <Column field="nit" header="NIT" sortable></Column>
          <Column field="nombre" header="Nombre del Proveedor" sortable></Column>
          <Column field="direccion" header="Dirección"></Column>
          <Column field="telefono" header="Teléfono"></Column>
          <Column field="ciudad" header="Ciudad" sortable></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={providerDialog} style={{ width: '500px' }} header="Detalles del Proveedor" 
              modal className="p-fluid" footer={providerDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="nit">NIT *</label>
          <InputText id="nit" value={provider.nit || ''} 
                     onChange={(e) => onInputChange(e, 'nit')} 
                     required autoFocus 
                     className={submitted && !provider.nit ? 'p-invalid' : ''} />
          {submitted && !provider.nit && <small className="p-error">NIT es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="nombre">Nombre del Proveedor *</label>
          <InputText id="nombre" value={provider.nombre || ''} 
                     onChange={(e) => onInputChange(e, 'nombre')} 
                     required className={submitted && !provider.nombre ? 'p-invalid' : ''} />
          {submitted && !provider.nombre && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="direccion">Dirección *</label>
          <InputText id="direccion" value={provider.direccion || ''} 
                     onChange={(e) => onInputChange(e, 'direccion')} 
                     required className={submitted && !provider.direccion ? 'p-invalid' : ''} />
          {submitted && !provider.direccion && <small className="p-error">Dirección es requerida.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="telefono">Teléfono *</label>
          <InputText id="telefono" value={provider.telefono || ''} 
                     onChange={(e) => onInputChange(e, 'telefono')} 
                     required className={submitted && !provider.telefono ? 'p-invalid' : ''} />
          {submitted && !provider.telefono && <small className="p-error">Teléfono es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="ciudad">Ciudad *</label>
          <InputText id="ciudad" value={provider.ciudad || ''} 
                     onChange={(e) => onInputChange(e, 'ciudad')} 
                     required className={submitted && !provider.ciudad ? 'p-invalid' : ''} />
          {submitted && !provider.ciudad && <small className="p-error">Ciudad es requerida.</small>}
        </div>
      </Dialog>
    </div>
  );
};

export default ProvidersCRUD;