import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// componentes
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table';
import axios from '../../../utils/axios';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0'
        }}
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

export default function TablaE({
  numeroTabla,
  nombreTabla,
  campoPrimario,
  campoOrden,
  opcionesColumnas
}) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );

  const [cargando, setCargando] = useState(false);
  const [columns, setColumns] = useState([]);

  const [data, setData] = useState([]);

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
          setData(datosDef);
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
      const columnasDef = data.datos.map((element) => ({
        accessor: element.nombre,
        filter: 'includes',
        ...element
      }));
      setColumns(columnasDef);
    } catch (error) {
      console.error(error);
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy
  );

  // Render the UI for your table
  return (
    <div style={{ width: '100%' }}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, index) => (
            <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((columna, index) => (
                <TableCell
                  key={index}
                  {...columna.getHeaderProps(columna.getSortByToggleProps())}
                >
                  {columna.nombrevisual}
                  {columna.ordenable && (
                    <TableSortLabel
                      active={columna.isSorted}
                      direction={columna.isSortedDesc ? 'desc' : 'asc'}
                    />
                  )}
                  <div> {columna.render('Filter')} </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <TableRow key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <TableCell key={index} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

TablaE.propTypes = {
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
  )
};
