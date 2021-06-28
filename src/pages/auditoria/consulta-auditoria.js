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
// util
import { agregarDiasFecha, toDateBDD, getFormatoFechaBDD } from '../../utils/formatTime';
// ----------------------------------------------------------------------

export default function ConsultaAuditoria() {
  const tabTabla1 = useRef();
  const carFechas = useRef();
  const comUsuario = useRef();

  const [loading, setLoading] = useState(false);

  // Parametros iniciales del servicio
  const paramServicio = {
    fecha_inicio: getFormatoFechaBDD(agregarDiasFecha(new Date(), -3)),
    fecha_fin: getFormatoFechaBDD(new Date()),
    ide_usua: null
  };

  const eliminarAuditoria = async () => {
    setLoading(true);
    setLoading(false);
    buscar();
  };

  const buscar = () => {
    paramServicio.fecha_inicio = getFormatoFechaBDD(carFechas.current.getDateFechaInicio());
    paramServicio.fecha_fin = getFormatoFechaBDD(carFechas.current.getDateFechaFin());
    paramServicio.ide_usua = comUsuario.current.value === '' ? null : comUsuario.current.value;
    tabTabla1.current.ejecutarServicio(paramServicio);
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
                      ref={comUsuario}
                      label="Usuario"
                      labelNull="(Todos)"
                      nombreTabla="sis_usuario"
                      campoPrimario="ide_usua"
                      campoNombre="nom_usua"
                      width="100%"
                    />
                    <CalendarioRango
                      ref={carFechas}
                      fechaInicio={toDateBDD(paramServicio.fecha_inicio)}
                      fechaFinal={toDateBDD(paramServicio.fecha_fin)}
                      onClick={buscar}
                    />
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
