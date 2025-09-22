import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import UsersCRUD from './components/Users/UsersCRUD';
import ClientsCRUD from './components/Clients/ClientsCRUD';
import ProvidersCRUD from './components/Providers/ProvidersCRUD';
import ProductsCRUD from './components/Products/ProductsCRUD';
import SalesCRUD from './components/Sales/SalesCRUD';
import ReportsCRUD from './components/Reports/ReportsCRUD';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Verificar si hay un usuario logueado al cargar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (status, user = null) => {
    setIsAuthenticated(status);
    if (status && user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <PrimeReactProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/usuarios" replace />
              } 
            />
            <Route 
              path="/*" 
              element={
                isAuthenticated ? 
                <Layout onLogout={handleLogout} currentUser={currentUser}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/usuarios" replace />} />
                    <Route path="/usuarios" element={<UsersCRUD />} />
                    <Route path="/clientes" element={<ClientsCRUD />} />
                    <Route path="/proveedores" element={<ProvidersCRUD />} />
                    <Route path="/productos" element={<ProductsCRUD />} />
                    <Route path="/ventas" element={<SalesCRUD currentUser={currentUser} />} />
                    <Route path="/reportes" element={<ReportsCRUD />} />
                  </Routes>
                </Layout> : 
                <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </div>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
