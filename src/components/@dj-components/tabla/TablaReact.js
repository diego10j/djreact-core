import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
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
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import { withStyles, makeStyles, experimentalStyled as styled, alpha, useTheme } from '@material-ui/core/styles';
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
    opacity: '0.6 !important',
    transition: 'none !important'
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
    borderBottom: `solid 1px ${theme.palette.divider}`
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
      campoOrden,
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
      getInsertadas,
      getModificadas,
      getEliminadas,
      setCargando,
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
      paginaActual
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      insertarTablaReact,
      eliminarTablaReact,
      actualizarTablaReact,
      seleccionarFilaTablaReact
    }));

    const theme = useTheme();
    const classes = useStyles();
    // Ancho del body cuando todabia esta cargando la data
    const minHeightBody = filasPorPagina * 30;

    useEffect(() => {
      if (isDefined(indiceTabla)) seleccionarFilaTablaReact();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        autoResetSortBy: !skipPageReset,
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
        getInsertadas,
        getModificadas,
        getEliminadas,
        setColumnaSeleccionada,
        initialState: {
          pageSize: filasPorPagina,
          pageIndex: paginaActual,
          sortBy: [
            {
              id: campoOrden,
              desc: false
            }
          ]
        }
      },
      useGlobalFilter, // useGlobalFilter!
      useFilters, // useFilters!
      useSortBy,
      usePagination,
      useRowSelect
    );

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
        gotoPage(0);
        setAllFilters([]);
        const tmpPk = insertar();
        // const pagina = parseInt(data.length / filasPorPagina, 10);
        // gotoPage(pagina);
        if (tmpPk) {
          seleccionarFilaTablaReact();
          // setCargando(true);
          // gotoPage(0);
          // const row = page[0]; // selecciona fila insertada
          // selecciona columna 1 para que ponga el autofocus si es Texto
          // setColumnaSeleccionada(row.cells[0].column.nombre);
          // await prepareRow(row);
          // toggleAllRowsSelected(false); // clear seleccionadas
          // toggleRowSelected('0');
          // setCargando(false);
        }
      }
    };

    const eliminarTablaReact = async () => {
      if (!lectura) {
        if (await eliminar()) {
          toggleAllRowsSelected(false); // clear seleccionadas
        }
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
      if (indiceTabla >= 0) {
        const pagina = parseInt(indiceTabla / filasPorPagina, 10);
        if (pageIndex !== pagina) {
          gotoPage(pagina);
        }
        const auxIndice = indiceTabla - pagina * filasPorPagina;
        toggleAllRowsSelected(false);
        const row = page[auxIndice];
        await prepareRow(row);
        setCargando(true);
        // selecciona columna 1 para que ponga el autofocus
        setColumnaSeleccionada(row.cells[0].column.nombre);
        setCargando(false);
        toggleRowSelected(`${indiceTabla}`);
      }
    };

    // Render the UI for your table isColumnas && cargando
    return (
      <StyledDiv>
        <Grid container sx={{ mb: 1 }}>
          <MHidden width="smDown">
            <Grid item xs={6}>
              {showBuscar === true && (
                <Box sx={{ pt: 0, pb: 0 }}>
                  <FiltroGlobalTabla
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    setColumnaSeleccionada={setColumnaSeleccionada}
                  />
                </Box>
              )}
            </Grid>
          </MHidden>
          <Grid item xs>
            {showPaginador === true &&
              (data.length > filasPorPagina ? (
                <StyledTablePagination
                  component="div"
                  labelRowsPerPage=""
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
                  // labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count} filas`}
                  labelDisplayedRows={({ count }) => `Filas (${count})`}
                />
              ) : (
                !isColumnas && <SkeletonPaginador />
              ))}
          </Grid>
        </Grid>

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
                                {columna.nombrevisual}{' '}
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
                              {columna.nombrevisual}{' '}
                              {columna.requerida && (
                                <Typography color="error" component="span">
                                  {' '}
                                  *{' '}
                                </Typography>
                              )}
                            </span>
                          )}
                          {columna.filtro && <div key={i}>{columna.render('Filter')} </div>}
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
                            setIndiceTabla(row.index);
                            setFilaSeleccionada(data[row.index]);
                          }
                        })}
                      >
                        {showRowIndex && (
                          <StyledTableCellBodyIndex size="small" padding="none">
                            {row.id}
                          </StyledTableCellBodyIndex>
                        )}

                        {!row.isSelected || lectura === true ? (
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
  data: PropTypes.array.isRequired,
  campoOrden: PropTypes.string,
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
  showRowIndex: PropTypes.bool
};
