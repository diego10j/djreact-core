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
import DialogoFormulario from '../../components/@dj-components/dialogo/DialogoFormulario';
import DialogoConfirmar from '../../components/@dj-components/dialogo/DialogoConfirmar';
// hooks
import usePantalla from '../../hooks/usePantalla';
import useWidth from '../../hooks/useWidth';
import useForm from '../../hooks/useForm';
// util
import { getTituloPantalla } from '../../utils/utilitario';

// ----------------------------------------------------------------------

export default function SimpleUI() {
  const tabTabla1 = useRef(); // Tabla
  const difTabla1 = useRef(); // DialogoFormulario
  const diaConfirmar = useRef(); // DialogoConfirmar

  const { id } = useParams();
  const pantalla = usePantalla();
  const { windowSize } = useWidth();
  const hookFormulario = useForm(); // hook Formulario

  const titulo = getTituloPantalla();

  const [isGuardar, setIsGuardar] = useState(false);
  const [accion, setAccion] = useState();
  const [condFormulario, setCondFormulario] = useState();

  /**
   * Guarda los cambios en el Formulario
   */
  const guardar = async () => {
    setIsGuardar(true);
    if (await difTabla1.current.getTabla().isGuardar()) {
      if ((await pantalla.guardar(difTabla1.current.tabla)) === true) {
        const { getFormatoFrontFilaSeleccionada } = difTabla1.current.getTabla();
        const { indiceTabla, data } = tabTabla1.current;

        if (accion === 'modificar') {
          // actualiza la data de la tabla con los valores del formulario
          tabTabla1.current.updateMyDataByRow(indiceTabla, getFormatoFrontFilaSeleccionada());
        } else if (accion === 'insertar') {
          // inserta una fila
          const newData = [getFormatoFrontFilaSeleccionada(), ...data];
          tabTabla1.current.setData(newData);
          tabTabla1.current.seleccionarFilaPorIndice(0);
          tabTabla1.current.pintarFilaTablaReact();
        }
      }
      difTabla1.current.cerrar();
    }
    setIsGuardar(false);
  };

  /**
   * Configura el DialogoFormulario para la accion Modificar
   */
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

  /**
   * Configura el DialogoFormulario para la accion Insertar
   */
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

  /**
   * Despliega el DialogoConfirmar
   */
  const onEliminar = async () => {
    setCondFormulario({
      condicion: `${hookFormulario.configuracion.campoPrimario} = ?`,
      valores: [tabTabla1.current.getValorSeleccionado()]
    });
    diaConfirmar.current.abrir();
  };

  /**
   * Elimina el registro
   */
  const eliminar = async () => {
    setIsGuardar(true);
    const objEliminar = pantalla.getSqlEliminar(hookFormulario.configuracion.nombreTabla, [condFormulario]);
    if ((await pantalla.ejecutarListaSql([objEliminar])) === true) {
      // Elimina de la tabla
      const { data, filaSeleccionada } = tabTabla1.current;
      tabTabla1.current.setData(
        data.filter(
          (item) =>
            item[hookFormulario.configuracion.campoPrimario] !==
            filaSeleccionada[hookFormulario.configuracion.campoPrimario]
        )
      );
      // Borra seleccion
      tabTabla1.current.limpiarSeleccion();
    }
    diaConfirmar.current.cerrar();
    setIsGuardar(false);
  };

  return (
    <Page title={titulo}>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={titulo}
          links={[{ name: 'Sistema', href: PATH_DASHBOARD.root }, { name: titulo }]}
        />
        <Card>
          <TableContainer sx={{ padding: 2 }}>
            <Tabla
              height={windowSize.height - 320}
              ref={tabTabla1}
              filasPorPagina={20}
              onModificar={onModificar}
              onInsertar={onInsertar}
              onEliminar={onEliminar}
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
      <DialogoConfirmar
        ref={diaConfirmar}
        mensaje="Está seguro de que desea eliminar el registro seleccionado ?"
        onAceptar={eliminar}
        loading={isGuardar}
      />
    </Page>
  );
}
