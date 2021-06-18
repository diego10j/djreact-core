/* eslint-disable prefer-destructuring */
import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { withStyles, experimentalStyled as styled, alpha } from '@material-ui/core/styles';
import { Grid, Stack, TextField, TablePagination } from '@material-ui/core';
import { isDefined } from '../../../utils/utilitario';
import { SkeletonPaginador } from './SkeletonTabla';
import TablePaginationActions from './PaginationTabla';

const StyledTextField = withStyles(() => ({
  root: {
    '& .MuiInputBase-root': {
      fontSize: '0.875rem'
    }
  }
}))(TextField);

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

const TablaFormulario = forwardRef(
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
      setColumnaSeleccionada,
      columnaSeleccionada,
      seleccionarFilaPorIndice,
      indiceTabla
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      insertarTablaFormulario,
      eliminarTablaFormulario,
      actualizarTablaFormulario
    }));

    // Configuraciones iniciales
    if (!isDefined(filaSeleccionada)) {
      if (data.length > 0) {
        filaSeleccionada = data[0];
        indiceTabla = 0;
      } else {
        insertar();
      }
    }

    const insertarTablaFormulario = async () => {
      if (!lectura) {
        insertar();
      }
    };

    const eliminarTablaFormulario = async () => {
      if (!lectura) {
        await eliminar();
      }
    };

    const actualizarTablaFormulario = () => {
      actualizar();
    };

    const handleChangePage = (event, newPage) => {
      seleccionarFilaPorIndice(newPage);
    };

    return (
      <StyledDiv>
        <Grid container sx={{ mb: 1 }}>
          <Grid item xs>
            <Grid item xs>
              {showPaginador === true &&
                (data.length ? (
                  <StyledTablePagination
                    component="div"
                    colSpan={3}
                    count={data.length}
                    labelRowsPerPage=""
                    rowsPerPageOptions={[]}
                    rowsPerPage={1}
                    page={indiceTabla}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                    labelDisplayedRows={({ from, count }) => `Fila ${from} de ${count}`}
                  />
                ) : (
                  !isColumnas && <SkeletonPaginador />
                ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {filaSeleccionada &&
              columns.map(
                (columna, index) =>
                  columna.visible && (
                    <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <StyledTextField
                        value={filaSeleccionada[columna.nombre] || ''}
                        margin="none"
                        fullWidth
                        variant="outlined"
                        size="small"
                        label={columna.nombrevisual}
                        disabled={columna.lectura}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Stack>
                  )
              )}
          </Stack>
        </Grid>
      </StyledDiv>
    );
  }
);

export default TablaFormulario;

TablaFormulario.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  setFilaSeleccionada: PropTypes.func.isRequired,
  cargando: PropTypes.bool.isRequired,
  modificarFila: PropTypes.func.isRequired,
  updateMyData: PropTypes.func.isRequired,
  isColumnas: PropTypes.bool.isRequired,
  columnasOcultas: PropTypes.array.isRequired,
  setValorFilaSeleccionada: PropTypes.func.isRequired,
  getValorFilaSeleccionada: PropTypes.func.isRequired,
  filaSeleccionada: PropTypes.object,
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
  showBuscar: PropTypes.bool
};
