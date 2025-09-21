import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import './ReportsCRUD.css';

const ReportsCRUD = () => {
  // Datos de ejemplo para usuarios
  const [users] = useState([
    { cedula: '123456789', nombre: 'Nicolas Uyasex', correo: 'sapa@gmail.com', usuario: 'uyasex', contraseña: 'picha1' },
    { cedula: '987654321', nombre: 'María Puñito', correo: 'maria@gmail.com', usuario: 'mariap', contraseña: 'picha2' },
    { cedula: '456789123', nombre: 'Afloja Locas', correo: 'jav@gmail.com', usuario: 'aflojalocas', contraseña: 'picha3' }
  ]);

  // Datos de ejemplo para clientes
  const [clients] = useState([
    { cedula: '111111111', nombre: 'Nicolas Uyasex', correo: 'sapa@gmail.com', direccion: 'Calle 123 #45-67', telefono: '3001234567' },
    { cedula: '222222222', nombre: 'María Puñito', correo: 'maria@gmail.com', direccion: 'Av. Suba #89-10', telefono: '3102345678' },
    { cedula: '333333333', nombre: 'Afloja Locas', correo: 'jav@gmail.com', direccion: 'Carrera 56 #78-90', telefono: '3203456789' }
  ]);

  // Datos de ejemplo para ventas por cliente
  const [salesByClient] = useState([
    { cedula: '111111111', nombre: 'Nicolas Uyasex', totalVentas: 1500000 },
    { cedula: '222222222', nombre: 'María Puñito', totalVentas: 2750000 },
    { cedula: '333333333', nombre: 'Afloja Locas', totalVentas: 890000 }
  ]);

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

  return (
    <div className="reports-container">
      <div className="card">
        <div className="table-header">
          <h2>Reportes del Sistema</h2>
        </div>

        <TabView>
          {/* Pestaña de Listado de Usuarios */}
          <TabPanel header="Listado de Usuarios">
            <Card title="Listado de Usuarios Registrados" className="report-card">
              <DataTable value={users} responsiveLayout="scroll" paginator rows={5} 
                        emptyMessage="No se encontraron usuarios." className="p-datatable-sm">
                <Column field="cedula" header="Cédula" sortable></Column>
                <Column field="nombre" header="Nombre Completo" sortable></Column>
                <Column field="correo" header="Correo Electrónico"></Column>
                <Column field="usuario" header="Usuario" sortable></Column>
                <Column field="contraseña" header="Contraseña"></Column>
              </DataTable>
            </Card>
          </TabPanel>

          {/* Pestaña de Listado de Clientes */}
          <TabPanel header="Listado de Clientes">
            <Card title="Listado de Clientes Registrados" className="report-card">
              <DataTable value={clients} responsiveLayout="scroll" paginator rows={5} 
                        emptyMessage="No se encontraron clientes." className="p-datatable-sm">
                <Column field="cedula" header="Cédula" sortable></Column>
                <Column field="nombre" header="Nombre Completo" sortable></Column>
                <Column field="correo" header="Correo Electrónico"></Column>
                <Column field="direccion" header="Dirección"></Column>
                <Column field="telefono" header="Teléfono"></Column>
              </DataTable>
            </Card>
          </TabPanel>

          {/* Pestaña de Ventas por Cliente */}
          <TabPanel header="Ventas por Cliente">
            <Card title="Total de Ventas por Cliente" className="report-card">
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

              <DataTable value={salesByClient} responsiveLayout="scroll" paginator rows={5} 
                        emptyMessage="No se encontraron ventas." className="p-datatable-sm"
                        footer={totalGeneralBodyTemplate}>
                <Column field="cedula" header="Cédula" sortable></Column>
                <Column field="nombre" header="Nombre del Cliente" sortable></Column>
                <Column field="totalVentas" header="Valor Total de Ventas" body={totalVentasBodyTemplate}></Column>
              </DataTable>
            </Card>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default ReportsCRUD;