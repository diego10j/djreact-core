import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Skeleton } from '@material-ui/core';
// hooks
import useWidth from '../../../hooks/useWidth';

const SkeletonTabla = ({ filasPorPagina, height }) => {
  const { width } = useWidth();

  const numColumnas = (width === 'xl' && 6) || (width === 'lg' && 4) || (width === 'md' && 3) || 2;
  return (
    <Box
      sx={{
        height: `${height}px  !important`
      }}
    >
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
    </Box>
  );
};
SkeletonTabla.propTypes = {
  filasPorPagina: PropTypes.number.isRequired,
  height: PropTypes.number
};

export default SkeletonTabla;

export function SkeletonPaginador() {
  return <Skeleton variant="rect" width="20em" height={28} />;
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
                    <Skeleton variant="rect" width="100%" height={40} sx={{ mb: 0.3 }} />
                  </Grid>
                )
            )
          : [...Array(totalColumnasSkeleton).keys()].map((value) => (
              <Grid key={value} item xs={calculaNumColumnas}>
                <Skeleton variant="rect" width="100%" height={40} sx={{ mb: 0.3 }} />
              </Grid>
            ))}
      </Grid>
    </Grid>
  );
}
