import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useGridSlotComponentProps } from '@material-ui/data-grid';
import Pagination from '@material-ui/core/Pagination';

const useStyles = makeStyles({
  root: {
    display: 'flex'
  }
});

export default function PaginationTabla() {
  const { state, apiRef } = useGridSlotComponentProps();
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      showFirstButton
      showLastButton
      color="primary"
      size="small"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}
