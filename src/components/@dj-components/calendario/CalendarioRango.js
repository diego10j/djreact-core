import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
//
import { withStyles } from '@mui/styles';
// material
import { DateRangePicker } from '@mui/lab';
import { Box, Stack, TextField } from '@mui/material';
// util
import { getFormatoFecha } from '../../../utils/formatTime';
// componentes
import BotonBuscar from '../boton/BotonBuscar';
// ----------------------------------------------------------------------

const StyledTextField = withStyles(() => ({
  root: {
    width: '8rem',
    '& .MuiInputBase-root': {
      // height: '1.99rem'
    },
    '& .MuiOutlinedInput-input': {
      // paddingBottom: 0
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 5
      }
    }
  }
}))(TextField);

const CalendarioRango = forwardRef(({ fechaInicio = new Date(), fechaFin = new Date(), onClick, ...other }, ref) => {
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

  const [value, setValue] = useState([fechaInicio, fechaFin]);
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
        <Stack alignItems="center" direction="row">
          <StyledTextField
            margin="dense"
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
            margin="dense"
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
        </Stack>
      )}
      {...other}
    />
  );
});
CalendarioRango.propTypes = {
  onBuscar: PropTypes.func,
  fechaInicio: PropTypes.instanceOf(Date),
  fechaFin: PropTypes.instanceOf(Date),
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired
};
export default CalendarioRango;
