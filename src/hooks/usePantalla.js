import useMensaje from './useMensaje';
import axios from '../utils/axios';

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
        await axios.post('api/sistema/ejecutarLista', {
          listaSQL
        });
        for (let i = 0; i < tablas.length; i += 1) {
          const tabla = tablas[i].current;
          tabla.commit();
          tabla.setCargando(false);
        }
        mensaje.mensajeExito('Datos guardados exitosamente');
      } catch (err) {
        mensaje.mensajeError(err.error.mensaje);
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
