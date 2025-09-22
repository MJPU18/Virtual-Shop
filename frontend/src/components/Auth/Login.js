// src/components/Auth/Login.js
import React, { useState, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { authService } from '../../services/authService';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    usuario: '',
    contraseña: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Error de autenticación',
      detail: message,
      life: 5000
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await authService.login(
        credentials.usuario, 
        credentials.contraseña
      );
      
      if (user) {
        onLogin(true, user);
      } else {
        showError('Usuario o contraseña incorrectos. Por favor, intente nuevamente.');
      }
    } catch (err) {
      showError('Error de conexión con el servidor. Verifique su conexión e intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Toast ref={toast} position="top-right" />
      
      <div className="login-background">
        <div className="login-content">
          <Card className="login-card">
            <div className="login-header">
              <h1>Tienda Online</h1>
              <p>Sistema de Gestión Comercial</p>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="p-field">
                <label htmlFor="usuario">Usuario</label>
                <InputText
                  id="usuario"
                  value={credentials.usuario}
                  onChange={(e) => setCredentials({...credentials, usuario: e.target.value})}
                  className="p-mb-3"
                  placeholder="Ingrese su usuario"
                  disabled={loading}
                />
              </div>
              <div className="p-field">
                <label htmlFor="contraseña">Contraseña</label>
                <Password
                  id="contraseña"
                  value={credentials.contraseña}
                  onChange={(e) => setCredentials({...credentials, contraseña: e.target.value})}
                  feedback={false}
                  placeholder="Ingrese su contraseña"
                  toggleMask
                  disabled={loading}
                />
              </div>
              <Button 
                label={loading ? "Verificando..." : "Ingresar"} 
                type="submit" 
                className="login-button p-mt-3" 
                disabled={loading}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
              />
            </form>
            <div className="login-footer">
              <p>© 2025 Tienda Genérica - Todos los derechos reservados</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;