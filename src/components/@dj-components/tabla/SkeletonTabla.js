import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Skeleton } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// hooks
import useWidth from '../../../hooks/useWidth';

const SkeletonTabla = ({ filasPorPagina }) => {
  const { width } = useWidth();

  const numColumnas = (width === 'xl' && 6) || (width === 'lg' && 4) || (width === 'md' && 3) || 2;
  return (
    <>
      <Grid container spacing={1}>
        {[...Array(numColumnas).keys()].map((value) => (
          <Grid key={value} item xs>
            <Skeleton variant="rect" width="100%" height={35} />
          </Grid>
        ))}
      </Grid>
      {[...Array(filasPorPagina).keys()].map((value, index) => (
        <Grid key={index} container spacing={1}>
          {[...Array(numColumnas).keys()].map((value) => (
            <Grid
              key={value}
              item
              xs
              sx={{
                pt: 1,
                mt: 1
              }}
            >
              <Skeleton variant="rect" width="100%" height={19.4} />
            </Grid>
          ))}
        </Grid>
      ))}
    </>
  );
};
SkeletonTabla.propTypes = {
  filasPorPagina: PropTypes.number.isRequired
};

export default SkeletonTabla;

const StyledTablePagination = styled('div')(() => ({
  width: '100%',
  padding: 0,
  margin: 0,
  border: 'none',
  minHeight: '2em',
  height: '2em'
}));

export function SkeletonPaginador() {
  return (
    <StyledTablePagination>
      <Skeleton variant="rect" width="22em" height={28} sx={{ mr: 1, float: 'right' }} />
    </StyledTablePagination>
  );
}

SkeletonFormulario.propTypes = {
  columns: PropTypes.array,
  calculaNumColumnas: PropTypes.number,
  totalColumnasSkeleton: PropTypes.number
};

export function SkeletonFormulario({ columns, calculaNumColumnas, totalColumnasSkeleton = 12 }) {
  return (
    <Grid container spacing={1}>
      <Grid container item xs={12} spacing={3}>
        {columns
          ? columns.map(
              (column, index) =>
                column.visible && (
                  <Grid key={index} item xs={calculaNumColumnas}>
                    <Skeleton variant="rect" width="90%" height={40} sx={{ mb: 0.3 }} />
                  </Grid>
                )
            )
          : [...Array(totalColumnasSkeleton).keys()].map((value) => (
              <Grid key={value} item xs={calculaNumColumnas}>
                <Skeleton variant="rect" width="90%" height={40} sx={{ mb: 0.3 }} />
              </Grid>
            ))}
      </Grid>
    </Grid>
  );
}
