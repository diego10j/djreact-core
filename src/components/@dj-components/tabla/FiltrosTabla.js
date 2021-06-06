import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, alpha } from '@material-ui/core/styles';
// components
import { InputAdornment, TextField } from '@material-ui/core';
// icons
import FilterAltOutlinedIcon from '@material-ui/icons/FilterAltOutlined';

const StyledTextField = withStyles((theme) => ({
  root: {
    border: 'none',
    fontSize: '0.800rem',
    width: '98%',
    outline: 'none',
    padding: 0,
    marggin: 0,
    paddingBottom: 5,
    '& .MuiInputBase-root': {
      height: '2em',
      padding: 0,
      paddingLeft: 5,
      fontSize: '0.800rem',
      borderRadius: 0
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: `${theme.palette.divider}`
      },
      // '&:hover fieldset': {
      //    borderColor: `${theme.palette.primary.dark}`
      //  },
      '&.Mui-focused fieldset': {
        borderColor: `${theme.palette.primary.lighter}`,
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.1rem`
      }
    }
  }
}))(TextField);

// Define a default UI for filtering
export function DefaultColumnFilter({ column, setColumnaSeleccionada }) {
  return (
    <StyledTextField
      variant="outlined"
      margin="none"
      size="small"
      value={column.filterValue || ''}
      onChange={(e) => {
        setColumnaSeleccionada(undefined);
        column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FilterAltOutlinedIcon fontSize="small" color="disabled" />
          </InputAdornment>
        )
      }}
    />
  );
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired
};
