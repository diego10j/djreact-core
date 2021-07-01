import React, { useRef } from 'react';
// material
import { Container, Card, TableContainer } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Tabla from '../../components/@dj-components/tabla/Tabla';
// hooks
// util
// servicios

// ----------------------------------------------------------------------

export default function Usuarios() {
  // refererencias hacia componentes
  const tabTabla1 = useRef();

  return (
    <>
      <Page title="Simple">
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading="Usuarios del Sistema"
            links={[{ name: 'Sistema', href: PATH_DASHBOARD.root }, { name: 'Usuarios del Sistema' }]}
          />

          <Card sx={{ mt: 2 }}>
            <TableContainer sx={{ padding: 2 }}>
              <Tabla
                ref={tabTabla1}
                filasPorPagina={20}
                campoPrimario="ide_usua"
                numeroTabla={1}
                servicio={{ nombre: 'api/usuario/listaUsuarios', parametros: {} }}
                opcionesColumnas={[
                  {
                    nombre: 'avatar_usua',
                    avatar: {
                      campoNombre: ''
                    }
                  }
                ]}
                showBotonInsertar
                showBotonEliminar
                showBotonModificar
              />
            </TableContainer>
          </Card>
        </Container>
      </Page>
    </>
  );
}
