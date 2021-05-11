import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// components
import { DataGrid } from '@material-ui/data-grid';
import axios from '../../../utils/axios';
import ToolbarTabla from './ToolbarTabla';
import { TextosLocaleEsp } from './TextosLocaleEsp';
import PaginationTabla from './PaginationTabla';
import { renderRating } from '../CuerpoTabla';

export default function Tabla({
  numeroTabla,
  nombreTabla,
  campoPrimario,
  lectura,
  campoOrden,
  opcionesColumnas,
  pageSize = 15,
  rowHeight = 25
}) {
  const [cargando, setCargando] = useState(false);
  const [columnas, setColumnas] = useState([]);
  const [tablaColumnas, setTablaColumnas] = useState([]);

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    getColumnas();
    getDatos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          campoOrden: campoOrden || campoPrimario,
          condiciones: []
        })
        .then((response) => {
          const { data } = response;
          const datosDef = data.datos.map((element) => ({
            id: element[campoPrimario],
            ...element
          }));
          setDatos(datosDef);
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
      const columnasDef = data.datos.map((_columna, _index) => ({
        field: _columna.nombre,
        type: _columna.type,
        headerName: _columna.nombrevisual,
        width: _columna.anchocolumna * 17,
        hide: !_columna.visible,
        filterable: true,
        sortable: _columna.ordenable,
        editable: !_columna.lectura,
        index: _index,
        renderCell: renderRating
      }));

      setTablaColumnas(columnasDef);
    } catch (error) {
      console.error(error);
    }
  };

  const formarColumnas = (cols) => {
    if (opcionesColumnas) {
      console.log('---FORMAR COLUMNAS');
      // Aplica cada configuración realizada a las columnas
      opcionesColumnas.forEach((_columna) => {
        const colActual = cols.find((_col) => _col.nombre === _columna.nombre);
        colActual.visible =
          'visible' in _columna ? _columna.visible : colActual.visible;
        colActual.nombrevisual =
          'nombreVisual' in _columna
            ? _columna.nombreVisual
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
          'comentario' in _columna ? _columna.comentario : colActual.comentario;
        colActual.mayuscula =
          'mayuscula' in _columna ? _columna.mayuscula : colActual.mayuscula;
        colActual.alinear =
          'alinear' in _columna ? _columna.alinear : colActual.alinear;
        colActual.ordenable =
          'ordenable' in _columna ? _columna.ordenable : colActual.ordenable;
      });
      // ordena las columnas
      cols.sort((a, b) => (a.orden < b.orden ? -1 : 1));
    }
    // Si la tabla es de lectura todas las columnas son de lectura
    if (lectura === true) {
      cols.forEach((_columna) => {
        _columna.lectura = true;
      });
    }
    setColumnas(cols);
  };

  const insertar = () => {
    console.log('insertar');
    console.log(columnas);
  };

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        showCellRightBorder
        disableColumnMenu
        hideFooterSelectedRowCount
        localeText={TextosLocaleEsp}
        columns={tablaColumnas}
        rows={datos}
        pageSize={pageSize}
        loading={cargando}
        rowHeight={rowHeight}
        disableColumnSelector
        autoHeight
        pagination
        components={{
          Toolbar: ToolbarTabla,
          Pagination: PaginationTabla
        }}
        componentsProps={{ toolbar: { insertar } }}
      />
    </div>
  );
}

Tabla.propTypes = {
  numeroTabla: PropTypes.number.isRequired,
  nombreTabla: PropTypes.string.isRequired,
  campoPrimario: PropTypes.string.isRequired,
  lectura: PropTypes.bool.isRequired,
  campoOrden: PropTypes.string,
  opcionesColumnas: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      nombreVisual: PropTypes.string,
      valorDefecto: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      requerida: PropTypes.bool,
      visible: PropTypes.bool,
      lectura: PropTypes.bool,
      orden: PropTypes.number,
      anchoColumna: PropTypes.number,
      decimales: PropTypes.number,
      comentario: PropTypes.string,
      mayusculas: PropTypes.bool,
      alinear: PropTypes.oneOf(['izquierda', 'derecha', 'centro']),
      ordenable: PropTypes.bool
    })
  ),
  pageSize: PropTypes.number,
  rowHeight: PropTypes.number
};
