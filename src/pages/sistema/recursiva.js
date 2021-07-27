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
import useForm from '../../hooks/useForm';
import useWidth from '../../hooks/useWidth';
// util
import { getTituloPantalla, isDefined } from '../../utils/utilitario';

// ----------------------------------------------------------------------

export default function Recursiva() {
  const pantalla = usePantalla();
  const tabTabla1 = useRef();
  const arbArbol = useRef();
  const { windowSize } = useWidth();
  const hookFormulario = useForm(); // hook Formulario

  const [isGuardar, setIsGuardar] = useState(false);

  let condiciones = {}; // de la tabla

  const { id } = useParams();

  const titulo = getTituloPantalla();

  const guardar = async () => {
    setIsGuardar(true);
    if (await tabTabla1.current.isGuardar()) {
      await pantalla.guardar(tabTabla1);
      arbArbol.current.actualizar();
    }
    setIsGuardar(false);
  };

  const onSelectArbol = async () => {
    const { nodoSeleccionado } = arbArbol.current;
    if (nodoSeleccionado === 'root') {
      // raiz
      condiciones = { condicion: `${hookFormulario.configuracion.campoPadre} is null`, valores: [] };
    } else {
      condiciones = { condicion: `${hookFormulario.configuracion.campoPadre} = ?`, valores: [nodoSeleccionado] };
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
            {isDefined(hookFormulario.configuracion.nombreTabla) && (
              <Arbol
                ref={arbArbol}
                onSelect={onSelectArbol}
                height={windowSize.height - 230}
                nombreTabla={hookFormulario.configuracion?.nombreTabla}
                campoPrimario={hookFormulario.configuracion?.campoPrimario}
                campoPadre={hookFormulario.configuracion?.campoPadre}
                campoOrden={hookFormulario.configuracion?.campoOrden}
                campoNombre={hookFormulario.configuracion?.campoNombre}
                titulo={titulo.toUpperCase()}
              />
            )}
          </Card>
          <Card sx={{ m: 1 }}>
            <TableContainer sx={{ padding: 2, overflow: 'auto' }}>
              <Tabla
                ref={tabTabla1}
                height={windowSize.height - 333}
                filasPorPagina={20}
                numeroTabla={1}
                tablaConfiguracion={id}
                condiciones={{
                  condicion: `tabla.campoPadre is null`,
                  valores: []
                }}
                hookFormulario={hookFormulario}
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
