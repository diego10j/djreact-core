import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// components
import { InputAdornment, MenuItem, Select, TextField } from '@material-ui/core';
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
    '& .MuiInputBase-root': {
      height: '2em',
      padding: 0,
      paddingLeft: 5,
      fontSize: '0.800rem',
      borderRadius: 0
    },
    '& .MuiOutlinedInput-root': {
      marginBottom: 5,
      '& fieldset': {
        borderColor: `${theme.palette.divider}`
      }
      // '&:hover fieldset': {
      //    borderColor: `${theme.palette.primary.dark}`
      //  },
      // '&:hover fieldset.Mui-focused fieldset': {
      //  borderColor: `${theme.palette.primary.lighter}`,
      //  boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.1rem`
      // }
    }
  }
}))(TextField);

const StyledSelect = withStyles((theme) => ({
  root: {
    border: 'none',
    fontSize: '0.875rem',
    width: '98%',
    maxWidth: '98%',
    height: '1.60rem',
    outline: 'none',
    marggin: 0,
    padding: '0 5px 0 5px !important',
    borderRadius: 0,
    textAlign: 'left',
    marginBottom: 6,
    '& .MuiSelect-outlined': {
      padding: 0
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.palette.divider}`
    }
  }
}))(Select);

// Define a default UI for filtering
export function DefaultColumnFilter({ column, setColumnaSeleccionada, combos }) {
  const onChange = (e) => {
    setColumnaSeleccionada(undefined);
    column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
  };

  return (
    <>
      {column.componente === 'Texto' && (
        <StyledTextField
          variant="outlined"
          margin="none"
          size="small"
          value={column.filterValue || ''}
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterAltOutlinedIcon fontSize="small" color="disabled" />
              </InputAdornment>
            )
          }}
        />
      )}
      {(column.componente === 'TextoNumero' || column.componente === 'TextoEntero') && (
        <StyledTextField
          type="number"
          value={column.filterValue || ''}
          onChange={onChange}
          size="small"
          variant="outlined"
          margin="none"
          sx={{ textAlign: `${column.alinear}` }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterAltOutlinedIcon fontSize="small" color="disabled" />
              </InputAdornment>
            )
          }}
        />
      )}

      {column.componente === 'Combo' && (
        <StyledSelect value={column.filterValue || ''} onChange={onChange} variant="outlined" fullWidth>
          <MenuItem value="">
            <em>&nbsp;</em>
          </MenuItem>
          {combos
            .find((col) => col.columna === column.nombre)
            ?.listaCombo.map((element, index) => (
              <MenuItem key={index} value={element.value}>
                {element.label}
              </MenuItem>
            ))}
        </StyledSelect>
      )}
    </>
  );
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired,
  combos: PropTypes.array
};
