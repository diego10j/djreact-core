import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
// material
import { DateRangePicker } from '@material-ui/lab';
import { Box, Stack, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// componentes
import BotonBuscar from '../boton/BotonBuscar';
// util
import { getFormatoFecha } from '../../../utils/formatTime';
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

const CalendarioRango = forwardRef(({ fechaInicio = new Date(), FechaFin = new Date(), onClick, ...other }, ref) => {
  useImperativeHandle(ref, () => ({
    value,
    setValue,
    getFechaInicio,
    getFechaFin,
    getDateFechaInicio,
    getDateFechaFin
  }));

  const getFechaInicio = () => getFormatoFecha(value[0]);
  const getFechaFin = () => getFormatoFecha(value[1]);

  const getDateFechaInicio = () => value[0];
  const getDateFechaFin = () => value[1];

  const [value, setValue] = useState([fechaInicio, FechaFin]);
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
          <BotonBuscar onClick={onClick} />
        </>
      )}
      {...other}
    />
  );
});
CalendarioRango.propTypes = {
  onBuscar: PropTypes.func,
  fechaInicio: PropTypes.instanceOf(Date),
  fechaFin: PropTypes.instanceOf(Date)
};
export default CalendarioRango;