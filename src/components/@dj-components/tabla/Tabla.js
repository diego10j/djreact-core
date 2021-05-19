import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import PropTypes from 'prop-types';
// components
import TablaReact from './TablaReact';
import { TextoTabla } from './FilaEditable';
import axios from '../../../utils/axios';
import { isDefined } from '../../../utils/utilitario';

const Tabla = forwardRef(
  (
    {
      numeroTabla,
      nombreTabla,
      campoPrimario,
      lectura = true,
      tipoFormulario = false,
      campoOrden,
      opcionesColumnas,
      filasPorPagina = 15
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      getColumnas,
      getDatos,
      getColumna,
      getFilaSeleccionada,
      getValorSeleccionado,
      getInsertadas,
      getEliminadas,
      getModificadas,
      isFilaModificada,
      isFilaEliminada,
      isFilaInsertada
    }));

    const [isColumnas, setIsColumnas] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [columns, setColumns] = useState([]);
    const [columnasOcultas, setColumnasOcultas] = useState([]);
    const [data, setData] = useState([]);
    const [skipPageReset, setSkipPageReset] = useState(false);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [modificadas, setModificadas] = useState([]);
    const [insertadas, setInsertadas] = useState([]);
    const [eliminadas, setEliminadas] = useState([]);

    useEffect(() => {
      getServicioColumnas();
      getServicioDatos();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (!tipoFormulario) {
        const colOcultas = columns
          .filter((_col) => _col.visible === false)
          .map((_element) => _element.nombre);
        setColumnasOcultas(colOcultas);
      }
    }, [columns]); // eslint-disable-line react-hooks/exhaustive-deps

    const getServicioDatos = async () => {
      try {
        console.log('---CARGA DATOS');
        setCargando(true);
        const { data } = await axios.post('/api/sistema/consultarTabla', {
          nombreTabla,
          campoPrimario,
          campoOrden: campoOrden || campoPrimario,
          condiciones: []
        });
        setData([]);
        setData(data.datos);
        setCargando(false);
      } catch (error) {
        setCargando(false);
        console.error(error);
      }
    };

    /**
     * Obtiene las columnas del servicio web
     */
    const getServicioColumnas = async () => {
      console.log('---CARGA COLUMNAS');
      try {
        const { data } = await axios.post('/api/sistema/getColumnas', {
          nombreTabla,
          campoPrimario,
          ide_opci: 0,
          numero_tabl: numeroTabla
        });
        formarColumnas(data.datos);
      } catch (error) {
        console.error(error);
      }
    };

    const formarColumnas = (cols) => {
      if (opcionesColumnas) {
        console.log('---FORMAR COLUMNAS');
        // Aplica cada configuración realizada a las columnas
        opcionesColumnas.forEach((_columna) => {
          const colActual = cols.find(
            (_col) => _col.nombre === _columna.nombre.toLowerCase()
          );
          if (colActual) {
            colActual.visible =
              'visible' in _columna ? _columna.visible : colActual.visible;
            colActual.filtro =
              'filtro' in _columna ? _columna.filtro : colActual.filtro;
            colActual.nombrevisual =
              'nombreVisual' in _columna
                ? _columna.nombreVisual.toUpperCase()
                : colActual.nombrevisual;
            colActual.valordefecto =
              'valorDefecto' in _columna
                ? _columna.valorDefecto
                : colActual.valordefecto;
            colActual.requerida =
              'requerida' in _columna
                ? _columna.requerida
                : colActual.requerida;
            colActual.lectura =
              'lectura' in _columna ? _columna.lectura : colActual.lectura;
            colActual.orden =
              'orden' in _columna ? _columna.orden : colActual.orden;
            colActual.anchocolumna =
              'anchoColumna' in _columna
                ? _columna.anchoColumna
                : colActual.anchocolumna;
            colActual.decimales =
              'decimales' in _columna
                ? _columna.decimales
                : colActual.decimales;
            colActual.comentario =
              'comentario' in _columna
                ? _columna.comentario
                : colActual.comentario;
            colActual.mayuscula =
              'mayuscula' in _columna
                ? _columna.mayuscula
                : colActual.mayuscula;
            colActual.alinear =
              'alinear' in _columna ? _columna.alinear : colActual.alinear;
            colActual.ordenable =
              'ordenable' in _columna
                ? _columna.ordenable
                : colActual.ordenable;
          } else {
            throw new Error(`Error la columna ${_columna.nombre} no existe`);
          }
        });
      }
      // ordena las columnas
      cols.sort((a, b) => (a.orden < b.orden ? -1 : 1));

      // configuraciones para React Table
      if (!tipoFormulario) {
        cols.forEach((_columna) => {
          // Si la tabla es de lectura todas las columnas son de lectura
          if (lectura) {
            _columna.lectura = true;
          }
          _columna.accessor = _columna.nombre;
          _columna.filter = 'fuzzyText';
          _columna.width = _columna.anchocolumna * 16;

          if (!_columna.lectura) {
            _columna.Cell = TextoTabla;
          }
        });
      }
      setColumns(cols);
      setIsColumnas(true);
    };

    /**
     * Retorna un objeto columna
     * @param nombreColumna
     */
    const getColumna = (nombreColumna) => {
      nombreColumna = nombreColumna.toLowerCase();
      const col = columns.find((col) => col.nombre === nombreColumna);
      if (!isDefined(col)) {
        throw new Error(`Error la columna ${nombreColumna} no existe`);
      }
      return col;
    };
    /**
     * Retorna el valor del campo primario de la fila seleccionada
     * @returns
     */
    const getValorSeleccionado = () => filaSeleccionada[campoPrimario];
    const getColumnas = () => columns;
    const getDatos = () => data;
    const getFilaSeleccionada = () => filaSeleccionada;
    const getInsertadas = () => insertadas;
    const getEliminadas = () => eliminadas;
    const getModificadas = () => modificadas;

    /**
     * Retorna si una fila es insertada
     * @param {*} valorPrimario
     * @returns
     */
    const isFilaInsertada = (valorPrimario) => {
      const fila = insertadas.find(
        (col) => col[campoPrimario] === valorPrimario
      );
      if (isDefined(fila)) {
        return true;
      }
      return false;
    };

    /**
     * Retorna si una fila es modificada
     * @param {*} valorPrimario
     * @returns
     */
    const isFilaModificada = (valorPrimario) => {
      const fila = modificadas.find(
        (col) => col[campoPrimario] === valorPrimario
      );
      if (isDefined(fila)) {
        return true;
      }
      return false;
    };

    /**
     * Retorna si una fila es eliminada
     * @param {*} valorPrimario
     * @returns
     */
    const isFilaEliminada = (valorPrimario) => {
      const fila = eliminadas.find(
        (col) => col[campoPrimario] === valorPrimario
      );
      if (isDefined(fila)) {
        return true;
      }
      return false;
    };

    /**
     * Actualiza la tabla a su estado original
     */
    const actualizar = async () => {
      setModificadas([]);
      setEliminadas([]);
      setInsertadas([]);
      await getServicioDatos();
    };

    /**
     * Se ejecuta cuando algun dato de la tabla se modifica
     * @param {*} rowIndex
     * @param {*} columnId
     * @param {*} value
     */
    const modificarFila = ({ nombre, lectura }, value) => {
      const valorSeleccionado = getValorSeleccionado();
      // Valida que la columna no sea solo lectura
      if (lectura === false) {
        // si no es fila insertada
        if (!isFilaInsertada(valorSeleccionado)) {
          // busca si ya se a modificado la fila
          const fila = modificadas.find((col) => col.id === valorSeleccionado);
          if (!isDefined(fila)) {
            // Primera modificación
            const colModificadas = {};
            colModificadas[nombre] = value;
            const newFilaM = {
              id: valorSeleccionado,
              colModificadas
            };
            setModificadas((elements) => [...elements, newFilaM]);
          } else {
            // Agrega modificaciones
            const { colModificadas } = fila;
            colModificadas[nombre] = value;
            setModificadas((elements) => [
              ...elements.filter((item) => item.id !== valorSeleccionado),
              fila
            ]);
          }
        }
        // Propagar si tiene evento
        // .....
      }
    };

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    useEffect(() => {
      setSkipPageReset(false);
    }, [data]);

    return (
      <>
        <TablaReact
          columns={columns}
          data={data}
          cargando={cargando}
          isColumnas={isColumnas}
          setData={setData}
          skipPageReset={skipPageReset}
          columnasOcultas={columnasOcultas}
          filasPorPagina={filasPorPagina}
          modificarFila={modificarFila}
          setFilaSeleccionada={setFilaSeleccionada}
          actualizar={actualizar}
        />
      </>
    );
  }
);
Tabla.propTypes = {
  numeroTabla: PropTypes.number.isRequired,
  nombreTabla: PropTypes.string.isRequired,
  campoPrimario: PropTypes.string.isRequired,
  campoOrden: PropTypes.string,
  tipoFormulario: PropTypes.bool,
  filasPorPagina: PropTypes.number,
  lectura: PropTypes.bool,
  opcionesColumnas: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      nombreVisual: PropTypes.string,
      valorDefecto: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      requerida: PropTypes.bool,
      visible: PropTypes.bool,
      filtro: PropTypes.bool,
      lectura: PropTypes.bool,
      orden: PropTypes.number,
      anchoColumna: PropTypes.number,
      decimales: PropTypes.number,
      comentario: PropTypes.string,
      mayusculas: PropTypes.bool,
      alinear: PropTypes.oneOf(['izquierda', 'derecha', 'centro']),
      ordenable: PropTypes.bool
    })
  )
};

export default Tabla;
