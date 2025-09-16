import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const Header = ({onLogout}) => {
  const navigate = useNavigate();

   const startContent = (
    <div className="p-d-flex p-ai-center">
      <i className="pi pi-store p-mr-2" style={{ fontSize: '1.5rem', color: '#1976d2' }}></i>
      <span className="p-text-bold" style={{ color: '#1976d2', fontSize: '1.2rem' }}>
        Tienda Genérica
      </span>
    </div>
  );

  const items = [
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      command: () => navigate('/usuarios')
    },
    {
      label: 'Clientes',
      icon: 'pi pi-id-card',
      command: () => navigate('/clientes')
    },
    {
      label: 'Proveedores',
      icon: 'pi pi-truck',
      command: () => navigate('/proveedores')
    },
    {
      label: 'Productos',
      icon: 'pi pi-shopping-bag',
      command: () => navigate('/productos')
    },
    {
      label: 'Ventas',
      icon: 'pi pi-money-bill',
      command: () => navigate('/ventas')
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-bar',
      command: () => navigate('/reportes')
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-power-off',
      command: () => {
        onLogout();
        navigate('/login');
      },
      className: 'logout-button'
    }
  ];

  return (
    <div className="layout-header">
      <Menubar 
        model={items} 
        start={startContent}
        className="header-menubar"
      />
    </div>
  );
};

export default Header;