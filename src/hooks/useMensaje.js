/**
 * Hook para desplegar mensajes en la Pantalla
 * Fecha Creación: 22-06-2021
 * Author: DFJG
 */
import { useSnackbar } from 'notistack';

export default function useMensaje() {
  const { enqueueSnackbar } = useSnackbar();

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
      autoHideDuration: 3500,
      variant
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
