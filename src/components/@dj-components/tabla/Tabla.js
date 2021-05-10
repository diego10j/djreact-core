import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// components
import { DataGrid } from '@material-ui/data-grid';
import axios from '../../../utils/axios';
import ToolbarTabla from './ToolbarTabla';
import { TextosLocaleEsp } from './TextosLocaleEsp';
import PaginationTabla from './PaginationTabla';

export default function Tabla({
  numeroTabla,
  nombreTabla,
  campoPrimario,
  campoOrden,
  opcionesColumnas,
  pageSize = 15,
  rowHeight = 25
}) {
  const [cargando, setCargando] = useState(false);
  const [columnas, setColumnas] = useState([]);

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    console.log('---CARGA COLUMNAS');
    const getColumnas = async () => {
      try {
        const { data } = await axios.post('/api/sistema/getColumnas', {
          nombreTabla,
          campoPrimario,
          ide_opci: 0,
          numero_tabl: numeroTabla
        });
        const columnasDef = data.datos.map((columna, index) => ({
          field: columna.nombre,
          headerName: columna.nombrevisual,
          width: columna.anchocolumna * 17,
          hide: !columna.visible,
          filterable: true,
          sortable: true,
          index
        }));
        setColumnas(columnasDef);
      } catch (error) {
        console.error(error);
      }
    };
    getColumnas();
  }, [nombreTabla, campoPrimario, numeroTabla]);

  useEffect(() => {
    console.log('---CARGA DATOS');
    const getDatos = async () => {
      try {
        setCargando(true);
        const { data } = await axios.post('/api/sistema/consultarTabla', {
          nombreTabla,
          campoOrden: campoOrden || campoPrimario,
          condiciones: []
        });

        const datosDef = data.datos.map((element) => ({
          id: element[campoPrimario],
          ...element
        }));
        setDatos(datosDef);
        setCargando(false);
      } catch (error) {
        setCargando(false);
        console.error(error);
      }
    };
    getDatos();
  }, [nombreTabla, campoPrimario, numeroTabla, campoOrden]);

  const insertar = () => {
    console.log('insertar');
  };

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        localeText={TextosLocaleEsp}
        columns={columnas}
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
