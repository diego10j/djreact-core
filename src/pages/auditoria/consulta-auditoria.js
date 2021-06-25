import React, { useRef, useState } from 'react';
// material
import { Container, Card, TableContainer } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ToolbarPantalla from '../../components/@dj-components/toolbar/ToolbarPantalla';
import Tabla from '../../components/@dj-components/tabla/Tabla';
import BotonEliminar from '../../components/@dj-components/boton/BotonEliminar';
import CalendarioRango from '../../components/@dj-components/calendario/CalendarioRango';
// hooks

// ----------------------------------------------------------------------

export default function ConsultaAuditoria() {
  const tabTabla1 = useRef();

  const [loading, setLoading] = useState(false);

  const [paramServicio, setParamServicio] = useState({
    fecha_inicio: '2020-01-01',
    fecha_fin: '2022-01-01',
    ide_usua: null
  });

  const eliminarAuditoria = async () => {
    setLoading(true);

    setLoading(false);
  };

  return (
    <Page title="Simple">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Consulta Auditoria Usuarios"
          links={[{ name: 'Auditoria', href: PATH_DASHBOARD.root }, { name: 'Consulta Auditoria Usuarios' }]}
          action={<BotonEliminar label="Eliminar Auditoria" onClick={eliminarAuditoria} loading={loading} />}
        />

        <ToolbarPantalla componentes={<CalendarioRango />} />

        <Card sx={{ mt: 5 }}>
          <TableContainer sx={{ padding: 2 }}>
            <Tabla
              ref={tabTabla1}
              filasPorPagina={20}
              numeroTabla={1}
              servicio={{ nombre: 'api/seguridad/getConsultaAuditoria', parametros: paramServicio }}
            />
          </TableContainer>
        </Card>
      </Container>
    </Page>
  );
}
