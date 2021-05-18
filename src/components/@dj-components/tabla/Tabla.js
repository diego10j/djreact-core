import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// components
import TablaReact from './TablaReact';
import { TextoTabla } from './FilaEditable';
import axios from '../../../utils/axios';
import { isDefined } from '../../../utils/utilitario';

export default function Tabla({
  numeroTabla,
  nombreTabla,
  campoPrimario,
  lectura = true,
  tipoFormulario = false,
  campoOrden,
  opcionesColumnas,
  filasPorPagina = 15
}) {
  const [isColumnas, setIsColumnas] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [columns, setColumns] = useState([]);
  const [columnasOcultas, setColumnasOcultas] = useState([]);
  const [data, setData] = useState([]);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [filaSeleccionada, setFilaSeleccionada] = useState(undefined);
  const [modificadas, setModificadas] = useState([]);
  const [insertadas, setInsertadas] = useState([]);
  const [eliminadas, setEliminadas] = useState([]);

  useEffect(() => {
    getColumnas();
    getDatos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!tipoFormulario) {
      const colOcultas = columns
        .filter((_col) => _col.visible === false)
        .map((_element) => _element.nombre);
      setColumnasOcultas(colOcultas);
    }
  }, [columns]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Obtiene la data de la tabla
   */
  const getDatos = () => {
    try {
      console.log('---CARGA DATOS');
      setCargando(true);
      axios
        .post('/api/sistema/consultarTabla', {
          nombreTabla,
          campoPrimario,
          campoOrden: campoOrden || campoPrimario,
          condiciones: []
        })
        .then((response) => {
          const { data } = response;
          setData(data.datos);
          setCargando(false);
        });
    } catch (error) {
      setCargando(false);
      console.error(error);
    }
  };

  /**
   * Obtiene las columnas del servicio web
   */
  const getColumnas = async () => {
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
            'requerida' in _columna ? _columna.requerida : colActual.requerida;
          colActual.lectura =
            'lectura' in _columna ? _columna.lectura : colActual.lectura;
          colActual.orden =
            'orden' in _columna ? _columna.orden : colActual.orden;
          colActual.anchocolumna =
            'anchoColumna' in _columna
              ? _columna.anchoColumna
              : colActual.anchocolumna;
          colActual.decimales =
            'decimales' in _columna ? _columna.decimales : colActual.decimales;
          colActual.comentario =
            'comentario' in _columna
              ? _columna.comentario
              : colActual.comentario;
          colActual.mayuscula =
            'mayuscula' in _columna ? _columna.mayuscula : colActual.mayuscula;
          colActual.alinear =
            'alinear' in _columna ? _columna.alinear : colActual.alinear;
          colActual.ordenable =
            'ordenable' in _columna ? _columna.ordenable : colActual.ordenable;
        } else {
          throw new Error(`Error la columna ${_columna.nombre} no existe`);
        }
      });
    }
    // ordena las columnas
    cols.sort((a, b) => (a.orden < b.orden ? -1 : 1));

    // configuraciones para React Table
    if (!tipoFormulario) {
      cols.forEach((_columna, index) => {
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

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          // console.log(rowIndex);
          // console.log(columnId);
          // console.log(row);
          // console.log(value);
          return {
            ...old[rowIndex],
            [columnId]: value
          };
        }
        return row;
      })
    );
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
  const getValorSeleccionado = () => {
    if (isDefined(filaSeleccionada)) {
      return filaSeleccionada[campoPrimario];
    }
  };

  /**
   * Retorna si una fila es insertada
   * @param {*} valorPrimario
   * @returns
   */
  const isFilaInsertada = (valorPrimario) => {
    const fila = insertadas.find((col) => col[campoPrimario] === valorPrimario);
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
    const fila = eliminadas.find((col) => col[campoPrimario] === valorPrimario);
    if (isDefined(fila)) {
      return true;
    }
    return false;
  };

  const modificarFila = (rowIndex, columnId, value) => {
    const columna = getColumna(columnId);
    const valorSeleccionado = getValorSeleccionado();
    // Valida que la columna no sea solo lectura
    if (columna.lectura === false) {
      // si no es fila insertada
      if (!isFilaInsertada(valorSeleccionado)) {
        // busca si ya se a modificado la fila
        const fila = modificadas.find(
          (col) => col[campoPrimario] === valorSeleccionado
        );
        if (!isDefined(fila)) {
          let colModificadas = [];
          const valoresModificados = {};
          if (isDefined(fila?.colModificadas)) {
            colModificadas = fila.colModificadas;
          }
          if (colModificadas.indexOf(columna.nombre) === -1) {
            colModificadas.push(columna.nombre);
            valoresModificados[columna.nombre] = value;
          }
          console.log(colModificadas);
          const newFilaM = {};
          // no se a modificado
          newFilaM[campoPrimario] = valorSeleccionado;
          newFilaM.valoresModificados = valoresModificados;
          console.log(newFilaM);
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
        isColumnas={isColumnas}
        setData={setData}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        columnasOcultas={columnasOcultas}
        filasPorPagina={filasPorPagina}
        modificarFila={modificarFila}
        setFilaSeleccionada={setFilaSeleccionada}
      />
    </>
  );
}

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
