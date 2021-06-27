import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { DateRangePicker } from '@material-ui/lab';
import { Box, Stack, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// componentes
import BotonBuscar from '../boton/BotonBuscar';

// ----------------------------------------------------------------------

const StyledTextField = withStyles(() => ({
  root: {
    width: '8rem',
    '& .MuiInputBase-root': {
      height: '1.99rem'
    },
    '& .MuiOutlinedInput-input': {
      paddingBottom: 0
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 5
      }
    }
  }
}))(TextField);

CalendarioRango.propTypes = {
  onBuscar: PropTypes.func.isRequired
};

export default function CalendarioRango(onBuscar, ...other) {
  const [value, setValue] = useState([null, null]);
  return (
    <DateRangePicker
      inputFormat="dd/MM/yyyy"
      mask="__/__/____"
      allowSameDateSelection
      startText="FECHA INICIO"
      endText="FECHA FIN"
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        console.log(newValue);
      }}
      renderInput={(startProps, endProps) => (
        <>
          <StyledTextField
            margin="none"
            variant="outlined"
            size="small"
            error
            InputLabelProps={{
              shrink: true
            }}
            {...startProps}
            helperText={null}
          />
          <Box sx={{ mx: 0.5 }} />
          <StyledTextField
            margin="none"
            variant="outlined"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...endProps}
            helperText={null}
          />
          <Box sx={{ mx: 0.5 }} />
          <BotonBuscar />
        </>
      )}
      {...other}
    />
  );
}
