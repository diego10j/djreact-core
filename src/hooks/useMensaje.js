import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

export default function useMensaje() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const mensaje = (mensaje) => {
    configurarMensaje(mensaje);
  };

  const mensajeExito = (mensaje) => {
    configurarMensaje(mensaje, 'success');
  };

  const mensajeError = (mensaje) => {
    configurarMensaje(mensaje, 'error');
  };

  const mensajeInfo = (mensaje) => {
    configurarMensaje(mensaje, 'info');
  };

  const mensajeAdvertencia = (mensaje) => {
    configurarMensaje(mensaje, 'warning');
  };

  const configurarMensaje = (mensaje, variant = 'default') => {
    enqueueSnackbar(mensaje, {
      variant,
      autoHideDuration: 3500,
      preventDuplicate: true,
      action: (key) => (
        <IconButton aria-label="close" onClick={() => closeSnackbar(key)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )
    });
  };

  return {
    mensaje,
    mensajeExito,
    mensajeError,
    mensajeInfo,
    mensajeAdvertencia
  };
}
