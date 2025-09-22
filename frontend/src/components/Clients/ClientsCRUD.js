import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { clientService } from '../../services/clientService';
import './ClientsCRUD.css';

const ClientsCRUD = () => {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState({});
  const [clientDialog, setClientDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  // Cargar clientes al iniciar el componente
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const clientsData = await clientService.getAll();
      setClients(clientsData);
    } catch (error) {
      showError('Error al cargar clientes: ' + error.message);
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
    setClient({});
    setSubmitted(false);
    setClientDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setClientDialog(false);
  };

  const saveClient = async () => {
    setSubmitted(true);

    // Validar campos requeridos según la estructura del backend
    if (!client.documentId || !client.fullName || !client.address || !client.phone || !client.email) {
      showError('Todos los campos son requeridos');
      return;
    }

    try {
      // Preparar datos para el backend (con los nombres de campo correctos)
      const clientData = {
        documentId: parseInt(client.documentId),
        fullName: client.fullName,
        address: client.address,
        phone: client.phone,
        email: client.email
      };

      if (client.id) {
        // Editar cliente existente
        await clientService.update(client.documentId, clientData);
        showSuccess('Cliente actualizado correctamente');
      } else {
        // Crear nuevo cliente
        await clientService.create(clientData);
        showSuccess('Cliente creado correctamente');
      }

      // Recargar la lista de clientes
      await loadClients();
      setClientDialog(false);
      setClient({});
    } catch (error) {
      showError('Error al guardar cliente: ' + error.message);
    }
  };

  const editClient = (client) => {
    setClient({
      id: client.documentId,
      documentId: client.documentId,
      fullName: client.fullName,
      address: client.address,
      phone: client.phone,
      email: client.email
    });
    setClientDialog(true);
  };

  const deleteClient = async (client) => {
    try {
      await clientService.delete(client.documentId);
      showSuccess('Cliente eliminado correctamente');
      await loadClients();
    } catch (error) {
      showError('Error al eliminar cliente: ' + error.message);
    }
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
                   loading={loading} emptyMessage="No se encontraron clientes.">
          <Column field="documentId" header="Cédula" sortable></Column>
          <Column field="fullName" header="Nombre Completo" sortable></Column>
          <Column field="address" header="Dirección"></Column>
          <Column field="phone" header="Teléfono"></Column>
          <Column field="email" header="Correo Electrónico"></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={clientDialog} style={{ width: '500px' }} header="Detalles del Cliente" 
              modal className="p-fluid" footer={clientDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="documentId">Cédula *</label>
          <InputText 
            id="documentId" 
            value={client.documentId || ''} 
            onChange={(e) => onInputChange(e, 'documentId')} 
            required 
            autoFocus 
            keyfilter="int" 
            className={submitted && !client.documentId ? 'p-invalid' : ''} 
          />
          {submitted && !client.documentId && <small className="p-error">Cédula es requerida.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="fullName">Nombre Completo *</label>
          <InputText 
            id="fullName" 
            value={client.fullName || ''} 
            onChange={(e) => onInputChange(e, 'fullName')} 
            required 
            className={submitted && !client.fullName ? 'p-invalid' : ''} 
          />
          {submitted && !client.fullName && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="address">Dirección *</label>
          <InputText 
            id="address" 
            value={client.address || ''} 
            onChange={(e) => onInputChange(e, 'address')} 
            required 
            className={submitted && !client.address ? 'p-invalid' : ''} 
          />
          {submitted && !client.address && <small className="p-error">Dirección es requerida.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="phone">Teléfono *</label>
          <InputText 
            id="phone" 
            value={client.phone || ''} 
            onChange={(e) => onInputChange(e, 'phone')} 
            required 
            className={submitted && !client.phone ? 'p-invalid' : ''} 
          />
          {submitted && !client.phone && <small className="p-error">Teléfono es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="email">Correo Electrónico *</label>
          <InputText 
            id="email" 
            value={client.email || ''} 
            onChange={(e) => onInputChange(e, 'email')} 
            required 
            className={submitted && !client.email ? 'p-invalid' : ''} 
          />
          {submitted && !client.email && <small className="p-error">Correo es requerido.</small>}
        </div>
      </Dialog>
    </div>
  );
};

export default ClientsCRUD;