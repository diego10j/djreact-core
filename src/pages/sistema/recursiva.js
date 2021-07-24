import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
// material
import { Container, Card, TableContainer } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Tabla from '../../components/@dj-components/tabla/Tabla';
import Arbol from '../../components/@dj-components/arbol/Arbol';
import BotonGuardar from '../../components/@dj-components/boton/BotonGuardar';
// hooks
import usePantalla from '../../hooks/usePantalla';
import useWidth from '../../hooks/useWidth';
// util
import { getTituloPantalla } from '../../utils/utilitario';

// ----------------------------------------------------------------------

export default function Recursiva() {
  const pantalla = usePantalla();
  const tabTabla1 = useRef();
  const arbArbol = useRef();
  const { windowSize } = useWidth();
  const [isGuardar, setIsGuardar] = useState(false);

  let condiciones = { condicion: 'sis_ide_opci is null', valores: [] }; // de la tabla

  const { id } = useParams();

  const titulo = getTituloPantalla();

  const guardar = async () => {
    setIsGuardar(true);
    if (await tabTabla1.current.isGuardar()) {
      pantalla.guardar(tabTabla1);
    }
    setIsGuardar(false);
  };

  const onSelectArbol = async () => {
    const { nodoSeleccionado } = arbArbol.current;
    if (nodoSeleccionado === 'root') {
      // raiz
      condiciones = { condicion: 'sis_ide_opci is null', valores: [] };
    } else {
      condiciones = { condicion: 'sis_ide_opci = ?', valores: [nodoSeleccionado] };
    }
    // actualiza la tabla
    tabTabla1.current.ejecutar(condiciones);
  };

  return (
    <Page title={titulo}>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={titulo}
          links={[{ name: 'Sistema', href: PATH_DASHBOARD.root }, { name: titulo }]}
          action={<BotonGuardar onClick={guardar} loading={isGuardar} />}
        />

        <Split className="split" gutterSize={8} sizes={[25, 75]} direction="horizontal">
          <Card sx={{ m: 1 }}>
            <Arbol
              ref={arbArbol}
              onSelect={onSelectArbol}
              height={windowSize.height - 230}
              nombreTabla="sis_opcion"
              campoPrimario="ide_opci"
              campoNombre="nom_opci"
              campoPadre="sis_ide_opci"
              campoOrden="nom_opci"
              titulo="OPCIONES"
            />
          </Card>
          <Card sx={{ m: 1 }}>
            <TableContainer sx={{ padding: 2, overflow: 'auto' }}>
              <Tabla
                ref={tabTabla1}
                height={windowSize.height - 333}
                filasPorPagina={20}
                numeroTabla={1}
                tablaConfiguracion={id}
                condiciones={condiciones}
                lectura={false}
                showRowIndex
              />
            </TableContainer>
          </Card>
        </Split>
      </Container>
    </Page>
  );
}
