/* eslint-disable prefer-destructuring */
import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { withStyles, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Grid, TablePagination, Stack } from '@material-ui/core';
import { SkeletonFormulario, SkeletonPaginador } from './SkeletonTabla';
import TablePaginationActions from './PaginationTabla';
import { ComponenteEditable } from './FilaEditable';
// hooks
import useWidth from '../../../hooks/useWidth';

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
      lectura,
      isColumnas,
      modificarFila,
      filaSeleccionada,
      setValorFilaSeleccionada,
      getValorFilaSeleccionada,
      insertar,
      actualizar,
      eliminar,
      combos,
      updateMyData,
      showPaginador,
      columnaSeleccionada,
      seleccionarFilaPorIndice,
      indiceTabla,
      numeroColFormulario,
      hookFormulario,
      totalColumnasSkeleton,
      cargando,
      height
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      insertarTablaFormulario,
      eliminarTablaFormulario,
      actualizarTablaFormulario
    }));

    const { width } = useWidth();
    let calculaNumColumnas = (width === 'xl' && 4) || (width === 'lg' && 4) || (width === 'md' && 6) || 12;
    if (numeroColFormulario) {
      // Calcula el numero de columnas del formulario
      if (calculaNumColumnas < 12) {
        const aux = 12 / numeroColFormulario;
        calculaNumColumnas = aux;
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
        <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ pb: '10px' }}>
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
        </Stack>
        <Box
          sx={{
            pt: 5,
            px: 2,
            minHeight: { xs: `${height + 45}px  !important`, md: `${height}px  !important` }
          }}
        >
          {!isColumnas && (
            <Grid container spacing={1}>
              <SkeletonFormulario
                calculaNumColumnas={calculaNumColumnas}
                totalColumnasSkeleton={totalColumnasSkeleton}
              />
            </Grid>
          )}

          {cargando === false && data.length > 0 ? (
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={3}>
                {filaSeleccionada &&
                  columns.map(
                    (column, index) =>
                      column.visible && (
                        <Grid key={index} item xs={calculaNumColumnas}>
                          <ComponenteEditable
                            setValorFilaSeleccionada={setValorFilaSeleccionada}
                            getValorFilaSeleccionada={getValorFilaSeleccionada}
                            column={column}
                            foco={columnaSeleccionada === column.nombre}
                            modificarFila={modificarFila}
                            updateMyData={updateMyData}
                            index={indiceTabla}
                            combos={combos}
                            vistaFormularo
                            hookFormulario={hookFormulario}
                          />
                        </Grid>
                      )
                  )}
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={1}>
              <SkeletonFormulario calculaNumColumnas={calculaNumColumnas} columns={columns} />
            </Grid>
          )}
        </Box>
      </StyledDiv>
    );
  }
);

export default TablaFormulario;

TablaFormulario.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  lectura: PropTypes.bool.isRequired,
  isColumnas: PropTypes.bool.isRequired,
  modificarFila: PropTypes.func.isRequired,
  filaSeleccionada: PropTypes.object,
  cargando: PropTypes.bool,
  setValorFilaSeleccionada: PropTypes.func.isRequired,
  getValorFilaSeleccionada: PropTypes.func.isRequired,
  insertar: PropTypes.func.isRequired,
  actualizar: PropTypes.func.isRequired,
  eliminar: PropTypes.func.isRequired,
  combos: PropTypes.array,
  updateMyData: PropTypes.func.isRequired,
  showPaginador: PropTypes.bool,
  columnaSeleccionada: PropTypes.string,
  seleccionarFilaPorIndice: PropTypes.func.isRequired,
  indiceTabla: PropTypes.number,
  numeroColFormulario: PropTypes.number,
  hookFormulario: PropTypes.object,
  totalColumnasSkeleton: PropTypes.number,
  height: PropTypes.number
};
