import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Skeleton } from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';

const SkeletonTabla = ({ filasPorPagina, width }) => {
  const numColumnas =
    (width === 'xl' && 6) ||
    (width === 'lg' && 4) ||
    (width === 'md' && 3) ||
    2;
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
              <Skeleton variant="rect" width="100%" height={18.4} />
            </Grid>
          ))}
        </Grid>
      ))}
    </>
  );
};
SkeletonTabla.propTypes = {
  filasPorPagina: PropTypes.number.isRequired,
  width: PropTypes.string.isRequired
};

export default withWidth()(SkeletonTabla);
