import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// react-table
import { useGlobalFilter, usePagination, useSortBy, useFilters, useRowSelect, useTable } from 'react-table';
// componentes
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import { withStyles, makeStyles, experimentalStyled as styled, useTheme, alpha } from '@material-ui/core/styles';
import Scrollbar from '../../Scrollbar';
import ToolbarTabla from './ToolbarTabla';
import { DefaultColumnFilter } from './FiltrosTabla';
import TablePaginationActions from './PaginationTabla';
import SkeletonTabla from './SkeletonTabla';
import FilaEditable from './FilaEditable';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    opacity: '0.6 !important',
    transition: 'none !important'
  }
}));

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
    padding: '3px !important',
    textAlign: 'center'
  }
}))(TableCell);

const StyledTableCellBody = withStyles((theme) => ({
  root: {
    padding: '0px 5px 0px 5px !important',
    borderBottom: `solid 0.1px ${theme.palette.divider}`,
    borderRight: `solid 0.1px ${theme.palette.divider}`
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: 25,
    padding: '0px 10px 0px 10px',
    width: '-moz-fit-content',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    '&:hover': {
      borderRight: `solid 0.1px ${theme.palette.divider}`,
      backgroundColor: theme.palette.action.focus
    }
  }
}))(TableRow);

// Filtro
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Configuracion columna por defecto
// Configuración por defecto de las columnas
const defaultColumn = {
  // Let's set up our default Filter UI
  Filter: DefaultColumnFilter,
  minWidth: 30,
  width: 150,
  maxWidth: 400
};

export default function TablaReact({
  columns,
  data,
  lectura,
  campoPrimario,
  cargando,
  isColumnas,
  modificarFila,
  filasPorPagina = 15,
  columnasOcultas,
  setFilaSeleccionada,
  actualizar,
  insertar,
  eliminar,
  combos,
  getInsertadas,
  getModificadas,
  getEliminadas,
  // setData,
  updateMyData,
  skipPageReset
}) {
  const theme = useTheme();

  const [columnaSeleccionada, setColumnaSeleccionada] = useState();

  useEffect(() => {
    setHiddenColumns(columnasOcultas);
  }, [columnasOcultas]); // eslint-disable-line react-hooks/exhaustive-deps

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
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const classes = useStyles();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    setHiddenColumns,
    page,
    gotoPage,
    toggleAllRowsSelected,
    toggleRowSelected,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter }
  } = useTable(
    {
      autoResetSelectedRows: false,
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      modificarFila,
      filterTypes,
      combos,
      getInsertadas,
      getModificadas,
      getEliminadas,
      initialState: { pageSize: filasPorPagina }
    },
    useGlobalFilter, // useGlobalFilter!
    useFilters, // useFilters!
    useSortBy,
    usePagination,
    useRowSelect
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };
  // Ancho del body cuando todabia esta cargando la data
  const minHeightBody = filasPorPagina * 30;

  // Render the UI for your table isColumnas && cargando
  return (
    <StyledDiv>
      <ToolbarTabla
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actualizar={actualizar}
        insertar={insertar}
        eliminar={eliminar}
        toggleAllRowsSelected={toggleAllRowsSelected}
        toggleRowSelected={toggleRowSelected}
        lectura={lectura}
        page={page}
        prepareRow={prepareRow}
        setColumnaSeleccionada={setColumnaSeleccionada}
      />
      <Scrollbar>
        <TableContainer
          sx={{
            minHeight: `${minHeightBody}px  !important`
          }}
        >
          {!isColumnas ? (
            <SkeletonTabla filasPorPagina={filasPorPagina} />
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
                        style={{ minWidth: columna.width }}
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
                    <StyledTableRow
                      key={index}
                      {...row.getRowProps({
                        style: {
                          backgroundColor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.5) : ''
                        },
                        onClick: () => {
                          toggleAllRowsSelected(false);
                          row.toggleRowSelected();
                          if (lectura) setFilaSeleccionada(row.values);
                          else
                            setFilaSeleccionada(data.find((fila) => fila[campoPrimario] === row.values[campoPrimario]));
                        }
                      })}
                    >
                      {!row.isSelected ? (
                        row.cells.map((cell, index) => (
                          <StyledTableCellBody
                            onClick={() => setColumnaSeleccionada(cell.column.nombre)}
                            size="small"
                            padding="none"
                            align={cell.column.alinear}
                            key={index}
                            {...cell.getCellProps()}
                          >
                            {cell.render('Cell')}
                          </StyledTableCellBody>
                        ))
                      ) : (
                        <FilaEditable
                          row={row}
                          columnaSeleccionada={columnaSeleccionada}
                          modificarFila={modificarFila}
                          updateMyData={updateMyData}
                          columns={columns}
                          combos={combos}
                        />
                      )}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </StyledTable>
          )}
        </TableContainer>
        <Backdrop className={classes.root} open={isColumnas && cargando}>
          <CircularProgress color="inherit" />
        </Backdrop>
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
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count} filas`}
        />
      )}
    </StyledDiv>
  );
}

TablaReact.propTypes = {
  columns: PropTypes.array.isRequired,
  filasPorPagina: PropTypes.number,
  data: PropTypes.array.isRequired,
  campoPrimario: PropTypes.string,
  cargando: PropTypes.bool.isRequired,
  modificarFila: PropTypes.func.isRequired,
  updateMyData: PropTypes.func.isRequired,
  // setData: PropTypes.func.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
  isColumnas: PropTypes.bool.isRequired,
  columnasOcultas: PropTypes.array.isRequired,
  setFilaSeleccionada: PropTypes.func.isRequired,
  actualizar: PropTypes.func.isRequired,
  insertar: PropTypes.func.isRequired,
  eliminar: PropTypes.func.isRequired,
  lectura: PropTypes.bool.isRequired,
  combos: PropTypes.array,
  getInsertadas: PropTypes.func,
  getModificadas: PropTypes.func,
  getEliminadas: PropTypes.func
};
