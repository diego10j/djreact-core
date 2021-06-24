/**
 * Hook para desplegar mensajes en la Pantalla
 * Fecha Creación: 22-06-2021
 * Author: DFJG
 */
import { useSnackbar } from 'notistack';

export default function useMensaje() {
  const { enqueueSnackbar } = useSnackbar();

  const showMensaje = (mensaje) => {
    configurarMensaje(mensaje);
  };

  const showMensajeExito = (mensaje) => {
    configurarMensaje(mensaje, 'success');
  };

  const showMensajeError = (mensaje) => {
    configurarMensaje(mensaje, 'error');
  };

  const showMensajeInfo = (mensaje) => {
    configurarMensaje(mensaje, 'info');
  };

  const showMensajeAdvertencia = (mensaje) => {
    configurarMensaje(mensaje, 'warning');
  };

  const configurarMensaje = (mensaje, variant = 'default') => {
    enqueueSnackbar(mensaje, {
      autoHideDuration: 3500,
      variant
    });
  };

  return {
    showMensaje,
    showMensajeExito,
    showMensajeError,
    showMensajeInfo,
    showMensajeAdvertencia
  };
}
