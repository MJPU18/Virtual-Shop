import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { clientService } from '../../services/clientService';
import { userService } from '../../services/userService';
import { salesService } from '../../services/salesService';
import './ReportsCRUD.css';

const ReportsCRUD = () => {
  // Estados para los datos
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesByClient, setSalesByClient] = useState([]);
  
  // Estados para el loading y errores
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorClients, setErrorClients] = useState(null);
  const [errorSales, setErrorSales] = useState(null);

  // Efecto para cargar todos los datos al montar el componente
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadUsers(),
      loadClients(),
      loadSales()
    ]);
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setErrorUsers(null);
      const userData = await userService.getAll();
      
      // Mapear los datos para que coincidan con la estructura esperada en la tabla
      const mappedUsers = userData.map(user => ({
        cedula: user.documentId?.toString() || '',
        nombre: user.fullName || user.userName || '',
        correo: user.email || '',
        usuario: user.userName || user.usuario || '',
        contraseña: '••••••••' // No mostrar la contraseña real por seguridad
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setErrorUsers('Error al cargar los usuarios. Verifique la conexión con el servidor.');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      setErrorClients(null);
      const clientData = await clientService.getAll();
      
      // Mapear los datos para que coincidan con la estructura esperada en la tabla
      const mappedClients = clientData.map(client => ({
        cedula: client.documentId?.toString() || '',
        nombre: client.fullName || '',
        correo: client.email || '',
        direccion: client.address || '',
        telefono: client.phone || ''
      }));
      
      setClients(mappedClients);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setErrorClients('Error al cargar los clientes. Verifique la conexión con el servidor.');
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadSales = async () => {
    try {
      setLoadingSales(true);
      setErrorSales(null);
      const [salesData, clientData] = await Promise.all([
        salesService.getAll(),
        clientService.getAll()
      ]);
      
      setSales(salesData);
      
      // Procesar las ventas para agrupar por cliente
      const salesByClientMap = {};
      
      salesData.forEach(sale => {
        const clientId = sale.idClient?.toString();
        const totalSale = parseFloat(sale.totalSale) || 0;
        
        if (clientId) {
          if (salesByClientMap[clientId]) {
            salesByClientMap[clientId].totalVentas += totalSale;
          } else {
            // Buscar el cliente correspondiente
            const client = clientData.find(c => c.documentId?.toString() === clientId);
            salesByClientMap[clientId] = {
              cedula: clientId,
              nombre: client ? client.fullName : `Cliente ${clientId}`,
              totalVentas: totalSale
            };
          }
        }
      });
      
      // Convertir el mapa a array
      const salesByClientArray = Object.values(salesByClientMap);
      setSalesByClient(salesByClientArray);
      
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      setErrorSales('Error al cargar las ventas. Verifique la conexión con el servidor.');
      setSales([]);
      setSalesByClient([]);
    } finally {
      setLoadingSales(false);
    }
  };

  const totalGeneral = salesByClient.reduce((sum, client) => sum + client.totalVentas, 0);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return '$0';
    }
    return value.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  const totalVentasBodyTemplate = (rowData) => {
    return formatCurrency(rowData.totalVentas);
  };

  const totalGeneralBodyTemplate = () => {
    return (
      <div className="total-general">
        <strong>Total General de Ventas: {formatCurrency(totalGeneral)}</strong>
      </div>
    );
  };

  // Función para mostrar mensajes de error
  const renderErrorMessage = (error) => {
    return error ? (
      <Message 
        severity="error" 
        text={error} 
        style={{ marginBottom: '1rem', width: '100%' }} 
      />
    ) : null;
  };

  // Función para mostrar spinner de carga
  const renderLoadingSpinner = () => {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        <p>Cargando datos...</p>
      </div>
    );
  };

  return (
    <div className="reports-container">
      <div className="card">
        <div className="table-header">
          <h2>Reportes del Sistema</h2>
          <button 
            onClick={loadAllData}
            className="p-button p-component p-button-outlined"
            style={{ marginLeft: 'auto' }}
          >
            🔄 Actualizar Datos
          </button>
        </div>

        <TabView>
          {/* Pestaña de Listado de Usuarios */}
          <TabPanel header="Listado de Usuarios">
            <Card title="Listado de Usuarios Registrados" className="report-card">
              {renderErrorMessage(errorUsers)}
              
              {loadingUsers ? renderLoadingSpinner() : (
                <DataTable 
                  value={users} 
                  responsiveLayout="scroll" 
                  paginator 
                  rows={10} 
                  emptyMessage="No se encontraron usuarios." 
                  className="p-datatable-sm"
                  loading={loadingUsers}
                >
                  <Column field="cedula" header="Cédula" sortable />
                  <Column field="nombre" header="Nombre Completo" sortable />
                  <Column field="correo" header="Correo Electrónico" />
                  <Column field="usuario" header="Usuario" sortable />
                  <Column field="contraseña" header="Contraseña" />
                </DataTable>
              )}
            </Card>
          </TabPanel>

          {/* Pestaña de Listado de Clientes */}
          <TabPanel header="Listado de Clientes">
            <Card title="Listado de Clientes Registrados" className="report-card">
              {renderErrorMessage(errorClients)}
              
              {loadingClients ? renderLoadingSpinner() : (
                <DataTable 
                  value={clients} 
                  responsiveLayout="scroll" 
                  paginator 
                  rows={10} 
                  emptyMessage="No se encontraron clientes." 
                  className="p-datatable-sm"
                  loading={loadingClients}
                >
                  <Column field="cedula" header="Cédula" sortable />
                  <Column field="nombre" header="Nombre Completo" sortable />
                  <Column field="correo" header="Correo Electrónico" />
                  <Column field="direccion" header="Dirección" />
                  <Column field="telefono" header="Teléfono" />
                </DataTable>
              )}
            </Card>
          </TabPanel>

          {/* Pestaña de Ventas por Cliente */}
          <TabPanel header="Ventas por Cliente">
            <Card title="Total de Ventas por Cliente" className="report-card">
              {renderErrorMessage(errorSales)}
              
              {loadingSales ? renderLoadingSpinner() : (
                <>
                  {/* Total General */}
                  <div className="total-general-container">
                    <div className="total-general-card">
                      <h3>Resumen General de Ventas</h3>
                      <div className="total-general-value">
                        {formatCurrency(totalGeneral)}
                      </div>
                      <small>Total acumulado de todas las ventas</small>
                    </div>
                  </div>

                  <DataTable 
                    value={salesByClient} 
                    responsiveLayout="scroll" 
                    paginator 
                    rows={10} 
                    emptyMessage="No se encontraron ventas." 
                    className="p-datatable-sm"
                    footer={totalGeneralBodyTemplate}
                    loading={loadingSales}
                  >
                    <Column field="cedula" header="Cédula" sortable />
                    <Column field="nombre" header="Nombre del Cliente" sortable />
                    <Column field="totalVentas" header="Valor Total de Ventas" body={totalVentasBodyTemplate} />
                  </DataTable>
                </>
              )}
            </Card>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default ReportsCRUD;