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
import DialogoFormulario from '../../components/@dj-components/dialogo/DialogoFormulario';
// hooks
import usePantalla from '../../hooks/usePantalla';
import useWidth from '../../hooks/useWidth';
// util
import { getTituloPantalla } from '../../utils/utilitario';

// ----------------------------------------------------------------------

export default function SimpleUI() {
  const tabTabla1 = useRef();
  const difTabla1 = useRef();
  const [isGuardar, setIsGuardar] = useState(false);

  const { id } = useParams();
  const pantalla = usePantalla();
  const { windowSize } = useWidth();

  const titulo = getTituloPantalla();

  const guardar = async () => {
    setIsGuardar(true);
    if (await tabTabla1.current.isGuardar()) {
      pantalla.guardar(tabTabla1);
    }
    setIsGuardar(false);
  };

  const abrirFormulario = async () => {
    difTabla1.current.abrir();
  };

  return (
    <Page title={titulo}>
      <DialogoFormulario ref={difTabla1} />

      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={titulo}
          links={[{ name: 'Sistema', href: PATH_DASHBOARD.root }, { name: titulo }]}
          action={<BotonGuardar onClick={guardar} loading={isGuardar} />}
        />
        <Card>
          <TableContainer sx={{ padding: 2 }}>
            <Tabla
              height={windowSize.height - 320}
              ref={tabTabla1}
              filasPorPagina={20}
              onModificar={abrirFormulario}
              showBotonInsertar
              showBotonEliminar
              numeroTabla={1}
              tablaConfiguracion={id}
              lectura
              showRowIndex
            />
          </TableContainer>
        </Card>
      </Container>
    </Page>
  );
}
