import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
// react-table
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useFilters,
  useTable
} from 'react-table';
// componentes
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Skeleton from '@material-ui/core/Skeleton';
import Grid from '@material-ui/core/Grid';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import {
  withStyles,
  experimentalStyled as styled
} from '@material-ui/core/styles';
import Scrollbar from '../../Scrollbar';
import axios from '../../../utils/axios';
import ToolbarTabla from './ToolbarTabla';
import { DefaultColumnFilter } from './FiltrosTabla';
import TablePaginationActions from './PaginationTabla';

// Estilos
const StyledDiv = styled('div')(({ theme }) => ({
  border: `solid 1px ${theme.palette.divider}`,
  height: '100%',
  outline: 'none',
  lineHeight: '1.5714285714285714',
  borderRadius: '8px',
  display: 'flex',
  position: 'relative',
  boxSizing: 'border-box',
  flexDirection: 'column'
}));

const StyledTable = withStyles(() => ({
  root: {
    width: '100%',
    fontSize: '0.875rem'
  }
}))(Table);

const StyledTableCellHeader = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
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

// Filtro
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;
export default function TablaE({
  numeroTabla,
  nombreTabla,
  campoPrimario,
  lectura = false,
  campoOrden,
  opcionesColumnas,
  filasPorPagina = 15
}) {
  // Función filtrar
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

  // Configuración por defecto de las columnas
  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      minWidth: 30,
      width: 150,
      maxWidth: 400
    }),
    []
  );

  const [isColumnas, setIsColumnas] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [columns, setColumns] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    getColumnas();
    getDatos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Oculta las columnas no visibles
    const columnasOcultas = columns
      .filter((_col) => _col.visible === false)
      .map((_element) => _element.nombre);
    setHiddenColumns(columnasOcultas);
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

    cols.forEach((_columna) => {
      // Si la tabla es de lectura todas las columnas son de lectura
      if (lectura) {
        _columna.lectura = true;
      }
      _columna.accessor = _columna.nombre;
      _columna.filter = 'fuzzyText';
      _columna.width = _columna.anchocolumna * 16;
    });
    setColumns(cols);
    setIsColumnas(true);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    setHiddenColumns,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter }
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageSize: filasPorPagina }
    },
    useGlobalFilter, // useGlobalFilter!
    useFilters, // useFilters!
    useSortBy,
    usePagination
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  // Render the UI for your table
  return (
    <StyledDiv>
      <ToolbarTabla
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <Scrollbar>
        <TableContainer component={Paper}>
          {!isColumnas ? (
            <Grid item xs={12} sm={6} md={3}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={filasPorPagina * 25}
              />
            </Grid>
          ) : (
            <StyledTable {...getTableProps()} size="small">
              <TableHead>
                {headerGroups.map((headerGroup, index) => (
                  <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((columna, i) => (
                      <StyledTableCellHeader
                        key={i}
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
                          <span>{columna.nombrevisual}</span>
                        )}
                        {true && <div key={i}>{columna.render('Filter')} </div>}
                      </StyledTableCellHeader>
                    ))}
                  </TableRow>
                ))}
              </TableHead>

              <TableBody {...getTableBodyProps()}>
                {page.map((row, index) => {
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
          )}
        </TableContainer>
      </Scrollbar>
      {data.length > filasPorPagina && (
        <TablePagination
          component="div"
          rowsPerPageOptions={[15, 30, 50, 100]}
          colSpan={3}
          count={data.length}
          rowsPerPage={pageSize}
          page={pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count} filas`
          }
        />
      )}
    </StyledDiv>
  );
}

TablaE.propTypes = {
  numeroTabla: PropTypes.number.isRequired,
  nombreTabla: PropTypes.string.isRequired,
  campoPrimario: PropTypes.string.isRequired,
  campoOrden: PropTypes.string,
  filasPorPagina: PropTypes.number,
  lectura: PropTypes.bool,
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
