import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    usuario: '',
    contraseña: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(credentials.usuario === 'administrativa' && credentials.contraseña === '1') {
      onLogin(true);
    }
  };

  return (
    <div className="login-container">
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
                />
              </div>
              <Button 
                label="Ingresar" 
                type="submit" 
                className="login-button p-mt-3" 
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