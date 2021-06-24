/**
 * Hook para las páginas que contienen componentes de tipo Tabla
 * Fecha Creación: 22-06-2021
 * Author: DFJG
 */
// servicios
import { ejecutarListaSQL } from '../services/sistema/servicioSistema';
// hooks
import useMensaje from './useMensaje';

export default function usePantalla() {
  const mensaje = useMensaje();

  const guardar = async (...tablas) => {
    const listaSQL = [];
    for (let i = 0; i < tablas.length; i += 1) {
      const tabla = tablas[i].current;
      const lista = tabla.guardar();
      if (lista.length > 0) {
        tabla.setCargando(true);
        listaSQL.push(...lista);
      }
    }
    if (listaSQL.length > 0) {
      try {
        await ejecutarListaSQL(listaSQL);
        for (let i = 0; i < tablas.length; i += 1) {
          const tabla = tablas[i].current;
          tabla.commit();
          tabla.setCargando(false);
        }
        mensaje.showMensajeExito('Datos guardados exitosamente');
      } catch (error) {
        mensaje.showMensajeError(error.mensaje);
        for (let i = 0; i < tablas.length; i += 1) {
          const tabla = tablas[i].current;
          tabla.setCargando(false);
        }
      }
    }
  };

  return {
    guardar,
    mensaje
  };
}
