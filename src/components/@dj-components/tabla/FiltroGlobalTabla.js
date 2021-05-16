import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// components
import { InputAdornment, TextField } from '@material-ui/core';
// icons
import SearchIcon from '@material-ui/icons/Search';

const StyledTextField = withStyles(() => ({
  root: {
    width: '100%',
    fontSize: '0.875rem',
    '@media (max-width: 600px)': {
      visibility: 'hidden'
    }
  }
}))(TextField);

export default function FiltroGlobalTabla({ globalFilter, setGlobalFilter }) {
  // Define a default UI for filtering
  return (
    <StyledTextField
      placeholder="Buscar..."
      variant="standard"
      size="small"
      value={globalFilter || ''}
      onChange={(e) => {
        setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" color="disabled" />
          </InputAdornment>
        )
      }}
    />
  );
}

FiltroGlobalTabla.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired
};
