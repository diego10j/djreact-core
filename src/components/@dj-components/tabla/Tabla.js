import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
// import { useDispatch, useSelector } from 'react-redux';
// import { getColumnasR } from '../../../redux/slices/tabla';
// components
import { experimentalStyled as styled } from '@material-ui/core/styles';
import TablaReact from './TablaReact';
import ToolbarTabla from './ToolbarTabla';
import TablaFormulario from './TablaFormulario';
import ConfigurarTabla from './ConfigurarTabla';
import { AvatarLectura, CheckLectura, ComboLectura } from './FilaLectura';
// hooks
import useMensaje from '../../../hooks/useMensaje';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// servicios
import {
  consultarTabla,
  consultarServicio,
  getColumnasTabla,
  getComboTabla,
  isEliminar,
  getMaximo,
  getConfiguracion,
  configurarTabla
} from '../../../services/sistema/servicioSistema';
// utilitarios
import { isDefined, isEmpty, getIdeOpci } from '../../../utils/utilitario';
import {
  isDate,
  getFormatoFecha,
  getFormatoFechaHora,
  toHora,
  toDate,
  getFormatoHora,
  getFormatoFechaBDD
} from '../../../utils/formatTime';

// ----------------------------------------------------------------------

// Estilos
const StyledDiv = styled('div')(() => ({
  height: '100%',
  outline: 'none',
  lineHeight: '1.5714285714285714',
  display: 'flex',
  position: 'relative',
  boxSizing: 'border-box',
  flexDirection: 'column'
}));

