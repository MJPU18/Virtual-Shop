import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { userService } from '../../services/userService';
import './UsersCRUD.css';

const UsersCRUD = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [userDialog, setUserDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  // Cargar usuarios al iniciar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAll();
      setUsers(usersData);
    } catch (error) {
      showError('Error al cargar usuarios: ' + error.message);
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
    setUser({});
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const saveUser = async () => {
    setSubmitted(true);

    // Validar campos requeridos según la estructura del backend
    if (!user.documentId || !user.email || !user.userName || !user.usuario || !user.password) {
      showError('Todos los campos son requeridos');
      return;
    }

    try {
      // Preparar datos para el backend (con los nombres de campo correctos)
      const userData = {
        documentId: parseInt(user.documentId),
        email: user.email,
        userName: user.userName,
        usuario: user.usuario,
        password: user.password
      };

      if (user.id) {
        // Editar usuario existente
        await userService.update(user.documentId, userData);
        showSuccess('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        await userService.create(userData);
        showSuccess('Usuario creado correctamente');
      }

      // Recargar la lista de usuarios
      await loadUsers();
      setUserDialog(false);
      setUser({});
    } catch (error) {
      showError('Error al guardar usuario: ' + error.message);
    }
  };

  const editUser = (user) => {
    setUser({
      id: user.documentId,
      documentId: user.documentId,
      userName: user.userName,
      email: user.email,
      usuario: user.usuario,
      password: user.password
    });
    setUserDialog(true);
  };

  const deleteUser = async (user) => {
    try {
      await userService.delete(user.documentId);
      showSuccess('Usuario eliminado correctamente');
      await loadUsers();
    } catch (error) {
      showError('Error al eliminar usuario: ' + error.message);
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _user = {...user};
    _user[`${name}`] = val;
    setUser(_user);
  };

  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUser} />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" 
                onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" 
                onClick={() => deleteUser(rowData)} />
      </React.Fragment>
    );
  };

  return (
    <div className="crud-container">
      <Toast ref={toast} />
      
      <div className="card">
        <div className="table-header">
          <h2>Gestión de Usuarios</h2>
          <Button label="Nuevo Usuario" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
        </div>

        <DataTable value={users} responsiveLayout="scroll" paginator rows={10} 
                   loading={loading} emptyMessage="No se encontraron usuarios.">
          <Column field="documentId" header="Cédula" sortable></Column>
          <Column field="userName" header="Nombre Completo" sortable></Column>
          <Column field="email" header="Correo Electrónico"></Column>
          <Column field="usuario" header="Usuario" sortable></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={userDialog} style={{ width: '500px' }} header="Detalles de Usuario" 
              modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="documentId">Cédula *</label>
          <InputText 
            id="documentId" 
            value={user.documentId || ''} 
            onChange={(e) => onInputChange(e, 'documentId')} 
            required 
            autoFocus 
            keyfilter="int" 
            className={submitted && !user.documentId ? 'p-invalid' : ''} 
          />
          {submitted && !user.documentId && <small className="p-error">Cédula es requerida.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="userName">Nombre Completo *</label>
          <InputText 
            id="userName" 
            value={user.userName || ''} 
            onChange={(e) => onInputChange(e, 'userName')} 
            required 
            className={submitted && !user.userName ? 'p-invalid' : ''} 
          />
          {submitted && !user.userName && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="email">Correo Electrónico *</label>
          <InputText 
            id="email" 
            value={user.email || ''} 
            onChange={(e) => onInputChange(e, 'email')} 
            required 
            className={submitted && !user.email ? 'p-invalid' : ''} 
          />
          {submitted && !user.email && <small className="p-error">Correo es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="usuario">Usuario *</label>
          <InputText 
            id="usuario" 
            value={user.usuario || ''} 
            onChange={(e) => onInputChange(e, 'usuario')} 
            required 
            className={submitted && !user.usuario ? 'p-invalid' : ''} 
          />
          {submitted && !user.usuario && <small className="p-error">Usuario es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="password">Contraseña *</label>
          <Password 
            id="password" 
            value={user.password || ''} 
            onChange={(e) => onInputChange(e, 'password')} 
            required 
            feedback={false} 
            className={submitted && !user.password ? 'p-invalid' : ''}
            toggleMask 
          />
          {submitted && !user.password && <small className="p-error">Contraseña es requerida.</small>}
        </div>
      </Dialog>
    </div>
  );
};

export default UsersCRUD;