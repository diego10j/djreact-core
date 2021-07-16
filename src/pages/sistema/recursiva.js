import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

// material
import { Container, Card, TableContainer } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Tabla from '../../components/@dj-components/tabla/Tabla';
import BotonGuardar from '../../components/@dj-components/boton/BotonGuardar';
// hooks
import usePantalla from '../../hooks/usePantalla';
// util
import { getTituloPantalla } from '../../utils/utilitario';
// ----------------------------------------------------------------------

export default function Recursiva() {
  const pantalla = usePantalla();
  const tabTabla1 = useRef();
  const [isGuardar, setIsGuardar] = useState(false);

  const { id } = useParams();

  const titulo = getTituloPantalla();

  const guardar = async () => {
    setIsGuardar(true);
    if (await tabTabla1.current.isGuardar()) {
      pantalla.guardar(tabTabla1);
    }
    setIsGuardar(false);
  };

  return (
    <Page title={titulo}>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={titulo}
          links={[{ name: 'Sistema', href: PATH_DASHBOARD.root }, { name: titulo }]}
          action={<BotonGuardar onClick={guardar} loading={isGuardar} />}
        />
        <Card>
          <TableContainer sx={{ padding: 2 }}>
            <Tabla
              ref={tabTabla1}
              filasPorPagina={20}
              numeroTabla={1}
              tablaConfiguracion={id}
              lectura={false}
              showRowIndex
            />
          </TableContainer>
        </Card>
      </Container>
    </Page>
  );
}
