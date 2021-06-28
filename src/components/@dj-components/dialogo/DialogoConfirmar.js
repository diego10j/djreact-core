import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { withStyles, alpha } from '@material-ui/core/styles';
// material
import { Button, Dialog, Typography, DialogActions, DialogContent, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// icons
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// utils
import { isDefined } from '../../../utils/utilitario';
// ----------------------------------------------------------------------

const StyledHelpOutlineIcon = withStyles((theme) => ({
  root: {
    fontSize: 100,
    color: alpha(theme.palette.primary.main, 0.5)
  }
}))(HelpOutlineIcon);

const DialogoConfirmar = forwardRef(
  (
    {
      mensaje,
      onCancelar,
      onAceptar,
      titulo = 'Confirmar',
      labelCancelar = 'No',
      labelAceptar = 'Si',
      loading = false,
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

    return (
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            cerrar();
          }
        }}
        disableEscapeKeyDown
        {...other}
      >
        <DialogContent sx={{ pb: 0 }}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={1} sx={{ pb: 2 }}>
            <StyledHelpOutlineIcon className="animate__animated animated animate__heartBeat" />
            <Typography gutterBottom variant="h3">
              {titulo}
            </Typography>
            <Typography variant="subtitle1" sx={{ px: 3, fontWeight: 400, fontSize: 18 }}>
              {mensaje}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            variant="outlined"
            onClick={() => {
              if (!isDefined(onCancelar)) {
                cerrar();
              } else {
                onCancelar();
              }
            }}
            sx={{ minWidth: 100 }}
          >
            {labelCancelar}
          </Button>
          <LoadingButton variant="contained" onClick={onAceptar} autoFocus sx={{ minWidth: 100 }} loading={loading}>
            {labelAceptar}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
);

DialogoConfirmar.propTypes = {
  mensaje: PropTypes.string.isRequired,
  labelAceptar: PropTypes.string,
  labelCancelar: PropTypes.string,
  loading: PropTypes.bool,
  onCancelar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onAceptar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  titulo: PropTypes.string
};

export default DialogoConfirmar;
