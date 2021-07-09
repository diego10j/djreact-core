import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
// material
import { Dialog, DialogContent } from '@material-ui/core';
// utils
import { isDefined } from '../../../utils/utilitario';
import TituloDialogo from './TituloDialogo';
import BotonesDialogo from './BotonesDialogo';
// ----------------------------------------------------------------------

const DialogoFormulario = forwardRef(
  (
    {
      titulo = 'Formulario',
      onCancelar,
      onAceptar,
      labelAceptar,
      labelCancelar,
      showBotonAceptar,
      showBotonCancelar,
      loading,
      ...other
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      open,
      setOpen,
      abrir,
      cerrar
    }));

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
        <DialogContent sx={{ pb: 0 }}>Formulario XD</DialogContent>
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
  titulo: PropTypes.string,
  onCancelar: PropTypes.func.isRequired,
  onAceptar: PropTypes.func.isRequired,
  labelAceptar: PropTypes.string,
  labelCancelar: PropTypes.string,
  showBotonAceptar: PropTypes.bool,
  showBotonCancelar: PropTypes.bool,
  loading: PropTypes.bool
};

export default DialogoFormulario;
