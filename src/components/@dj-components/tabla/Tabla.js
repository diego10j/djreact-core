import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
// components
import TablaReact from './TablaReact';
import { CheckLectura, ComboLectura } from './FilaLectura';
import axios from '../../../utils/axios';
import { isDefined } from '../../../utils/utilitario';
import useMensaje from '../../../hooks/useMensaje';

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
      filasPorPagina = 15,
      validarInsertar = false
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
      isFilaInsertada,
      getFila,
      isEmpty,
      getTotalFilas
    }));
    const msg = useMensaje();
    const [skipPageReset, setSkipPageReset] = useState(false);
    const [isColumnas, setIsColumnas] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [columns, setColumns] = useState([]);
    const [columnasOcultas, setColumnasOcultas] = useState([]);
    const [data, setData] = useState([]);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [eliminadas, setEliminadas] = useState([]);
    const [combos, setCombos] = useState([]);

    useEffect(() => {
      getServicioColumnas();
      getServicioDatos();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (!tipoFormulario) {
        // Oculta columnas para la TablaReact
        const colOcultas = columns.filter((_col) => _col.visible === false).map((_element) => _element.nombre);
        setColumnasOcultas(colOcultas);
      }
    }, [columns]); // eslint-disable-line react-hooks/exhaustive-deps

    const getServicioDatos = async () => {
      try {
        console.log('---CARGA DATOS');
        setCargando(true);
        const { data } = await axios.post('/api/sistema/consultarTabla', {
          nombreTabla: nombreTabla.toLowerCase(),
          campoPrimario: campoPrimario.toLowerCase(),
          campoOrden: campoOrden || campoPrimario,
          condiciones: []
        });
        setCargando(false);
        setData([]);
        setData(data.datos);
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

    /**
     * Obtiene las columnas del servicio web
     */
    const getServicioCombo = async (columna) => {
      console.log('---CARGA COMBO');
      try {
        const { data } = await axios.post('api/sistema/getCombo', {
          nombreTabla: columna.nombreTablaCombo.toLowerCase(),
          campoPrimario: columna.campoPrimarioCombo.toLowerCase(),
          campoNombre: columna.campoNombreCombo.toLowerCase(),
          condicion: columna.condicionCombo
        });
        setCombos((elements) => [
          ...elements,
          {
            columna: columna.campoPrimarioCombo.toLowerCase(),
            listaCombo: data.datos
          }
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    const getServicioIsEliminar = async () => {
      try {
        const { data } = await axios.post('api/sistema/isEliminar', {
          nombreTabla: nombreTabla.toLowerCase(),
          campoPrimario: campoPrimario.toLowerCase(),
          valorCampoPrimario: getValorSeleccionado()
        });
        return !isDefined(data.datos);
      } catch (error) {
        return false;
      }
    };

    const formarColumnas = (cols) => {
      if (opcionesColumnas) {
        console.log('---FORMAR COLUMNAS');
        // Aplica cada configuración realizada a las columnas
        opcionesColumnas.forEach(async (_columna) => {
          const colActual = cols.find((_col) => _col.nombre === _columna.nombre.toLowerCase());
          if (colActual) {
            colActual.visible = 'visible' in _columna ? _columna.visible : colActual.visible;
            colActual.filtro = 'filtro' in _columna ? _columna.filtro : colActual.filtro;
            colActual.nombrevisual =
              'nombreVisual' in _columna ? _columna.nombreVisual.toUpperCase() : colActual.nombrevisual;
            colActual.valordefecto = 'valorDefecto' in _columna ? _columna.valorDefecto : colActual.valordefecto;
            colActual.requerida = 'requerida' in _columna ? _columna.requerida : colActual.requerida;
            colActual.lectura = 'lectura' in _columna ? _columna.lectura : colActual.lectura;
            colActual.orden = 'orden' in _columna ? _columna.orden : colActual.orden;
            colActual.decimales = 'decimales' in _columna ? _columna.decimales : colActual.decimales;
            colActual.comentario = 'comentario' in _columna ? _columna.comentario : colActual.comentario;
            colActual.mayuscula = 'mayuscula' in _columna ? _columna.mayuscula : colActual.mayuscula;
            colActual.alinear = 'alinear' in _columna ? _columna.alinear : colActual.alinear;
            colActual.ordenable = 'ordenable' in _columna ? _columna.ordenable : colActual.ordenable;
            colActual.width = 'width' in _columna ? _columna.width : colActual.width;
          } else {
            throw new Error(`Error la columna ${_columna.nombre} no existe`);
          }
          if (isDefined(_columna.combo)) {
            // Configuracion combo
            // Valor por defecto ''
            if (!isDefined(colActual.valordefecto)) {
              colActual.valordefecto = '';
            }
            colActual.componente = 'Combo';
            colActual.anchocolumna = 20;
            colActual.nombreTablaCombo = _columna.combo.nombreTabla;
            colActual.campoPrimarioCombo = _columna.combo.campoPrimario;
            colActual.campoNombreCombo = _columna.combo.campoNombre;
            colActual.condicionCombo = _columna.combo.condicion;
            await getServicioCombo(colActual);
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
          // valores por defecto
          if (!isDefined(_columna.valordefecto)) {
            _columna.valordefecto = '';
          }
          // alinear
          if (isDefined(_columna.alinear)) {
            _columna.alinear = _columna.alinear === 'derecha' ? 'right' : _columna.alinear;
            _columna.alinear = _columna.alinear === 'izquierda' ? 'left' : _columna.alinear;
            _columna.alinear = _columna.alinear === 'centro' ? 'center' : _columna.alinear;
          } else {
            _columna.alinear = 'left'; // por defecto
            _columna.alinear = _columna.componente === 'Check' ? 'center' : _columna.alinear;
            _columna.alinear = _columna.componente === 'TextoEntero' ? 'right' : _columna.alinear;
            _columna.alinear = _columna.componente === 'TextoNumero' ? 'right' : _columna.alinear;
          }

          _columna.accessor = _columna.nombre;
          _columna.filter = 'fuzzyText';
          if (!isDefined(_columna.width)) {
            _columna.width = _columna.anchocolumna * 17;
          }
          if (_columna.componente === 'Check') {
            // CheckBox de lectura
            _columna.Cell = CheckLectura;
            if (_columna.valordefecto === '') {
              _columna.valordefecto = false;
            }
          } else if (_columna.componente === 'Combo') {
            // CheckBox de lectura
            _columna.Cell = ComboLectura;
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
    const getFila = (valorPrimaria) => data.filter((fila) => fila[campoPrimario] === valorPrimaria);
    const getInsertadas = () => data.filter((fila) => fila.insertada === true) || [];
    const getEliminadas = () => eliminadas;
    const getModificadas = () => data.filter((fila) => fila.modificada === true) || [];
    const getTotalFilas = () => data.length;
    const isEmpty = () => data.length === 0;

    /**
     * Retorna si una fila es insertada
     * @param {*} valorPrimario
     * @returns
     */
    const isFilaInsertada = (valorPrimario) => {
      const fila = data.find((col) => col[campoPrimario] === valorPrimario);
      if (isDefined(fila) && fila?.insertada) {
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
      const fila = data.find((col) => col[campoPrimario] === valorPrimario);
      if (isDefined(fila) && fila?.modificada) {
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

    /**
     * Actualiza la tabla a su estado original
     */
    const actualizar = async () => {
      setEliminadas([]);
      await getServicioDatos();
    };

    /**
     * Se ejecuta cuando algun dato de la tabla se modifica
     * @param {*} rowIndex
     * @param {*} columnId
     * @param {*} value
     */
    const modificarFila = ({ nombre, lectura }, value) => {
      if (value === '') {
        value = null;
      }
      // Valida que la columna no sea solo lectura
      if (lectura === false) {
        // si no es fila insertada
        if (!isDefined(filaSeleccionada?.insertada)) {
          filaSeleccionada.modificada = true;
          let colModificadas = [];
          if (isDefined(filaSeleccionada?.colModificadas)) {
            colModificadas = filaSeleccionada.colModificadas;
          }
          if (colModificadas.indexOf(nombre) === -1) {
            colModificadas.push(nombre);
          }
          filaSeleccionada.colModificadas = colModificadas;
          setData(data);
        }

        // Propagar si tiene evento
        // .....
      }
    };

    /**
     * Crea una fila, con los columnas de la tabla
     */
    const crearFila = () => {
      // PK temporal negativa
      const tmpPK = 0 - (getInsertadas().length + 1);
      const filaNueva = { id: tmpPK, insertada: true };
      columns.forEach((_columna) => {
        const { nombre, valordefecto } = _columna;
        filaNueva[nombre] = valordefecto;
        if (nombre === campoPrimario) {
          filaNueva[nombre] = tmpPK;
        }
      });
      //  Asigna valor a las relaciones
      // for (const relacion of this.relaciones) {
      // relacion.setValorForanea(this.getValorSeleccionado());
      // relacion.limpiar();
      // }
      //  Asigna valor si tiene campoPadre
      // if (this.utilitario.isDefined(this.tabla.campoPadre)) {
      // filaNueva[this.tabla.campoPadre] = this.tabla.valorPadre;
      // }
      setSkipPageReset(false);
      setData((elements) => [filaNueva, ...elements]);
      setFilaSeleccionada(filaNueva);
    };

    const insertar = () => {
      if (lectura === false) {
        if (isColumnas) {
          if (validarInsertar && getInsertadas().length > 0 && getTotalFilas() > 0) {
            msg.mensajeError('No se puede insertar, ya existe un registro insertado');
          } else {
            crearFila();
            return true;
          }
        }
      }
      return false;
    };

    const eliminar = async () => {
      if (lectura === false) {
        if (isColumnas && isDefined(filaSeleccionada)) {
          if (filaSeleccionada?.insertada) {
            setData(data.filter((item) => item[campoPrimario] !== filaSeleccionada[campoPrimario]));
          } else {
            setCargando(true);
            if (await getServicioIsEliminar()) {
              // agrega a filas eliminadas
              if (eliminadas.indexOf(filaSeleccionada[campoPrimario]) === -1) {
                setEliminadas((elements) => [...elements, filaSeleccionada[campoPrimario]]);
              }
              setData(data.filter((item) => item[campoPrimario] !== filaSeleccionada[campoPrimario]));
            } else {
              msg.mensajeError('No se puede eliminar, el registro tiene relación con otras tablas del sistema');
            }
            setCargando(false);
          }
        }
      }
      return true;
    };

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
      // We also turn on the flag to not reset the page
      setSkipPageReset(true);
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value
            };
          }
          return row;
        })
      );
    };

    return (
      <>
        <TablaReact
          columns={columns}
          data={data}
          campoPrimario={campoPrimario}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
          cargando={cargando}
          isColumnas={isColumnas}
          setData={setData}
          columnasOcultas={columnasOcultas}
          filasPorPagina={filasPorPagina}
          modificarFila={modificarFila}
          setFilaSeleccionada={setFilaSeleccionada}
          actualizar={actualizar}
          insertar={insertar}
          eliminar={eliminar}
          lectura={lectura}
          combos={combos}
          getInsertadas={getInsertadas}
          getModificadas={getModificadas}
          getEliminadas={getEliminadas}
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
      valorDefecto: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.object]),
      requerida: PropTypes.bool,
      visible: PropTypes.bool,
      filtro: PropTypes.bool,
      lectura: PropTypes.bool,
      orden: PropTypes.number,
      width: PropTypes.number,
      decimales: PropTypes.number,
      comentario: PropTypes.string,
      mayusculas: PropTypes.bool,
      alinear: PropTypes.oneOf(['izquierda', 'derecha', 'centro']),
      ordenable: PropTypes.bool,
      combo: PropTypes.shape({
        nombreTabla: PropTypes.string.isRequired,
        campoPrimario: PropTypes.string.isRequired,
        campoNombre: PropTypes.string.isRequired,
        condicion: PropTypes.string
      })
    })
  ),
  validarInsertar: PropTypes.bool
  // showToolbar: PropTypes.bool,
  // showPaginador: PropTypes.bool,
  // showBotonInsertar: PropTypes.bool,
  // showBotonEliminar: PropTypes.bool,
  // showBotonModificar: PropTypes.bool,
  // showBuscar: PropTypes.bool
};

export default Tabla;
