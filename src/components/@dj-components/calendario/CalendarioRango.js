import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { DateRangePicker } from '@material-ui/lab';
import { Box, TextField } from '@material-ui/core';

// ----------------------------------------------------------------------

CalendarioRango.propTypes = {
  valorInicial: PropTypes.instanceOf(Date)
};

export default function CalendarioRango(valorInicial = '') {
  const [value, setValue] = useState([null, null]);

  return (
    <DateRangePicker
      inputFormat="dd/MM/yyyy"
      mask="__/__/____"
      allowSameDateSelection
      startText="Fecha Inicio"
      endText="Fecha Fin"
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      renderInput={(startProps, endProps) => (
        <>
          <TextField
            margin="none"
            variant="outlined"
            size="small"
            error
            InputLabelProps={{
              shrink: true
            }}
            {...startProps}
          />
          <Box sx={{ mx: 1 }} />
          <TextField
            margin="none"
            variant="outlined"
            size="small"
            InputLabelProps={{
              shrink: true
            }}
            {...endProps}
          />
        </>
      )}
    />
  );
}
