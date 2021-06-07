import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
// components
import { Checkbox, InputAdornment, ListItemText, MenuItem, Select, TextField } from '@material-ui/core';
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

const useStyles = makeStyles({
  item: {
    padding: 0,
    margin: 0,
    '& span, & svg': {
      fontSize: '0.840rem'
    }
  }
});

// Define a default UI for filtering
export function DefaultColumnFilter({ column, setColumnaSeleccionada, combos }) {
  return (
    <>
      {(column.componente === 'Texto' ||
        column.componente === 'TextoNumero' ||
        column.componente === 'TextoEntero') && (
        <FiltroTexto column={column} setColumnaSeleccionada={setColumnaSeleccionada} />
      )}

      {column.componente === 'Combo' && (
        <FiltroCombo column={column} setColumnaSeleccionada={setColumnaSeleccionada} combos={combos} />
      )}
    </>
  );
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired,
  combos: PropTypes.array
};

const FiltroTexto = ({ column, setColumnaSeleccionada }) => {
  const onChange = (e) => {
    setColumnaSeleccionada(undefined);
    column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
  };

  return (
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
  );
};
FiltroTexto.propTypes = {
  column: PropTypes.object.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired
};

const FiltroCombo = ({ column, setColumnaSeleccionada, combos }) => {
  const classes = useStyles();

  const onChange = (e) => {
    setColumnaSeleccionada(undefined);
    column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
  };

  return (
    <StyledSelect
      value={column.filterValue || []}
      onChange={onChange}
      variant="outlined"
      style={{ width: column.width }}
      fullWidth
      multiple
      renderValue={(selected) => selected.map((element) => element.label).join(', ')}
    >
      {combos
        .find((col) => col.columna === column.nombre)
        ?.listaCombo.map((element, index) => (
          <MenuItem key={index} value={element}>
            <Checkbox checked={(column.filterValue || []).indexOf(element) > -1} />
            <ListItemText className={classes.item} primary={element.label} />
          </MenuItem>
        ))}
    </StyledSelect>
  );
};
FiltroCombo.propTypes = {
  column: PropTypes.object.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired,
  combos: PropTypes.array
};
