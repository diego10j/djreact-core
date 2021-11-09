import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
// react-table
import { useGlobalFilter, usePagination, useSortBy, useFilters, useRowSelect, useTable } from 'react-table';
// componentes
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import { experimentalStyled as styled, alpha, useTheme } from '@mui/material/styles';
import { withStyles, makeStyles } from '@mui/styles';
import Scrollbar from '../../Scrollbar';
import { DefaultColumnFilter } from './FiltrosTabla';
import TablePaginationActions from './PaginationTabla';
import { isDefined } from '../../../utils/utilitario';
import SkeletonTabla, { SkeletonPaginador } from './SkeletonTabla';
import FilaEditable from './FilaEditable';
import FiltroGlobalTabla from './FiltroGlobalTabla';
import { MHidden } from '../../@material-extend';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    opacity: '0.2 !important'
  }
}));

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

const StyledTable = withStyles(() => ({
  root: {
    width: '100%',
    fontSize: '0.875rem'
  }
}))(Table);

const StyledTableCellHeader = withStyles(() => ({
  root: {
    height: 'auto',
    padding: '3px !important',
    textAlign: 'center',
    fontWeight: 600,
    '&:first-of-type': {
      borderRadius: 0,
      boxShadow: 'none'
    },
    '&:last-of-type': {
      borderRadius: 0,
      boxShadow: 'none'
    }
  }
}))(TableCell);

const StyledTableCellBody = withStyles((theme) => ({
  root: {
    padding: '0px 5px 0px 5px !important',
    borderBottom: `solid 1px ${theme.palette.divider} !important`
    // borderRight: `solid 1px ${theme.palette.divider}`
  }
}))(TableCell);

const StyledTableCellBodyIndex = withStyles((theme) => ({
  root: {
    textAlign: 'left',
    fontSize: '0.780rem',
    padding: '0px 5px 0px 3px !important',
    backgroundColor: ` ${theme.palette.mode === 'light' ? '#f4f6f8' : '#333d48'}`,
    color: ` ${theme.palette.mode === 'light' ? '#637381' : '#919dab'}`,
    borderBottom: `solid 1px ${theme.palette.divider} !important`
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: 26,
    padding: '0px 10px 0px 10px',
    width: '-moz-fit-content',
    '&:nth-of-type(even)': {
      backgroundColor: ` ${theme.palette.mode === 'light' ? '#fbfbfb' : '#252f3b'}`
    },
    '&:hover': {
      // borderRight: `solid 0.1px ${theme.palette.divider}`,
      backgroundColor: theme.palette.action.focus
    }
  }
}))(TableRow);

const StyledTablePagination = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
    border: 'none',
    overflow: 'hidden',
    '& .MuiToolbar-root': {
      minHeight: '2em',
      height: '2em',
      padding: 0
    },
    '& .MuiTablePagination-select': {
      height: '1.2em'
    },
    '& .MuiTablePagination-displayedRows': {
      color: `${theme.palette.text.disabled}`,
      fontSize: '0.820rem'
    }
  }
}))(TablePagination);

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

