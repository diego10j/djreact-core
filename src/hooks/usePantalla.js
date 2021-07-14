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

  /**
   * Retorna el objeto sql Eliminar para el API
   * @param {string} nombreTabla
   * @param {Array [{condicion: '' , valores}]} condiciones
   * @returns
   */
  const getSqlEliminar = (nombreTabla, condiciones) => {
    const resp = {
      tipo: 'eliminar',
      nombreTabla,
      condiciones
    };
    return resp;
  };

  const guardar = async (...tablas) => {
    const listaSQL = [];
    for (let i = 0; i < tablas.length; i += 1) {
      const tabla = tablas[i].current;
      const lista = tabla.guardar();
      if (lista.length > 0) {
        // tabla.setCargando(true);
        listaSQL.push(...lista);
      }
    }
    if (listaSQL.length > 0) {
      try {
        await ejecutarListaSQL(listaSQL);
        for (let i = 0; i < tablas.length; i += 1) {
          const tabla = tablas[i].current;
          tabla.commit();
          // tabla.setCargando(false);
        }
        mensaje.showMensajeExito('Datos guardados exitosamente');
      } catch (error) {
        mensaje.showMensajeError(error.mensaje);
        return false;
        // for (let i = 0; i < tablas.length; i += 1) {
        // const tabla = tablas[i].current;
        // tabla.setCargando(false);
        // }
      }
    }
    return true;
  };

  /**
   * Ejecuta una lista de Objetos Sql
   * @param {Array} listaSQL
   * @param {Boolean} mensaje
   * @returns
   */
  const ejecutarListaSql = async (listaSQL, showMensaje = true) => {
    try {
      await ejecutarListaSQL(listaSQL);
      if (showMensaje === true) mensaje.showMensajeExito('Datos guardados exitosamente');
    } catch (error) {
      mensaje.showMensajeError(error.mensaje);
      return false;
    }
    return true;
  };

  return {
    guardar,
    mensaje,
    getSqlEliminar,
    ejecutarListaSql
  };
}
