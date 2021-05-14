import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// componentes
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import { withStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table';
import { MIconButton } from '../../@material-extend';
import axios from '../../../utils/axios';

// Estilo

const StyledTableContainer = withStyles((theme) => ({
  root: {
    width: '100%',
    border: `solid 1px ${theme.palette.divider}`,
    height: '100%',
    outline: 'none',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    lineHeight: '1.5714285714285714',
    borderRadius: '8px'
  }
}))(TableContainer);

const StyledTable = withStyles(() => ({
  root: {
    fontSize: '0.875rem'
  }
}))(Table);

const StyledTableCellHeader = withStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
    borderBottom: `solid 1px ${theme.palette.divider}`,
    height: 'auto',
    padding: '3px 10px 3px 10px'
  }
}))(TableCell);

const StyledTableCellBody = withStyles(() => ({
  root: {
    padding: '0px 10px 0px 10px'
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: 25,
    padding: '0px 10px 0px 10px',
    width: '-moz-fit-content',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);

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
      Filter: DefaultColumnFilter,
      minWidth: 30,
      width: 150,
      maxWidth: 400
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
        width: element.anchocolumna * 16,
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
    <StyledTableContainer component={Paper}>
      <Toolbar variant="dense">
        <Tooltip title="Opciones">
          <MIconButton>
            <MoreVertIcon />
          </MIconButton>
        </Tooltip>
      </Toolbar>
      <StyledTable {...getTableProps()} size="small">
        <TableHead>
          {headerGroups.map((headerGroup, index) => (
            <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((columna, index) => (
                <StyledTableCellHeader
                  key={index}
                  component="th"
                  padding="none"
                  style={{ minWidth: columna.anchocolumna * 17 }}
                  {...columna.getHeaderProps()}
                >
                  {columna.ordenable ? (
                    <TableSortLabel
                      {...columna.getSortByToggleProps()}
                      active={columna.isSorted}
                      direction={columna.isSortedDesc ? 'desc' : 'asc'}
                    >
                      {columna.nombrevisual}
                    </TableSortLabel>
                  ) : (
                    <div>HOLA</div>
                  )}

                  <div key={index}>{columna.render('Filter')} </div>
                </StyledTableCellHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <StyledTableRow key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <StyledTableCellBody
                    size="small"
                    padding="none"
                    key={index}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </StyledTableCellBody>
                ))}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
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