const TablaReact = forwardRef(
  (
    {
      columns,
      data,
      lectura,
      cargando,
      isColumnas,
      modificarFila,
      filasPorPagina = 15,
      columnasOcultas,
      filaSeleccionada,
      setValorFilaSeleccionada,
      getValorFilaSeleccionada,
      insertar,
      actualizar,
      eliminar,
      combos,
      setFilaSeleccionada,
      updateMyData,
      skipPageReset,
      showPaginador,
      showBuscar,
      showRowIndex,
      setColumnaSeleccionada,
      columnaSeleccionada,
      setIndiceTabla,
      indiceTabla,
      setPaginaActual,
      paginaActual,
      height
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      insertarTablaReact,
      eliminarTablaReact,
      actualizarTablaReact,
      setPintarFila
    }));

    const theme = useTheme();
    const classes = useStyles();
    const [pintarFila, setPintarFila] = useState(false);
    // Ancho del body cuando todabia esta cargando la data
    height = isDefined(height) ? height : filasPorPagina * 30;

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

    const {
      getTableProps,
      headerGroups,
      prepareRow,
      setGlobalFilter,
      setHiddenColumns,
      page,
      preGlobalFilteredRows,
      gotoPage,
      toggleAllRowsSelected,
      setPageSize,
      setAllFilters,
      state: { pageIndex, pageSize, globalFilter }
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        autoResetPage: !skipPageReset,
        autoResetExpanded: !skipPageReset,
        autoResetGroupBy: !skipPageReset,
        autoResetSelectedRows: !skipPageReset,
        autoResetSortBy: true,
        autoResetFilters: !skipPageReset,
        autoResetRowState: !skipPageReset,
        autoResetGlobalFilter: !skipPageReset,
        // updateMyData isn't part of the API, but
        // anything we put into these options will
        // automatically be available on the instance.
        // That way we can call this function from our
        // cell renderer!
        updateMyData,
        modificarFila,
        filterTypes,
        combos,
        setColumnaSeleccionada,
        initialState: {
          pageSize: filasPorPagina,
          pageIndex: paginaActual
        }
      },
      useGlobalFilter, // useGlobalFilter!
      useFilters, // useFilters!
      useSortBy,
      usePagination,
      useRowSelect
    );

    /**
     * Oculta columnas
     */
    useEffect(() => {
      setHiddenColumns(columnasOcultas);
    }, [columnasOcultas]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Sirve para pintar la fila seleccionada
     */
    useEffect(() => {
      async function selectRow() {
        if (pintarFila === true) {
          // console.log(indiceTabla);
          // console.log(filaSeleccionada);
          // console.log(rows.length);
          if (isDefined(indiceTabla)) await seleccionarFilaTablaReact();

          setPintarFila(false);
        }
      } // Execute the created function directly
      selectRow();
    }, [pintarFila]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChangePage = (event, newPage) => {
      gotoPage(newPage);
      setPaginaActual(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setPageSize(Number(event.target.value));
    };

    const insertarTablaReact = () => {
      if (!lectura) {
        // setAllFilters([]);
        setAllFilters([]);
        if (insertar()) setPintarFila(true);
      }
    };

    const eliminarTablaReact = async () => {
      if (!lectura) {
        if (await eliminar()) toggleAllRowsSelected(false); // clear seleccionadas
      }
    };

    const actualizarTablaReact = () => {
      setAllFilters([]);
      actualizar();
      toggleAllRowsSelected(false); // clear seleccionadas
    };

    /**
     * Selecciona la fila del indice actual de la tabla
     */
    const seleccionarFilaTablaReact = async () => {
      if (preGlobalFilteredRows.length > 0) {
        if (indiceTabla >= 0) {
          const pagina = parseInt(indiceTabla / filasPorPagina, 10);
          if (pageIndex !== pagina) await gotoPage(pagina);
          toggleAllRowsSelected(false);
          const row = preGlobalFilteredRows.find((row) => row.index === indiceTabla);
          await prepareRow(row);
          row.toggleRowSelected();
          // selecciona columna 1 para que ponga el autofocus
          setColumnaSeleccionada(row.cells[0].column.nombre);
        }
      }
    };

    // Render the UI for your table isColumnas && cargando
    return (
      <StyledDiv>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ pb: '10px' }}
        >
          <MHidden width="mdDown">
            {showBuscar === true && (
              <Box sx={{ pt: 0, pb: 0 }}>
                <FiltroGlobalTabla
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  setColumnaSeleccionada={setColumnaSeleccionada}
                />
              </Box>
            )}
          </MHidden>
          <>
            {showPaginador === true &&
              (data.length > filasPorPagina ? (
                <StyledTablePagination
                  component="div"
                  labelRowsPerPage=""
                  rowsPerPageOptions={[filasPorPagina, 30, 50, 100]}
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
                  // labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count} filas`}
                  labelDisplayedRows={({ count }) => `Filas (${count})`}
                />
              ) : (
                !isColumnas && <SkeletonPaginador />
              ))}
          </>
        </Stack>

        <Scrollbar>
          <TableContainer
            sx={{
              height: { xs: `${height + 45}px  !important`, md: `${height}px  !important` }
            }}
          >
            {!isColumnas ? (
              <SkeletonTabla filasPorPagina={filasPorPagina} height={height} />
            ) : (
              <StyledTable {...getTableProps()} size="small" stickyHeader>
                <TableHead>
                  {headerGroups.map((headerGroup, index) => (
                    <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
                      {showRowIndex && <StyledTableCellHeader component="th" padding="none" style={{ minWidth: 3 }} />}
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
                              <span>
                                {columna.nombreVisual}
                                {columna.requerida && (
                                  <Typography color="error" component="span">
                                    {' '}
                                    *{' '}
                                  </Typography>
                                )}
                              </span>
                            </TableSortLabel>
                          ) : (
                            <span>
                              {columna.nombreVisual}
                              {columna.requerida && (
                                <Typography color="error" component="span">
                                  {' '}
                                  *{' '}
                                </Typography>
                              )}
                            </span>
                          )}
                          {columna.filtro && <div>{columna.render('Filter')} </div>}
                        </StyledTableCellHeader>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
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
                            setIndiceTabla(row.index);
                            setFilaSeleccionada(data[row.index]);
                          }
                        })}
                      >
                        {showRowIndex && (
                          <StyledTableCellBodyIndex size="small" padding="none">
                            {row.index + 1}
                          </StyledTableCellBodyIndex>
                        )}

                        {!row.isSelected || lectura === true ? (
                          row.cells.map((cell, index) => (
                            <StyledTableCellBody
                              key={index}
                              {...cell.getCellProps()}
                              onClick={() => setColumnaSeleccionada(cell.column.nombre)}
                              size="small"
                              padding="none"
                              align={cell.column.alinear}
                            >
                              {cell.render('Cell')}
                            </StyledTableCellBody>
                          ))
                        ) : (
                          <FilaEditable
                            row={row}
                            columnaSeleccionada={columnaSeleccionada}
                            filaSeleccionada={filaSeleccionada}
                            modificarFila={modificarFila}
                            setValorFilaSeleccionada={setValorFilaSeleccionada}
                            getValorFilaSeleccionada={getValorFilaSeleccionada}
                            updateMyData={updateMyData}
                            columns={columns}
                            combos={combos}
                            vistaFormularo={false}
                          />
                        )}
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </StyledTable>
            )}
          </TableContainer>
        </Scrollbar>
        <Backdrop className={classes.root} open={isColumnas && cargando}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </StyledDiv>
    );
  }
);

