import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
// material
import { Switch, FormControlLabel, FormGroup } from '@material-ui/core';
// utils
import { isDefined, toCapitalize } from '../../../utils/utilitario';
// ----------------------------------------------------------------------

const CheckSeleccion = forwardRef(({ valorInicial = false, disabled = false, onChange, label = '', ...other }, ref) => {
  useImperativeHandle(ref, () => ({
    value,
    setValue
  }));

  const [value, setValue] = useState(valorInicial);

  return (
    <FormGroup>
      <FormControlLabel
        disabled={disabled}
        control={
          <Switch
            checked={value === true}
            onChange={async (event) => {
              if (!isDefined(onChange)) {
                setValue(event.target.checked);
              } else {
                await setValue(event.target.checked);
                onChange(event);
              }
            }}
            {...other}
          />
        }
        label={toCapitalize(label)}
      />
    </FormGroup>
  );
});

CheckSeleccion.propTypes = {
  valorInicial: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default CheckSeleccion;
