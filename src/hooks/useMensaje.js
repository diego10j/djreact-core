/**
 * Hook para desplegar mensajes en la Pantalla
 * Fecha Creación: 22-06-2021
 * Author: DFJG
 */
import { useSnackbar } from 'notistack';
import { useModalError } from '../contexts/ErrorContext';

export default function useMensaje() {
  const { enqueueSnackbar } = useSnackbar();
  const { setModal } = useModalError();

  const showMensaje = (mensaje) => {
    configurarMensaje(mensaje);
  };

  const showMensajeExito = (mensaje) => {
    configurarMensaje(mensaje, 'success');
  };

  const showMensajeError = (mensaje) => {
    configurarMensaje(mensaje, 'error');
  };

  /**
   * Despliega el Dialogo Modal con el mensaje de error
   * @param {string} mensaje
   * @param {string} titulo
   */
  const showError = (mensaje, titulo = 'Error') => {
    setModal({ mensaje, titulo });
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
    showMensajeAdvertencia,
    showError
  };
}
