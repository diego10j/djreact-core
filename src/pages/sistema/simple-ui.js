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
import useForm from '../../hooks/useForm';
// util
import { getTituloPantalla } from '../../utils/utilitario';

// ----------------------------------------------------------------------

export default function SimpleUI() {
  const tabTabla1 = useRef();
  const difTabla1 = useRef();

  const { id } = useParams();
  const pantalla = usePantalla();
  const { windowSize } = useWidth();
  const hookFormulario = useForm(); // hook Formulario

  const titulo = getTituloPantalla();

  const [isGuardar, setIsGuardar] = useState(false);
  const [accion, setAccion] = useState();
  const [condFormulario, setCondFormulario] = useState();

  const guardar = async () => {
    setIsGuardar(true);
    if (await difTabla1.current.getTabla().isGuardar()) {
      if ((await pantalla.guardar(difTabla1.current.tabla)) === true) {
        const { filaSeleccionada } = difTabla1.current.getTabla();
        const { indiceTabla, data } = tabTabla1.current;

        if (accion === 'modificar') {
          // actualiza la data de la tabla con los valores del formulario
          tabTabla1.current.updateMyDataByRow(indiceTabla, filaSeleccionada);
        } else {
          // inserta una fila
          const newData = [filaSeleccionada, ...data];
          tabTabla1.current.setData(newData);
          tabTabla1.current.setFilaSeleccionada(filaSeleccionada);
        }
      }
      difTabla1.current.cerrar();
    }
    setIsGuardar(false);
  };

  const onModificar = async () => {
    setAccion('modificar');
    setCondFormulario({
      condicion: `${hookFormulario.configuracion.campoPrimario} = ?`,
      valores: [tabTabla1.current.getValorSeleccionado()]
    });
    difTabla1.current.setTotalColumnasSkeleton(
      tabTabla1.current.getColumnas().filter((_col) => _col.visible === true).length
    );
    difTabla1.current.setTitulo('Modificar');
    difTabla1.current.abrir();
  };

  const onInsertar = async () => {
    setAccion('insertar');
    setCondFormulario({
      condicion: `${hookFormulario.configuracion.campoPrimario} = ?`,
      valores: ['-1']
    });
    difTabla1.current.setTotalColumnasSkeleton(
      tabTabla1.current.getColumnas().filter((_col) => _col.visible === true).length
    );
    difTabla1.current.setTitulo('Crear');
    difTabla1.current.abrir();
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
              height={windowSize.height - 320}
              ref={tabTabla1}
              filasPorPagina={20}
              onModificar={onModificar}
              onInsertar={onInsertar}
              showBotonInsertar
              showBotonEliminar
              numeroTabla={1}
              tablaConfiguracion={id}
              lectura
              showRowIndex
              hookFormulario={hookFormulario}
            />
          </TableContainer>
        </Card>
      </Container>
      <DialogoFormulario
        ref={difTabla1}
        numeroTabla={1}
        nombreTabla={hookFormulario.configuracion?.nombreTabla}
        campoPrimario={hookFormulario.configuracion?.campoPrimario}
        campoOrden={hookFormulario.configuracion?.campoOrden}
        condiciones={condFormulario}
        onAceptar={guardar}
        loading={isGuardar}
      />
    </Page>
  );
}
