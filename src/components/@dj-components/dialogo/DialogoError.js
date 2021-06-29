import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, alpha } from '@material-ui/core/styles';

// material
import { Button, Dialog, Typography, DialogContent, Stack } from '@material-ui/core';
// icons
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import ThemeConfig from '../../../theme';
// ----------------------------------------------------------------------

const StyledCancelOutlinedIcon = withStyles((theme) => ({
  root: {
    fontSize: 100,
    color: alpha(theme.palette.error.main, 0.6)
  }
}))(CancelOutlinedIcon);

export default function DialogoError({
  unSetModal,
  mensaje = 'Algo salió mal. Por favor, inténtelo de nuevo más tarde',
  titulo = 'Error',
  labelAceptar = 'Aceptar'
}) {
  return (
    <ThemeConfig>
      <Dialog
        open
        onClose={() => {
          unSetModal();
        }}
      >
        <DialogContent sx={{ pb: 0 }}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={1} sx={{ pb: 2 }}>
            <StyledCancelOutlinedIcon className="animate__animated animated animate__shakeX" />
            <Typography gutterBottom variant="h4">
              {titulo}
            </Typography>
            <Typography variant="subtitle1" sx={{ px: 3, fontWeight: 400, fontSize: 18 }}>
              {mensaje}
            </Typography>
          </Stack>
        </DialogContent>

        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ pb: 3, pt: 2 }}>
          <Button variant="contained" onClick={unSetModal} sx={{ minWidth: 100 }}>
            {labelAceptar}
          </Button>
        </Stack>
      </Dialog>
    </ThemeConfig>
  );
}

DialogoError.propTypes = {
  mensaje: PropTypes.string,
  labelAceptar: PropTypes.string,
  unSetModal: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  titulo: PropTypes.string
};
