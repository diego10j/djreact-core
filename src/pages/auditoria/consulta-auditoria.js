import React, { useRef, useState } from 'react';
// material
import { Container, Card, TableContainer, Grid, Stack } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ToolbarPantalla from '../../components/@dj-components/toolbar/ToolbarPantalla';
import Tabla from '../../components/@dj-components/tabla/Tabla';
import BotonEliminar from '../../components/@dj-components/boton/BotonEliminar';
import CalendarioRango from '../../components/@dj-components/calendario/CalendarioRango';
import Combo from '../../components/@dj-components/combo/Combo';
// hooks

// ----------------------------------------------------------------------

export default function ConsultaAuditoria() {
  const tabTabla1 = useRef();

  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState();
  const [rangoFechas, setRangoFechas] = useState([null, null]);

  const [paramServicio, setParamServicio] = useState({
    fecha_inicio: '2020-01-01',
    fecha_fin: '2022-01-01',
    ide_usua: null
  });

  const eliminarAuditoria = async () => {
    setLoading(true);

    setLoading(false);
  };

  const buscar = async () => {
    setLoading(true);
    setLoading(false);
  };

  const seleccionarUsuario = (event) => {
    setUsuario(event.target.value);
  };

  return (
    <Page title="Simple">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Consulta Auditoria Usuarios"
          links={[{ name: 'Auditoria', href: PATH_DASHBOARD.root }, { name: 'Consulta Auditoria Usuarios' }]}
          action={<BotonEliminar label="Eliminar Auditoria" onClick={eliminarAuditoria} loading={loading} />}
        />

        <ToolbarPantalla
          componentes={
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5} md={5} lg={4}>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} alignItems="center">
                    <Combo
                      value={usuario}
                      onChange={seleccionarUsuario}
                      label="Usuario"
                      labelNull="(Todos)"
                      nombreTabla="sis_usuario"
                      campoPrimario="ide_usua"
                      campoNombre="nom_usua"
                      width="100%"
                    />
                    <CalendarioRango onBuscar={buscar} />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          }
        />

        <Card sx={{ mt: 2 }}>
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
