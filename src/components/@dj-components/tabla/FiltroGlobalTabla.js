import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// components
import { InputAdornment, TextField } from '@material-ui/core';
// icons
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const StyledTextField = withStyles(() => ({
  root: {
    width: '20em',
    fontSize: '0.875rem',
    '@media (max-width: 600px)': {
      visibility: 'hidden'
    }
  }
}))(TextField);

const FiltroGlobalTabla = ({ globalFilter, setGlobalFilter }) => {
  // Define a default UI for filtering

  const handleClear = () => {
    setGlobalFilter(undefined);
  };

  return (
    <StyledTextField
      placeholder="Buscar..."
      variant="standard"
      size="small"
      margin="none"
      value={globalFilter || ''}
      onChange={(e) => {
        setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" color="disabled" />
          </InputAdornment>
        ),
        endAdornment: globalFilter && (
          <InputAdornment position="start" onClick={handleClear}>
            <CloseIcon fontSize="small" sx={{ cursor: 'pointer' }} />
          </InputAdornment>
        )
      }}
    />
  );
};

FiltroGlobalTabla.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired
};

export default FiltroGlobalTabla;
