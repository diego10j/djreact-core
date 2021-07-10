import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
// material
import { Dialog, DialogContent } from '@material-ui/core';
// componentes
import TituloDialogo from './TituloDialogo';
import BotonesDialogo from './BotonesDialogo';
import Tabla from '../tabla/Tabla';
// utils
import { isDefined } from '../../../utils/utilitario';

// ----------------------------------------------------------------------

const DialogoFormulario = forwardRef(
  (
    {
      titulo = 'Formulario',
      numeroTabla,
      nombreTabla,
      campoPrimario,
      condiciones,
      opcionesColumnas,
      campoOrden,
      onCancelar,
      onAceptar,
      labelAceptar,
      labelCancelar,
      showBotonAceptar,
      showBotonCancelar,
      loading,
      hookFormulario,
      totalColumnasSkeleton = 6,
      numeroColFormulario = 2,
      ...other
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      open,
      setOpen,
      abrir,
      cerrar,
      getTabla
    }));

    const frmFormulario = useRef();

    const [open, setOpen] = useState(false);

    const abrir = () => {
      setOpen(true);
    };

    const cerrar = () => {
      setOpen(false);
    };

    const handleCancelar = () => {
      cerrar();
      if (isDefined(onCancelar)) {
        onCancelar();
      }
    };

    const getTabla = () => frmFormulario.current;

    return (
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCancelar();
          }
        }}
        disableEscapeKeyDown
        {...other}
      >
        <TituloDialogo onClose={cerrar}>{titulo}</TituloDialogo>
        <DialogContent sx={{ pb: 0 }}>
          <Tabla
            ref={frmFormulario}
            numeroTabla={numeroTabla}
            nombreTabla={nombreTabla}
            campoPrimario={campoPrimario}
            campoOrden={campoOrden}
            condiciones={condiciones}
            opcionesColumnas={opcionesColumnas}
            showToolbar={false}
            showPaginador={false}
            showBuscar={false}
            tipoFormulario
            numeroColFormulario={numeroColFormulario}
            totalColumnasSkeleton={totalColumnasSkeleton}
            hookFormulario={hookFormulario}
          />
        </DialogContent>
        <BotonesDialogo
          labelAceptar={labelAceptar}
          labelCancelar={labelCancelar}
          showBotonAceptar={showBotonAceptar}
          showBotonCancelar={showBotonCancelar}
          loading={loading}
          onAceptar={onAceptar}
          onCancelar={handleCancelar}
        />
      </Dialog>
    );
  }
);

DialogoFormulario.propTypes = {
  numeroTabla: PropTypes.number.isRequired,
  nombreTabla: PropTypes.string.isRequired,
  campoPrimario: PropTypes.string.isRequired,
  condiciones: PropTypes.object.isRequired,
  campoOrden: PropTypes.string,
  opcionesColumnas: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      nombreVisual: PropTypes.string,
      valorDefecto: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.object]),
      requerida: PropTypes.bool,
      visible: PropTypes.bool,
      lectura: PropTypes.bool,
      orden: PropTypes.number,
      decimales: PropTypes.number,
      comentario: PropTypes.string,
      mayusculas: PropTypes.bool,
      alinear: PropTypes.oneOf(['izquierda', 'derecha', 'centro']),
      combo: PropTypes.shape({
        nombreTabla: PropTypes.string.isRequired,
        campoPrimario: PropTypes.string.isRequired,
        campoNombre: PropTypes.string.isRequired,
        condicion: PropTypes.string
      }),
      avatar: PropTypes.shape({
        campoNombre: PropTypes.string.isRequired
      })
    })
  ),
  titulo: PropTypes.string,
  onCancelar: PropTypes.func,
  onAceptar: PropTypes.func.isRequired,
  labelAceptar: PropTypes.string,
  labelCancelar: PropTypes.string,
  showBotonAceptar: PropTypes.bool,
  showBotonCancelar: PropTypes.bool,
  loading: PropTypes.bool,
  hookFormulario: PropTypes.object,
  totalColumnasSkeleton: PropTypes.number,
  numeroColFormulario: PropTypes.number
};

export default DialogoFormulario;
