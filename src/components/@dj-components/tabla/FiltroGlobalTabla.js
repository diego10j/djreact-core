import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// components
import { InputAdornment, TextField } from '@material-ui/core';
// icons
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const StyledTextField = withStyles((theme) => ({
  root: {
    width: '20em',
    fontSize: '0.875rem',
    outline: 'none',
    padding: 0,
    marggin: 0,
    paddingTop: 2,
    '& .MuiInputBase-root': {
      height: '2em',
      padding: 0,
      paddingLeft: 5,
      fontSize: '0.875rem'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: `${theme.palette.divider}`,
        borderRadius: 10
      }
      //  '&:hover fieldset': {
      //    borderColor: `${theme.palette.primary.dark}`
      //  },
      // '&.Mui-focused fieldset': {
      //   borderColor: `${theme.palette.primary.lighter}`,
      //    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.1rem`
      //  }
    },
    '@media (max-width: 600px)': {
      visibility: 'hidden'
    }
  }
}))(TextField);

const FiltroGlobalTabla = ({ globalFilter, setGlobalFilter, setColumnaSeleccionada }) => {
  // Define a default UI for filtering

  const handleClear = () => {
    setColumnaSeleccionada(undefined);
    setGlobalFilter(undefined);
  };

  return (
    <StyledTextField
      placeholder="Buscar..."
      variant="outlined"
      size="small"
      margin="none"
      value={globalFilter || ''}
      onChange={(e) => {
        setColumnaSeleccionada(undefined);
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
  setGlobalFilter: PropTypes.func.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired
};

export default FiltroGlobalTabla;
