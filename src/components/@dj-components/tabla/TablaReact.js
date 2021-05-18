import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// react-table
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useFilters,
  useRowSelect,
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
import { TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { DatePicker } from '@material-ui/lab';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import {
  withStyles,
  experimentalStyled as styled
} from '@material-ui/core/styles';
import Scrollbar from '../../Scrollbar';
import ToolbarTabla from './ToolbarTabla';
import { DefaultColumnFilter } from './FiltrosTabla';
import TablePaginationActions from './PaginationTabla';
import SkeletonTabla from './SkeletonTabla';

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

const StyledTexto = styled('input')(({ theme }) => ({
  border: 'none',
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
  outline: 'none'
}));

const StyledTextField = withStyles((theme) => ({
  root: {
    border: 'none',
    fontSize: '0.875rem',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    padding: 0,
    marggin: 0,
    '& .MuiInputBase-root': {
      padding: 0,
      marggin: 0,
      fontSize: '0.875rem',
      borderColor: 'blue',
      fontWeight: '400',
      '&:before': {
        border: 'none'
      }
    },
    '& .MuiInputBase-root:hover': {
      '&:before': {
        border: 'none'
      }
    }
  }
}))(TextField);

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
    },
    '&:hover': {
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

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  columns,
  modificarFila,
  updateMyData // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);
  const [columna, setColumna] = useState(
    columns.find((_col) => _col.nombre === id)
  );

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
    // modificarFila([index, id, value]);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      {columna.componente === 'Texto' && (
        <StyledTextField
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          size="small"
          variant="standard"
          margin="none"
        />
      )}

      {columna.componente === 'Calendario' && (
        <DatePicker
          views={['date']}
          value={value}
          onChange={(newValue) => {
            setValue(newValue || '');
          }}
          onBlur={onBlur}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              fullWidth
              size="small"
              variant="standard"
              margin="none"
              helperText={null}
            />
          )}
        />
      )}
    </>
  );
};

// Configuracion columna por defecto
// Configuración por defecto de las columnas
const defaultColumn = {
  // Let's set up our default Filter UI
  Filter: DefaultColumnFilter,
  Cell: EditableCell,
  minWidth: 30,
  width: 150,
  maxWidth: 400
};

export default function TablaReact({
  columns,
  data,
  isColumnas,
  updateMyData,
  skipPageReset,
  filasPorPagina = 15,
  columnasOcultas,
  modificarFila
}) {
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
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
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
    setPageSize,
    state: { pageIndex, pageSize, globalFilter, selectedRowIds }
  } = useTable(
    {
      autoResetSelectedRows: false,
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      modificarFila,
      filterTypes,
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
                    <StyledTableRow
                      key={index}
                      {...row.getRowProps({
                        style: {
                          backgroundColor: row.isSelected
                            ? 'rgba(45, 182, 150, 0.16)'
                            : ''
                        },
                        onClick: () => {
                          toggleAllRowsSelected(false);
                          row.toggleRowSelected();
                        }
                      })}
                    >
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

          <pre>
            <code>{JSON.stringify(selectedRowIds, null, 2)}</code>
          </pre>
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

TablaReact.propTypes = {
  columns: PropTypes.array.isRequired,
  filasPorPagina: PropTypes.number,
  data: PropTypes.array.isRequired,
  updateMyData: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
  isColumnas: PropTypes.bool.isRequired,
  modificarFila: PropTypes.func.isRequired,
  columnasOcultas: PropTypes.array
};