export default TablaReact;

TablaReact.propTypes = {
  columns: PropTypes.array.isRequired,
  filasPorPagina: PropTypes.number,
  indiceTabla: PropTypes.number,
  data: PropTypes.array.isRequired,
  setFilaSeleccionada: PropTypes.func.isRequired,
  cargando: PropTypes.bool.isRequired,
  modificarFila: PropTypes.func.isRequired,
  updateMyData: PropTypes.func.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
  isColumnas: PropTypes.bool.isRequired,
  columnasOcultas: PropTypes.array.isRequired,
  setValorFilaSeleccionada: PropTypes.func.isRequired,
  getValorFilaSeleccionada: PropTypes.func.isRequired,
  filaSeleccionada: PropTypes.object,
  columnaSeleccionada: PropTypes.string,
  setColumnaSeleccionada: PropTypes.func,
  setIndiceTabla: PropTypes.func,
  actualizar: PropTypes.func.isRequired,
  insertar: PropTypes.func.isRequired,
  eliminar: PropTypes.func.isRequired,
  lectura: PropTypes.bool.isRequired,
  combos: PropTypes.array,
  getInsertadas: PropTypes.func,
  getModificadas: PropTypes.func,
  getEliminadas: PropTypes.func,
  setCargando: PropTypes.func,
  showPaginador: PropTypes.bool,
  showBuscar: PropTypes.bool,
  showRowIndex: PropTypes.bool,
  setPaginaActual: PropTypes.func.isRequired,
  paginaActual: PropTypes.number,
  height: PropTypes.number
};
