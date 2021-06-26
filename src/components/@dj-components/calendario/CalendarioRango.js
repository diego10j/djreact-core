import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { DateRangePicker } from '@material-ui/lab';
import { Box, TextField, InputLabel, FormControl, InputBase, InputAdornment, OutlinedInput } from '@material-ui/core';
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
        // borderColor: 'transparent !important'
      }
    }
  }
}))(TextField);

CalendarioRango.propTypes = {
  onBuscar: PropTypes.func.isRequired
};

export default function CalendarioRango(onBuscar) {
  const [value, setValue] = useState([null, null]);

  return (
    <DateRangePicker
      inputFormat="dd/MM/yyyy"
      mask="__/__/____"
      allowSameDateSelection
      startText="Fecha Inicio - Fecha Fin"
      endText=""
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
          <BotonBuscar onClick={onBuscar} />

          <FormControl variant="outlined" margin="none" size="small">
            <InputLabel htmlFor="rango-fechas" shrink>
              Rango de fecha
            </InputLabel>

            <DateRangePicker
              label="Advanced keyboard"
              value={value}
              onChange={(newValue) => setValue(newValue)}
              renderInput={(startProps, endProps) => (
                <div className="MuiOutlinedInput-root MuiInputBase-root MuiInputBase-colorPrimary Mui-focused MuiInputBase-formControl MuiInputBase-sizeSmall css-45fi8d-MuiInputBase-root-MuiOutlinedInput-root">
                  <InputBase
                    sx={{
                      '& input': {
                        height: '1rem',
                        width: '6rem'
                      }
                    }}
                    ref={startProps.inputRef}
                    {...startProps.inputProps}
                    endAdornment={<InputAdornment position="end">-</InputAdornment>}
                  />

                  <InputBase
                    sx={{
                      '& input': {
                        height: '1rem',
                        width: '6rem'
                      }
                    }}
                    ref={endProps.inputRef}
                    {...endProps.inputProps}
                  />
                </div>
              )}
            />
          </FormControl>
        </>
      )}
    />
  );
}