const Tabla = forwardRef(
  (
    {
      numeroTabla,
      nombreTabla,
      campoPrimario,
      campoNombre,
      campoForanea,
      campoPadre,
      condiciones,
      servicio,
      tablaConfiguracion,
      lectura = true,
      tipoFormulario = false,
      numeroColFormulario,
      campoOrden = campoPrimario,
      opcionesColumnas,
      filasPorPagina = 15,
      validarInsertar = false,
      calculaPrimaria = true,
      showToolbar = true,
      showPaginador = true,
      showBotonInsertar,
      showBotonEliminar,
      showBuscar = true,
      showRowIndex = false,
      hookFormulario,
      totalColumnasSkeleton,
      height,
      onModificar,
      onInsertar,
      onEliminar
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      getColumnas,
      getDatos,
      getColumna,
      getFilaSeleccionada,
      filaSeleccionada,
      setFilaSeleccionada,
      getValorSeleccionado,
      getInsertadas,
      getEliminadas,
      getModificadas,
      isFilaModificada,
      isFilaEliminada,
      isFilaInsertada,
      seleccionarFila,
      seleccionarFilaPorIndice,
      seleccionarFilaPorValorPrimario,
      getIndiceTabla,
      getFila,
      getTotalFilas,
      isGuardar,
      guardar,
      setValorFilaSeleccionada,
      getValorFilaSeleccionada,
      setCargando,
      isCargando,
      commit,
      modificar,
      ejecutarServicio,
      ejecutar,
      actualizar,
      configuracion,
      updateMyData,
      updateMyDataByRow,
      indiceTabla,
      setIndiceTabla,
      setData,
      data,
      getFormatoFrontFilaSeleccionada,
      limpiarSeleccion,
      pintarFilaTablaReact
    }));

    const tablaReact = useRef();
    const tablaFormulario = useRef();

    // const dispatch = useDispatch();
    // const { columnas } = useSelector((state) => state.tabla);
    const isMountedRef = useIsMountedRef();
    const { showError, showMensajeError, showMensajeAdvertencia } = useMensaje();
    const [skipPageReset, setSkipPageReset] = useState(false);
    const [isColumnas, setIsColumnas] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [columns, setColumns] = useState([]);
    const [columnasOcultas, setColumnasOcultas] = useState([]);
    const [data, setData] = useState([]);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [eliminadas, setEliminadas] = useState([]);
    const [combos, setCombos] = useState([]);
    const [columnaSeleccionada, setColumnaSeleccionada] = useState();
    const [indiceTabla, setIndiceTabla] = useState();
    const [vistaFormularo, setVistaFormulario] = useState(tipoFormulario);
    const [paginaActual, setPaginaActual] = useState(0);
    const [numFilasNuevas, setNumFilasNuevas] = useState(0);
    const [abrirConfigurar, setAbrirConfigurar] = useState(false);
    const [configuracion, setConfiguracion] = useState({
      numeroTabla,
      nombreTabla,
      campoPrimario,
      campoOrden: campoOrden || campoPrimario,
      tipoFormulario,
      campoNombre,
      campoForanea,
      campoPadre,
      filasPorPagina,
      calculaPrimaria,
      lectura,
      showBotonInsertar,
      showBotonEliminar,
      condiciones
    });

    /**
     * Sirve para las pantallas genéricas, cuando cambia la configuración de componentes Tabla
     */
    useEffect(() => {
      // Create an scoped async function in the hook
      async function configuracionTabla() {
        if (isDefined(tablaConfiguracion)) {
          setIsColumnas(false);
          await getServicioConfiguracion();
        }
        initialState();
        getServicioColumnas();
        getServicioDatos();
      } // Execute the created function directly
      configuracionTabla();
    }, [tablaConfiguracion]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Pinta la fila seleccionada cuando cambia la vista a Tabla
     */
    useEffect(() => {
      pintarFilaTablaReact();
    }, [vistaFormularo]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Pinta la fila cuando recupera la data
     */
    useEffect(() => {
      if (cargando === false && data.length > 0) pintarFilaTablaReact();
    }, [cargando]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     *  Oculta columnas para la TablaReact
     */
    useEffect(() => {
      if (!vistaFormularo) {
        const colOcultas = columns.filter((_col) => _col.visible === false).map((_element) => _element.nombre);
        setColumnasOcultas(colOcultas);
      }
    }, [columns]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Asigna los valores de la fila seleccionada a los values del hookFormulario
     */
    useEffect(() => {
      if (isDefined(hookFormulario)) hookFormulario.setValues(filaSeleccionada);
    }, [filaSeleccionada]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (isDefined(hookFormulario)) hookFormulario.setConfiguracion(configuracion);
    }, [configuracion]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Inicializa los states para la tabla React, esto debido a las pantallas genéricas
     */
    function initialState() {
      setFilaSeleccionada(undefined);
      setIndiceTabla(undefined);
      setColumnasOcultas([]);
      setEliminadas([]);
      setNumFilasNuevas(0);
      setCombos([]);
      setPaginaActual(0);
      setData([]);
      setVistaFormulario(tipoFormulario);
      // Caracteristicas de tabla editable
      if (lectura === false) {
        showBotonInsertar = !isDefined(showBotonInsertar) ? true : showBotonInsertar;
        showBotonEliminar = !isDefined(showBotonEliminar) ? true : showBotonEliminar;
      }
      setConfiguracion({
        numeroTabla,
        nombreTabla,
        campoPrimario,
        campoOrden,
        tipoFormulario,
        campoNombre,
        campoForanea,
        campoPadre,
        filasPorPagina,
        calculaPrimaria,
        lectura,
        numeroFilas: filasPorPagina,
        ideOpci: getIdeOpci(),
        showBotonInsertar,
        showBotonEliminar,
        condiciones
      });
    }

    /**
     * Pinta la fila de la Tabla tipo React
     */
    const pintarFilaTablaReact = () => {
      if (vistaFormularo === false && data.length > 0) tablaReact.current.setPintarFila(true);
    };

    /**
     * Consulta en el servicio web los datos de la Tabla
     * @param {string} valorPrimario  Sirve para seleccionar una fila determinada
     */
    const getServicioDatos = async (valorPrimario = null) => {
      // console.log('---CARGA DATOS');
      try {
        setCargando(true);
        if (!isDefined(servicio)) {
          const condicionesTabla = [];
          // Condicion de la tabla
          if (isDefined(configuracion.condiciones)) condicionesTabla.push(configuracion.condiciones);

          const { data } = await consultarTabla(
            nombreTabla || configuracion.nombreTabla,
            campoPrimario || configuracion.campoPrimario,
            campoOrden || configuracion.campoOrden,
            condicionesTabla
          );
          if (isMountedRef.current) {
            setData([]);
            setData(data.datos);

            // selecciona fila por valor primario anterior
            if (isDefined(valorPrimario)) {
              const fila = data.datos.find((col) => col[configuracion.campoPrimario] === valorPrimario);
              setFilaSeleccionada(fila);
              setIndiceTabla(data.datos.indexOf(fila));
            } else {
              // Selecciona la fila 0 por defecto
              setIndiceTabla(0);
              setFilaSeleccionada(data.datos[0]);
            }

            // inserta una fila si es formulario y no tiene data
            if (vistaFormularo === true && data.datos.length === 0) {
              crearFila();
            }

            setCargando(false);
          }
        } else {
          const param = {
            ...servicio.parametros,
            soloColumnas: false
          };
          const { data } = await consultarServicio(servicio.nombre, param);
          if (isMountedRef.current) {
            setData([]);
            setData(data.datos);
            // selecciona fila por valor primario anterior
            if (isDefined(valorPrimario)) {
              const fila = data.datos.find((col) => col[configuracion.campoPrimario] === valorPrimario);
              setFilaSeleccionada(fila);
              setIndiceTabla(data.datos.indexOf(fila));
            } else {
              // Selecciona la fila 0 por defecto
              setIndiceTabla(0);
              setFilaSeleccionada(data.datos[0]);
            }
            setCargando(false);
          }
        }
      } catch (error) {
        console.log(error);
        setCargando(false);
        showError(error.mensaje);
      }
    };

    /**
     * Obtiene las columnas del servicio web
     */
    const getServicioColumnas = async () => {
      // console.log('---CARGA COLUMNAS');
      try {
        if (!isDefined(servicio)) {
          const { data } = await getColumnasTabla(nombreTabla, campoPrimario, getIdeOpci(), numeroTabla);
          formarColumnas(data.datos);
        } else {
          const param = {
            ...servicio.parametros,
            ide_opci: getIdeOpci(),
            numero_tabl: numeroTabla,
            soloColumnas: true
          };
          const { data } = await consultarServicio(servicio.nombre, param);
          formarColumnas(data.datos);
        }
      } catch (error) {
        console.log(error);
        showError(error.mensaje);
      }
    };

    /**
     * Obtiene las columnas del servicio web
     */
    const getServicioCombo = async (columna) => {
      // console.log('---CARGA COMBO');
      try {
        const { data } = await getComboTabla(
          columna.nombreTablaCombo,
          columna.campoPrimarioCombo,
          columna.campoNombreCombo,
          columna.condicionCombo
        );
        if (isMountedRef.current) {
          setCombos((elements) => [
            ...elements,
            {
              columna: columna.campoPrimarioCombo.toLowerCase(),
              listaCombo: [{ value: '', label: '(Null)' }, ...data.datos]
            }
          ]);
        }
      } catch (error) {
        console.log(error);
        showError(error.mensaje);
      }
    };

    /**
     * Obtiene las columnas del servicio web
     */
    const getServicioConfiguracion = async () => {
      // console.log('---CARGA CONFIGURACIÓN');
      try {
        const { data } = await getConfiguracion(getIdeOpci(), numeroTabla);
        if (isDefined(data.datos)) {
          nombreTabla = data.datos.tabla_tabl;
          campoPrimario = data.datos.primaria_tabl;
          tipoFormulario = data.datos.formulario_tabl === true;
          campoNombre = isDefined(data.datos.nombre_tabl) ? data.datos.nombre_tabl : null;
          campoForanea = isDefined(data.datos.foranea_tabl) ? data.datos.foranea_tabl : null;
          campoPadre = isDefined(data.datos.padre_tabl) ? data.datos.padre_tabl : null;
          campoOrden = isDefined(data.datos.orden_tabl) ? data.datos.orden_tabl : data.datos.primaria_tabl;
          filasPorPagina = isDefined(data.datos.filas_tabl) ? data.datos.filas_tabl : filasPorPagina;

          if (isDefined(condiciones)) {
            // Remplaza condiciones en pantallas genericas con condición
            let { condicion } = condiciones;
            condicion = condicion.replace('tabla.campoPadre', campoPadre);
            condicion = condicion.replace('tabla.campoPrimario', campoPrimario);
            condicion = condicion.replace('tabla.campoForanea', campoForanea);
            condicion = condicion.replace('tabla.campoNombre', campoNombre);
            condiciones = { condicion, valores: condiciones.valores };
            const _conf = configuracion;
            _conf.condiciones = condiciones;
            setConfiguracion(_conf);
          }
        } else {
          showError('No existe configuración de la tabla');
        }
      } catch (error) {
        showError(error.mensaje);
      }
    };

    const getServicioIsEliminar = async () => {
      try {
        const { data } = await isEliminar(
          configuracion.nombreTabla,
          configuracion.campoPrimario,
          getValorSeleccionado()
        );
        return !isDefined(data.datos);
      } catch (error) {
        showError(error.mensaje);
        return false;
      }
    };

    const getServicioIsUnico = async (campo, valorCampo) => {
      try {
        const { data } = await isEliminar(configuracion.nombreTabla, campo, valorCampo);
        return data.datos;
      } catch (error) {
        showError(error.mensaje);
        return false;
      }
    };

    const getServicioSecuencial = async (numeroFilas) => {
      try {
        const { data } = await getMaximo(configuracion.nombreTabla, configuracion.campoPrimario, numeroFilas);
        return data.datos;
      } catch (error) {
        showError(error.mensaje);
        return undefined;
      }
    };

    const getServicioConfigurarTabla = async () => {
      try {
        await configurarTabla(getIdeOpci(), configuracion, columns);
      } catch (error) {
        showError(error.mensaje);
      }
    };

    const formarColumnas = (cols) => {
      if (opcionesColumnas) {
        // console.log('---FORMAR COLUMNAS');
        // Aplica cada configuración realizada a las columnas
        opcionesColumnas.forEach(async (_columna) => {
          const colActual = cols.find((_col) => _col.nombre === _columna.nombre.toLowerCase());
          if (colActual) {
            colActual.visible = 'visible' in _columna ? _columna.visible : colActual.visible;
            colActual.filtro = 'filtro' in _columna ? _columna.filtro : colActual.filtro;
            colActual.nombreVisual =
              'nombreVisual' in _columna ? _columna.nombreVisual.toUpperCase() : colActual.nombreVisual;
            colActual.valorDefecto = 'valorDefecto' in _columna ? _columna.valorDefecto : colActual.valorDefecto;
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
          // Configuración Combo
          if (isDefined(_columna.combo)) {
            // Valor por defecto ''
            colActual.valorDefecto = !isDefined(colActual.valorDefecto) ? '' : colActual.valorDefecto;
            colActual.componente = 'Combo';
            colActual.anchoColumna = 18;
            colActual.nombreTablaCombo = _columna.combo.nombreTabla;
            colActual.campoPrimarioCombo = _columna.combo.campoPrimario;
            colActual.campoNombreCombo = _columna.combo.campoNombre;
            colActual.condicionCombo = _columna.combo.condicion;
            await getServicioCombo(colActual);
          }
          // Configuración Avatar
          if (isDefined(_columna.avatar)) {
            colActual.componente = 'Avatar';
            colActual.campoNombreAvatar = _columna.avatar.campoNombre === '' ? null : _columna.avatar.campoNombre;
            colActual.ordenable = false;
          }
        });
      }
      // ordena las columnas
      cols.sort((a, b) => (a.orden < b.orden ? -1 : 1));

      cols.forEach((_columna) => {
        _columna.lectura = !isDefined(_columna.lectura) ? lectura : _columna.lectura;
        _columna.accessor = _columna.nombre;
        _columna.ordenable = !isDefined(_columna.ordenable) ? true : _columna.ordenable;
        _columna.requerida = !isDefined(_columna.requerida) ? false : _columna.requerida;
        _columna.valorDefecto = !isDefined(_columna.valorDefecto) ? '' : _columna.valorDefecto;
        _columna.filter = _columna.filtro === true ? 'fuzzyText' : null;

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
        if (_columna.componente === 'Check') {
          // CheckBox de lectura
          _columna.Cell = CheckLectura;
          _columna.anchoColumna = 7;
          _columna.valorDefecto = _columna.valorDefecto === 'true' || _columna.valorDefecto === true;
        } else if (_columna.componente === 'Combo') {
          // CheckBox de lectura
          _columna.Cell = ComboLectura;
          _columna.filter = multiSelectFilter;
        } else if (_columna.componente === 'Calendario' || _columna.componente === 'Hora') {
          // ancho de la columna
          _columna.anchoColumna = 7;
        } else if (_columna.componente === 'Avatar') {
          _columna.Cell = AvatarLectura;
          _columna.anchoColumna = 4;
        }
        _columna.width = !isDefined(_columna.width) ? _columna.anchoColumna * 17 : _columna.width;
      });

      // Campos requeridos si tiene validationSchema
      if (isDefined(hookFormulario) && isDefined(hookFormulario.validationSchema)) {
        cols.forEach((_columna) => {
          // console.log(validationSchema.fields.mail_empr.exclusiveTests.required);
          const req = hookFormulario.validationSchema.fields[_columna.nombre]?.exclusiveTests.required || false;
          _columna.requerida = req;
        });
      }
      if (isMountedRef.current) {
        setColumns(cols);
        setIsColumnas(true);
      }
    };

    function multiSelectFilter(rows, id, filterValue) {
      return filterValue.length === 0
        ? rows
        : rows.filter((row) =>
            filterValue.map((element) => (element.value === '' ? null : element.value)).includes(row.original[id])
          );
    }

    /**
     * Retorna un objeto columna
     * @param nombreColumna
     */
    const getColumna = (nombreColumna) => {
      nombreColumna = nombreColumna.toLowerCase();
      const col = columns.find((col) => col.nombre === nombreColumna);
      if (!isDefined(col)) throw new Error(`Error la columna ${nombreColumna} no existe`);
      return col;
    };
    /**
     * Retorna el valor del campo primario de la fila seleccionada
     * @returns
     */
    const getValorSeleccionado = () =>
      isDefined(filaSeleccionada) ? filaSeleccionada[configuracion.campoPrimario] : undefined;
    const getColumnas = () => columns;
    const getDatos = () => data;
    const getFilaSeleccionada = () => filaSeleccionada;
    const getFila = (valorPrimaria) => data.filter((fila) => fila[configuracion.campoPrimario] === valorPrimaria);
    const getInsertadas = () => data.filter((fila) => fila.insertada === true) || [];
    const getEliminadas = () => eliminadas;
    const getModificadas = () => data.filter((fila) => fila.modificada === true) || [];
    const getTotalFilas = () => data.length;
    const getIndiceTabla = () => indiceTabla;
    const isCargando = () => cargando;

    /** Retorna los valores de la fila seleccionada en formato Front */
    const getFormatoFrontFilaSeleccionada = () => {
      const fila = filaSeleccionada;
      columns.forEach(async (colActual) => {
        const valor = fila[colActual.nombre];
        if (isDefined(valor)) {
          if (colActual.componente === 'Calendario') {
            fila[colActual.nombre] = getFormatoFecha(valor);
          } else if (colActual.componente === 'CalendarioHora') {
            fila[colActual.nombre] = getFormatoFechaHora(valor);
          }
        }
      });
      return fila;
    };

    /**
     * Retorna si una fila es insertada
     * @param {*} valorPrimario
     * @returns
     */
    const isFilaInsertada = (valorPrimario) => {
      const fila = data.find((col) => col[configuracion.campoPrimario] === valorPrimario);
      return isDefined(fila) && fila?.insertada;
    };

    /**
     * Retorna si una fila es modificada
     * @param {*} valorPrimario
     * @returns
     */
    const isFilaModificada = (valorPrimario) => {
      const fila = data.find((col) => col[configuracion.campoPrimario] === valorPrimario);
      return isDefined(fila) && fila?.modificada;
    };

    /**
     * Retorna si una fila es eliminada
     * @param {*} valorPrimario
     * @returns
     */
    const isFilaEliminada = (valorPrimario) => {
      const fila = eliminadas.find((col) => col[configuracion.campoPrimario] === valorPrimario);
      return isDefined(fila);
    };

    /**
     * Actualiza la tabla a su estado original
     */
    const actualizar = async () => {
      setEliminadas([]);
      setNumFilasNuevas(0);
      // guarda pk de la fila seleccionada
      const respValorSeleccionado =
        !isDefined(filaSeleccionada) || filaSeleccionada?.insertada
          ? undefined
          : filaSeleccionada[configuracion.campoPrimario];
      await getServicioDatos(respValorSeleccionado);
    };

    /**
     * Actualiza la tabla a su estado original
     */
    const ejecutarServicio = (parametros) => {
      servicio.parametros = parametros;
      getServicioDatos();
    };

    /**
     * Actualiza la tabla a su estado original
     */
    const ejecutar = (_condiciones) => {
      const _conf = configuracion;
      _conf.condiciones = _condiciones;
      setConfiguracion(_conf);
      getServicioDatos();
    };

    /**
     * Se ejecuta cuando algun dato de la tabla se modifica
     * @param {*} rowIndex
     * @param {*} columnId
     */
    const modificarFila = ({ nombre, lectura }, index) => {
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
          data[index] = filaSeleccionada;
          setFilaSeleccionada(data[index]);
          setData(data);
        }

        // Propagar si tiene evento
        // .....
      }
    };

    const modificar = (nombre) => {
      modificarFila(getColumna(nombre), indiceTabla);
    };

    /**
     * Asigna un valor a una columna de la fila seleccionada
     * @param {string} nombre Nombre Columna
     * @param {*} valor
     */
    const setValorFilaSeleccionada = (nombre, valor) => {
      if (isDefined(filaSeleccionada)) {
        filaSeleccionada[nombre] = valor;
        const editFilaSeleccionada = { ...filaSeleccionada };
        setFilaSeleccionada(editFilaSeleccionada);
      }
    };

    /**
     * Retorna el valor de una columna de la fila seleccionada
     * @param {String} nombre
     * @returns
     */
    const getValorFilaSeleccionada = (nombre) => {
      if (isDefined(filaSeleccionada)) {
        return isDefined(filaSeleccionada[nombre]) ? filaSeleccionada[nombre] : '';
      }
      return null;
    };

    /**
     * Selecciona la fila por valorPrimario
     * @param {String} valorPrimario
     */
    const seleccionarFilaPorValorPrimario = (valorPrimario) => {
      const fila = data.find((col) => col[configuracion.campoPrimario] === valorPrimario);
      seleccionarFila(fila);
    };

    /**
     * Selecciona la fila por indice
     * @param {String} valorPrimario
     */
    const seleccionarFilaPorIndice = (index) => {
      const fila = data[index];
      seleccionarFila(fila, index);
    };

    /**
     * Selecciona una fila, recibe el objeto fila
     * @param {Fila} fila
     */
    const seleccionarFila = (fila, index = undefined) => {
      if (isDefined(fila)) {
        setFilaSeleccionada(fila);
        if (isDefined(index)) setIndiceTabla(index);
        else setIndiceTabla(data.indexOf(fila));
      } else {
        limpiarSeleccion();
      }
    };

    const limpiarSeleccion = () => {
      setFilaSeleccionada(undefined);
      setIndiceTabla(undefined);
    };

    /**
     * Crea una fila, con los columnas de la tabla
     */
    const crearFila = () => {
      // PK temporal negativa
      const tmpPK = 0 - (1000 - numFilasNuevas);
      const filaNueva = { insertada: true };
      columns.forEach((_columna) => {
        const { nombre, valorDefecto } = _columna;
        filaNueva[nombre] = valorDefecto;
        if (nombre === configuracion.campoPrimario) filaNueva[nombre] = tmpPK;
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
      // setSkipPageReset(false);
      const newData = [filaNueva, ...data];
      const aux = numFilasNuevas + 1;
      setNumFilasNuevas(aux);
      setData(newData);
      setFilaSeleccionada(filaNueva);
      setIndiceTabla(0);
      setSkipPageReset(false);
    };

    const insertar = () => {
      if (lectura === false) {
        if (isColumnas) {
          if (validarInsertar && getInsertadas().length > 0 && getTotalFilas() > 0) {
            showMensajeError('No se puede insertar, ya existe un registro insertado');
          } else {
            crearFila();
            return true;
          }
        }
      }
      return false;
    };

    const eliminar = async () => {
      if (configuracion.lectura === false) {
        if (isColumnas && isDefined(filaSeleccionada)) {
          if (filaSeleccionada?.insertada) {
            setData(
              data.filter((item) => item[configuracion.campoPrimario] !== filaSeleccionada[configuracion.campoPrimario])
            );
            setFilaSeleccionada(undefined);
            setIndiceTabla(undefined);
          } else {
            setCargando(true);
            if (await getServicioIsEliminar()) {
              // agrega a filas eliminadas
              if (eliminadas.indexOf(filaSeleccionada[configuracion.campoPrimario]) === -1) {
                setEliminadas((elements) => [...elements, filaSeleccionada[configuracion.campoPrimario]]);
              }
              setData(
                data.filter(
                  (item) => item[configuracion.campoPrimario] !== filaSeleccionada[configuracion.campoPrimario]
                )
              );
              setFilaSeleccionada(undefined);
              setIndiceTabla(undefined);
            } else {
              setCargando(false);
              showError('El registro tiene relación con otras tablas del sistema', 'No se puede Eliminar');
              return false;
            }
            setCargando(false);
          }
        }
      }
      return true;
    };

    /**
     * Valida campos únicos,requeridas, valores en campos Hora,Fecha, FechaHora
     * y calcula claves primarias
     */
    const isGuardar = async () => {
      //  filas nuevas

      const colObligatorias = columns.filter((col) => col.requerida === true);
      const colUnicas = columns.filter((col) => col.unico === true);

      for (let i = 0; i < getInsertadas().length; i += 1) {
        const filaActual = getInsertadas()[i];
        // Validacion de valores que sean válidos
        for (let j = 0; j < columns.length; j += 1) {
          const colActual = columns[j];
          // Validaciones
          if (isValidaciones(filaActual, colActual) === false) return false;
        }

        // Valores Obligatorios
        for (let j = 0; j < colObligatorias.length; j += 1) {
          const colActual = colObligatorias[j];
          if (configuracion.calculaPrimaria === true && colActual.nombre !== configuracion.campoPrimario) {
            // No aplica a campoPrimario
            const valor = filaActual[colActual.nombre];
            if (isEmpty(valor)) {
              showMensajeAdvertencia(`Los valores de la columna ${colActual.nombreVisual} son obligatorios`);
              return false;
            }
          }
        }

        // Valores Unicos
        try {
          colUnicas.forEach(async (colActual) => {
            const valor = filaActual[colActual.nombre];
            if (isDefined(valor)) {
              // Valida mediante el servicio web
              if (await getServicioIsUnico(colActual, valor)) {
                showMensajeAdvertencia(
                  `Restricción única, ya existe un registro con el valor ${valor} en la columna ${colActual.nombreVisual}`
                );
                throw new Error('Restricción única.');
              }
            }
          });
        } catch (e) {
          return false;
        }
      }

      // 2 en filas modificadas
      for (let i = 0; i < getModificadas().length; i += 1) {
        const filaActual = getModificadas()[i];
        // Valores Obligatorios solo columnas modificadas
        const { colModificadas } = filaActual;
        for (let j = 0; j < colModificadas.length; j += 1) {
          const colNombreActual = colModificadas[j];
          // solo nombres de columnas modificadas
          const colActual = getColumna(colNombreActual);
          // Validaciones
          if (isValidaciones(filaActual, colActual) === false) return false;

          if (colActual.requerida) {
            const valor = filaActual[colNombreActual];
            if (isDefined(valor) === false) {
              showMensajeAdvertencia(`Los valores de la columna ${colActual.nombreVisual} son obligatorios`);
              return false;
            }
          }
        }
      }

      // Calcula valores claves primarias en filas insertadas
      let maximoTabla = 0;
      if (configuracion.calculaPrimaria) {
        // Calcula valores claves primarias
        if (getInsertadas().length > 0) {
          maximoTabla = await getServicioSecuencial(getInsertadas().length);
          // console.log(maximoTabla);
        }
      }
      getInsertadas().forEach((filaActual) => {
        // Asigna valores primario calculado
        if (configuracion.calculaPrimaria) {
          filaActual[configuracion.campoPrimario.toLowerCase()] = maximoTabla;
          filaActual.maximoTabla = maximoTabla;
          maximoTabla += 1;
        }
      });
      // this.actualizarForaneaRelaciones(this.getValorSeleccionado());
      return true;
    };

    // Verifica si el valor de la columna es válido
    const isValidaciones = (fila, columna) => {
      let valor = fila[columna.nombre];
      // console.log(` -----  ${columna.nombre}  ${valor}`);
      if (valor === '') valor = null;

      // si tiene validationSchema
      // if (isDefined(hookFormulario) && isDefined(hookFormulario.validationSchema)) {
      // const fields = hookFormulario.validationSchema._nodes;
      // if (fields.indexOf(columna.nombre) >= 0) {
      // const resp = Yup.reach(hookFormulario.validationSchema, columna.nombre)
      // .validate(valor)
      // .catch((err) => {
      // showMensajeAdvertencia(`${err.message}`);
      // return false;
      //  });
      // if (resp === false) {
      // return false;
      //  }
      //  }
      //  }

      // Valida tipos de datos
      if (isDefined(valor)) {
        if (columna.componente === 'Calendario') {
          if (typeof valor === 'object') valor = getFormatoFecha(valor);

          // valida que sea una fecha correcta
          const dt = toDate(getFormatoFecha(valor));
          if (!isDate(dt)) {
            showMensajeAdvertencia(`Fecha no válida ${valor} en la columna  ${columna.nombreVisual}`);
            return false;
          }
          // console.log(fila);
        } else if (columna.componente === 'Hora') {
          if (typeof valor === 'object') valor = getFormatoHora(valor);

          // valida que sea una hora correcta
          const dt = toHora(getFormatoHora(valor));
          if (!isDate(dt)) {
            showMensajeAdvertencia(`Hora no válida ${valor} en la columna  ${columna.nombreVisual}`);
            return false;
          }
          // console.log(fila);
        } else if (columna.componente === 'CalendarioHora') {
          if (typeof valor === 'object') {
            // fila[columna.nombre] = this.utilitario.getFormatoFechaHora(valor);
            valor = getFormatoFechaHora(valor);
          }
          // valida que sea una fecha correcta
          const dt = toDate(getFormatoFechaHora(valor));
          if (!isDate(dt)) {
            showMensajeAdvertencia(`Fecha no válida ${valor} en la columna  ${columna.nombreVisual}`);
            return false;
          }
        }
      }
      return true;
    };

    const guardar = () => {
      const listaSql = [];
      const colMayusculas = columns.filter((col) => col.mayusculas === true);

      for (let i = 0; i < getInsertadas().length; i += 1) {
        const filaActual = getInsertadas()[i];
        const objInsert = {};

        const columnasInsert = columns.map((colActual) => {
          const rObj = {
            nombre: colActual.nombre
          };
          return rObj;
        });

        objInsert.tipo = 'insertar';
        objInsert.nombreTabla = configuracion.nombreTabla.toLowerCase();
        objInsert.campoPrimario = configuracion.campoPrimario.toLowerCase();
        objInsert.columnas = columnasInsert;
        objInsert.serial = configuracion.calculaPrimaria;
        if (!configuracion.calculaPrimaria) {
          // elimina campo primario cuando es serial
          delete filaActual[configuracion.campoPrimario];
        }
        // Valores Mayusculas
        for (let j = 0; j < colMayusculas.length; j += 1) {
          const colActual = colMayusculas[j];
          const valor = filaActual[colActual.nombre];
          if (isDefined(valor)) {
            filaActual[colActual.nombre] = valor.toUpperCase();
          }
        }

        // Valores a Insertar
        const valoresInsertados = {};
        for (let j = 0; j < columns.length; j += 1) {
          const colActual = columns[j];
          // filaActual = this.validarFila(colActual, filaActual);
          const valor = filaActual[colActual.nombre] === '' ? null : filaActual[colActual.nombre];
          valoresInsertados[colActual.nombre] = valor;
          // Formato fecha para la base de datos
          if (isDefined(valor)) {
            // Aplica formato dependiendo del componente
            if (colActual.componente === 'Calendario') {
              // valoresInsertados[colActual.nombre] = getFormatoFechaBDD(this.utilitario.toDate(filaActual[colActual.nombre], this.utilitario.FORMATO_FECHA_FRONT));
              valoresInsertados[colActual.nombre] = getFormatoFechaBDD(valor);
            } else if (colActual.componente === 'Check') {
              valoresInsertados[colActual.nombre] = valor === 'true';
            }
          }
        }
        objInsert.valores = valoresInsertados;
        listaSql.push(objInsert);
      }
      for (let i = 0; i < getModificadas().length; i += 1) {
        const filaActual = getModificadas()[i];
        const objModifica = {};
        objModifica.tipo = 'modificar';
        objModifica.nombreTabla = configuracion.nombreTabla.toLowerCase();

        // Valores Mayusculas
        for (let j = 0; j < colMayusculas.length; j += 1) {
          const colActual = colMayusculas[j];
          const valor = filaActual[colActual.nombre];
          if (isDefined(valor)) {
            filaActual[colActual.nombre] = valor.toUpperCase();
          }
        }
        // Columnas modificadas
        const { colModificadas } = filaActual;
        const valoresModifica = {};
        for (let j = 0; j < colModificadas.length; j += 1) {
          const colM = colModificadas[j];
          const valor = filaActual[colM.toLowerCase()] === '' ? null : filaActual[colM.toLowerCase()];
          valoresModifica[colM] = valor;
          if (isDefined(valor)) {
            // Aplica formato dependiendo del componente
            if (getColumna(colM.toLowerCase()).componente === 'Calendario') {
              valoresModifica[colM] = getFormatoFechaBDD(valor);
            } else if (getColumna(colM.toLowerCase()).componente === 'Check') {
              valoresModifica[colM] = `${valor}` === 'true';
            }
          }
        }
        objModifica.valores = valoresModifica;
        const condicionModifica = {
          condicion: `${configuracion.campoPrimario} = ?`,
          valores: [filaActual[configuracion.campoPrimario.toLowerCase()]]
        };
        objModifica.condiciones = [condicionModifica];
        listaSql.push(objModifica);
      }

      for (let i = 0; i < getEliminadas().length; i += 1) {
        const filaActual = getEliminadas()[i];
        const objElimina = {};
        objElimina.tipo = 'eliminar';
        objElimina.nombreTabla = configuracion.nombreTabla.toLowerCase();
        const condicionElimina = {
          condicion: `${configuracion.campoPrimario} = ?`,
          valores: [filaActual]
        };
        objElimina.condiciones = [condicionElimina];
        listaSql.push(objElimina);
      }
      return listaSql;
    };

    /**
     * Se ejcuta cuando si se ejecuta correctamente el servicio que guarda los cambios
     */
    const commit = () => {
      let isCambios = false;
      // Quita elemento filas insertadas, modificadas
      // if (this.utilitario.isDefined(this.arbol)) {
      // for (let filaActual of this.getEliminadas()) {
      // let auxBoraa = this.arbol.seleccionado.children.find((fila) => fila.data === filaActual[this.campoPrimario]);
      // if (auxBoraa) {
      // const index = this.arbol.seleccionado.children.indexOf(auxBoraa);
      // this.arbol.seleccionado.children.splice(index, 1);
      // }
      // }
      // }

      setEliminadas([]);
      setNumFilasNuevas(0);

      getInsertadas().forEach((filaActual) => {
        // Si tiene arbol, agrega al nodo seleccionado
        // if (this.utilitario.isDefined(this.arbol)) {
        // let nuevoHijo = {
        //  label: filaActual[this.arbol.campoNombre],
        //  data: filaActual[this.arbol.campoPrimario],
        //  padre: filaActual[this.arbol.campoPadre],
        //   icon: 'pi pi-file'
        //   };

        //   if (this.utilitario.isDefined(this.arbol.seleccionado.children)) {
        //     //ya tiene hijos solo agrega
        //     this.arbol.seleccionado.children.push(nuevoHijo);
        //   } else {
        //     //agrega y cambia el iconos
        //     this.arbol.seleccionado['children'] = [nuevoHijo];
        //     this.arbol.seleccionado.expandedIcon = 'pi pi-folder';
        //     this.arbol.seleccionado.collapsedIcon = 'pi pi-folder-open';
        //    }
        //   }
        // Asigna valores primario calculado
        if (configuracion.calculaPrimaria) {
          const index = data.indexOf(filaActual);
          filaActual[configuracion.campoPrimario.toLowerCase()] = filaActual.maximoTabla;
          if (indiceTabla === index) {
            setValorFilaSeleccionada(configuracion.campoPrimario.toLowerCase(), filaActual.maximoTabla);
          }
          updateMyData(index, configuracion.campoPrimario.toLowerCase(), filaActual.maximoTabla);
        }
        filaActual.insertada = false;
        isCambios = true;
      });

      for (let i = 0; i < getModificadas().length; i += 1) {
        const filaActual = getModificadas()[i];
        filaActual.modificada = false;
        filaActual.colModificadas = undefined;
        isCambios = true;
      }
      if (isCambios) setData(data);
    };

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
      // We also turn on the flag to not reset the page
      value = value === '' ? null : value;
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
      // setSkipPageReset(false);
    };

    /**
     * Actualiza toda una fila de la data
     * @param {} rowIndex
     * @param {*} filaSeleccionada
     */
    const updateMyDataByRow = (rowIndex, filaSeleccionada) => {
      // We also turn on the flag to not reset the page
      setSkipPageReset(true);
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              ...filaSeleccionada
            };
          }
          return row;
        })
      );
      // setSkipPageReset(false);
    };

    const handleInsertar = () => {
      if (isDefined(onInsertar)) {
        onInsertar();
        return;
      }
      if (!vistaFormularo) tablaReact.current.insertarTablaReact();
    };

    const handleActualizar = () => {
      if (!vistaFormularo) {
        tablaReact.current.actualizarTablaReact();
      } else {
        actualizar();
      }
    };

    const handleEliminar = () => {
      if (isDefined(onEliminar)) {
        onEliminar();
        return;
      }
      if (!vistaFormularo) tablaReact.current.eliminarTablaReact();
    };

    const handleCambiarVista = () => {
      if (vistaFormularo) {
        // calcula la página actual
        const pagina = parseInt(indiceTabla / configuracion.filasPorPagina, 10);
        setPaginaActual(pagina);
      }
      setVistaFormulario(!vistaFormularo);
    };

    return (
      <StyledDiv>
        {showToolbar === true && (
          <ToolbarTabla
            actualizar={handleActualizar}
            insertar={handleInsertar}
            eliminar={handleEliminar}
            cambiarVista={handleCambiarVista}
            filaSeleccionada={filaSeleccionada}
            showBotonInsertar={configuracion.showBotonInsertar}
            showBotonEliminar={configuracion.showBotonEliminar}
            onModificar={onModificar}
            vistaFormularo={vistaFormularo}
            lectura={lectura}
            setAbrirConfigurar={setAbrirConfigurar}
          />
        )}
        {!vistaFormularo ? (
          <TablaReact
            ref={tablaReact}
            columns={columns}
            data={data}
            configuracion={configuracion}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
            cargando={cargando}
            isColumnas={isColumnas}
            setData={setData}
            columnasOcultas={columnasOcultas}
            filasPorPagina={filasPorPagina}
            modificarFila={modificarFila}
            filaSeleccionada={filaSeleccionada}
            setFilaSeleccionada={setFilaSeleccionada}
            setValorFilaSeleccionada={setValorFilaSeleccionada}
            getValorFilaSeleccionada={getValorFilaSeleccionada}
            insertar={insertar}
            actualizar={actualizar}
            eliminar={eliminar}
            lectura={lectura}
            combos={combos}
            showPaginador={showPaginador}
            showBuscar={showBuscar}
            showRowIndex={showRowIndex}
            setColumnaSeleccionada={setColumnaSeleccionada}
            columnaSeleccionada={columnaSeleccionada}
            setIndiceTabla={setIndiceTabla}
            indiceTabla={indiceTabla}
            setPaginaActual={setPaginaActual}
            paginaActual={paginaActual}
            height={height}
          />
        ) : (
          <TablaFormulario
            ref={tablaFormulario}
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            cargando={cargando}
            isColumnas={isColumnas}
            setData={setData}
            modificarFila={modificarFila}
            filaSeleccionada={filaSeleccionada}
            setFilaSeleccionada={setFilaSeleccionada}
            setValorFilaSeleccionada={setValorFilaSeleccionada}
            getValorFilaSeleccionada={getValorFilaSeleccionada}
            insertar={insertar}
            actualizar={actualizar}
            eliminar={eliminar}
            lectura={lectura}
            combos={combos}
            getInsertadas={getInsertadas}
            getModificadas={getModificadas}
            getEliminadas={getEliminadas}
            setCargando={setCargando}
            showToolbar={showToolbar}
            showPaginador={showPaginador}
            showBuscar={showBuscar}
            setColumnaSeleccionada={setColumnaSeleccionada}
            columnaSeleccionada={columnaSeleccionada}
            seleccionarFilaPorIndice={seleccionarFilaPorIndice}
            indiceTabla={indiceTabla}
            numeroColFormulario={numeroColFormulario}
            hookFormulario={hookFormulario}
            totalColumnasSkeleton={totalColumnasSkeleton}
            height={height}
          />
        )}
        <ConfigurarTabla
          columns={columns}
          open={abrirConfigurar}
          setOpen={setAbrirConfigurar}
          setColumns={setColumns}
          getServicioConfigurarTabla={getServicioConfigurarTabla}
        />
      </StyledDiv>
    );
  }
);
Tabla.propTypes = {
  numeroTabla: PropTypes.number.isRequired,
  campoPrimario: PropTypes.string,
  nombreTabla: PropTypes.string,
  campoOrden: PropTypes.string,
  campoNombre: PropTypes.string,
  campoForanea: PropTypes.string,
  campoPadre: PropTypes.string,
  condiciones: PropTypes.object,
  servicio: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    parametros: PropTypes.object.isRequired
  }),
  tablaConfiguracion: PropTypes.string,
  tipoFormulario: PropTypes.bool,
  numeroColFormulario: PropTypes.number,
  calculaPrimaria: PropTypes.bool,
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
      }),
      avatar: PropTypes.shape({
        campoNombre: PropTypes.string.isRequired
      })
    })
  ),
  validarInsertar: PropTypes.bool,
  showToolbar: PropTypes.bool,
  showPaginador: PropTypes.bool,
  showBotonInsertar: PropTypes.bool,
  showBotonEliminar: PropTypes.bool,
  showBuscar: PropTypes.bool,
  showRowIndex: PropTypes.bool,
  hookFormulario: PropTypes.object,
  totalColumnasSkeleton: PropTypes.number,
  height: PropTypes.number,
  // Eventos
  onModificar: PropTypes.func,
  onInsertar: PropTypes.func,
  onEliminar: PropTypes.func
};

export default Tabla;
