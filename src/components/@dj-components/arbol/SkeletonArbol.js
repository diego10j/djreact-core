import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Skeleton } from '@mui/material';

SkeletonArbol.propTypes = {
  numNodos: PropTypes.number
};

export default function SkeletonArbol({ numNodos = 6 }) {
  return (
    <Grid container spacing={1}>
      <Grid container item xs={12}>
        <Skeleton variant="rect" width="100%" height={20} sx={{ mb: 0.8 }} />
        {[...Array(numNodos).keys()].map((value) => (
          <Skeleton key={value} variant="rect" width="100%" height={20} sx={{ mb: 0.8, ml: 1.2 }} />
        ))}
      </Grid>
    </Grid>
  );
}
