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
import DialogoConfirmar from '../../components/@dj-components/dialogo/DialogoConfirmar';
// hooks
import useMensaje from '../../hooks/useMensaje';
// util
import { agregarDiasFecha, toDateBDD, getFormatoFechaBDD } from '../../utils/formatTime';
// servicios
import { borrarAuditoria } from '../../services/sistema/servicioAuditroia';

// ----------------------------------------------------------------------

export default function ConsultaAuditoria() {
  const titulo = 'Consulta Auditoria Usuarios';
  // refererencias hacia componentes
  const tabTabla1 = useRef();
  const carFechas = useRef();
  const comUsuario = useRef();
  const diaConfirmar = useRef();

  const { showError } = useMensaje();
  const [loading, setLoading] = useState(false);

  // Parametros iniciales del servicio
  const paramServicio = {
    fecha_inicio: getFormatoFechaBDD(agregarDiasFecha(new Date(), -3)),
    fecha_fin: getFormatoFechaBDD(new Date()),
    ide_usua: null
  };

  const abrirConfirmarEliminar = async () => {
    diaConfirmar.current.abrir();
  };

  const eliminarAuditoria = async () => {
    setLoading(true);
    try {
      await borrarAuditoria();
      tabTabla1.current.actualizar();
    } catch (error) {
      showError(error.mensaje, 'Error al borrar Auditoria');
    } finally {
      setLoading(false);
      diaConfirmar.current.cerrar();
    }
  };

  const buscar = () => {
    paramServicio.fecha_inicio = getFormatoFechaBDD(carFechas.current.getDateFechaInicio());
    paramServicio.fecha_fin = getFormatoFechaBDD(carFechas.current.getDateFechaFin());
    paramServicio.ide_usua = comUsuario.current.value === '' ? null : comUsuario.current.value;
    tabTabla1.current.ejecutarServicio(paramServicio);
  };

  return (
    <>
      <DialogoConfirmar
        ref={diaConfirmar}
        mensaje="Está seguro de que desea eliminar toda la Auditoria del sistema ?"
        onAceptar={eliminarAuditoria}
        loading={loading}
      />

      <Page title={titulo}>
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading={titulo}
            links={[{ name: 'Auditoria', href: PATH_DASHBOARD.auditoria.root }, { name: titulo }]}
            action={<BotonEliminar label="Eliminar Auditoria" onClick={abrirConfirmarEliminar} />}
          />

          <ToolbarPantalla
            componentes={
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5} md={5} lg={4}>
                  <Stack spacing={3}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 3, sm: 2 }}
                      alignItems="center"
                      justifyContent={{ xs: 'center', sm: 'flex-start' }}
                    >
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
                campoPrimario="ide_auac"
                numeroTabla={1}
                servicio={{ nombre: 'api/seguridad/getConsultaAuditoria', parametros: paramServicio }}
              />
            </TableContainer>
          </Card>
        </Container>
      </Page>
    </>
  );
}
