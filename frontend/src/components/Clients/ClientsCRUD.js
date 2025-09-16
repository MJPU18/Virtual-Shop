import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import './ClientsCRUD.css';

const ClientsCRUD = () => {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState({});
  const [clientDialog, setClientDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = React.useRef(null);

  const openNew = () => {
    setClient({});
    setSubmitted(false);
    setClientDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setClientDialog(false);
  };

  const saveClient = () => {
    setSubmitted(true);

    if (client.cedula && client.nombre && client.direccion && client.telefono && client.correo) {
      let _clients = [...clients];
      
      // Validar si la cédula ya existe
      const existingClient = _clients.find(c => c.cedula === client.cedula);
      if (existingClient && (!client.id || client.id !== existingClient.id)) {
        toast.current.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Ya existe un cliente con esta cédula', 
          life: 3000 
        });
        return;
      }

      if (client.id) {
        // Editar cliente existente
        const index = _clients.findIndex(c => c.id === client.id);
        _clients[index] = client;
        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Cliente actualizado', 
          life: 3000 
        });
      } else {
        // Crear nuevo cliente
        _clients.push({...client, id: Math.random()});
        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Cliente creado', 
          life: 3000 
        });
      }
      
      setClients(_clients);
      setClientDialog(false);
      setClient({});
    }
  };

  const editClient = (client) => {
    setClient({...client});
    setClientDialog(true);
  };

  const deleteClient = (client) => {
    let _clients = clients.filter(c => c.id !== client.id);
    setClients(_clients);
    toast.current.show({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Cliente eliminado', 
      life: 3000 
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _client = {...client};
    _client[`${name}`] = val;
    setClient(_client);
  };

  const clientDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveClient} />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" 
                onClick={() => editClient(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" 
                onClick={() => deleteClient(rowData)} />
      </React.Fragment>
    );
  };

  return (
    <div className="crud-container">
      <Toast ref={toast} />
      
      <div className="card">
        <div className="table-header">
          <h2>Gestión de Clientes</h2>
          <Button label="Nuevo Cliente" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
        </div>

        <DataTable value={clients} responsiveLayout="scroll" paginator rows={10} 
                   emptyMessage="No se encontraron clientes.">
          <Column field="cedula" header="Cédula" sortable></Column>
          <Column field="nombre" header="Nombre Completo" sortable></Column>
          <Column field="direccion" header="Dirección"></Column>
          <Column field="telefono" header="Teléfono"></Column>
          <Column field="correo" header="Correo Electrónico"></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={clientDialog} style={{ width: '500px' }} header="Detalles del Cliente" 
              modal className="p-fluid" footer={clientDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="cedula">Cédula *</label>
          <InputText id="cedula" value={client.cedula || ''} 
                     onChange={(e) => onInputChange(e, 'cedula')} 
                     required autoFocus 
                     className={submitted && !client.cedula ? 'p-invalid' : ''} />
          {submitted && !client.cedula && <small className="p-error">Cédula es requerida.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="nombre">Nombre Completo *</label>
          <InputText id="nombre" value={client.nombre || ''} 
                     onChange={(e) => onInputChange(e, 'nombre')} 
                     required className={submitted && !client.nombre ? 'p-invalid' : ''} />
          {submitted && !client.nombre && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="direccion">Dirección *</label>
          <InputText id="direccion" value={client.direccion || ''} 
                     onChange={(e) => onInputChange(e, 'direccion')} 
                     required className={submitted && !client.direccion ? 'p-invalid' : ''} />
          {submitted && !client.direccion && <small className="p-error">Dirección es requerida.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="telefono">Teléfono *</label>
          <InputText id="telefono" value={client.telefono || ''} 
                     onChange={(e) => onInputChange(e, 'telefono')} 
                     required className={submitted && !client.telefono ? 'p-invalid' : ''} />
          {submitted && !client.telefono && <small className="p-error">Teléfono es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="correo">Correo Electrónico *</label>
          <InputText id="correo" value={client.correo || ''} 
                     onChange={(e) => onInputChange(e, 'correo')} 
                     required className={submitted && !client.correo ? 'p-invalid' : ''} />
          {submitted && !client.correo && <small className="p-error">Correo es requerido.</small>}
        </div>
      </Dialog>
    </div>
  );
};

export default ClientsCRUD;