import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import './UsersCRUD.css';

const UsersCRUD = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [userDialog, setUserDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const openNew = () => {
    setUser({});
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const saveUser = () => {
    setSubmitted(true);

    if (user.cedula && user.nombre && user.correo && user.usuario && user.contraseña) {
      let _users = [...users];
      
      // Validar si la cédula ya existe
      const existingUserByCedula = _users.find(u => u.cedula === user.cedula);
      if (existingUserByCedula && (!user.id || user.id !== existingUserByCedula.id)) {
        toast.current.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Ya existe un usuario con esta cédula', 
          life: 3000 
        });
        return;
      }

      // Validar si el nombre de usuario ya existe
      const existingUserByUsername = _users.find(u => u.usuario === user.usuario);
      if (existingUserByUsername && (!user.id || user.id !== existingUserByUsername.id)) {
        toast.current.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Ya existe un usuario con este nombre de usuario', 
          life: 3000 
        });
        return;
      }

      if (user.id) {
        // Editar usuario existente
        const index = _users.findIndex(u => u.id === user.id);
        _users[index] = user;
        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Usuario actualizado', 
          life: 3000 
        });
      } else {
        // Crear nuevo usuario
        _users.push({...user, id: Math.random()});
        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Usuario creado', 
          life: 3000 
        });
      }
      
      setUsers(_users);
      setUserDialog(false);
      setUser({});
    }
  };

  const editUser = (user) => {
    setUser({...user});
    setUserDialog(true);
  };

  const deleteUser = (user) => {
    let _users = users.filter(u => u.id !== user.id);
    setUsers(_users);
    toast.current.show({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Usuario eliminado', 
      life: 3000 
    });
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
                   emptyMessage="No se encontraron usuarios.">
          <Column field="cedula" header="Cédula" sortable></Column>
          <Column field="nombre" header="Nombre Completo" sortable></Column>
          <Column field="correo" header="Correo Electrónico"></Column>
          <Column field="usuario" header="Usuario" sortable></Column>
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={userDialog} style={{ width: '500px' }} header="Detalles de Usuario" 
              modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="cedula">Cédula *</label>
          <InputText id="cedula" value={user.cedula || ''} 
                     onChange={(e) => onInputChange(e, 'cedula')} 
                     required autoFocus 
                     className={submitted && !user.cedula ? 'p-invalid' : ''} />
          {submitted && !user.cedula && <small className="p-error">Cédula es requerida.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="nombre">Nombre Completo *</label>
          <InputText id="nombre" value={user.nombre || ''} 
                     onChange={(e) => onInputChange(e, 'nombre')} 
                     required className={submitted && !user.nombre ? 'p-invalid' : ''} />
          {submitted && !user.nombre && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="correo">Correo Electrónico *</label>
          <InputText id="correo" value={user.correo || ''} 
                     onChange={(e) => onInputChange(e, 'correo')} 
                     required className={submitted && !user.correo ? 'p-invalid' : ''} />
          {submitted && !user.correo && <small className="p-error">Correo es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="usuario">Usuario *</label>
          <InputText id="usuario" value={user.usuario || ''} 
                     onChange={(e) => onInputChange(e, 'usuario')} 
                     required className={submitted && !user.usuario ? 'p-invalid' : ''} />
          {submitted && !user.usuario && <small className="p-error">Usuario es requerido.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="contraseña">Contraseña *</label>
          <Password id="contraseña" value={user.contraseña || ''} 
                    onChange={(e) => onInputChange(e, 'contraseña')} 
                    required feedback={false} 
                    className={submitted && !user.contraseña ? 'p-invalid' : ''} />
          {submitted && !user.contraseña && <small className="p-error">Contraseña es requerida.</small>}
        </div>
      </Dialog>
    </div>
  );
};

export default UsersCRUD;