import React, { useState } from 'react';
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

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
                <Layout onLogout={handleLogout}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/usuarios" replace />} />
                    <Route path="/usuarios" element={<UsersCRUD />} />
                    <Route path="/clientes" element={<ClientsCRUD />} />
                    <Route path="/proveedores" element={<ProvidersCRUD />} />
                    <Route path="/productos" element={<ProductsCRUD />} />
                    <Route path="/ventas" element={<SalesCRUD />} />
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
