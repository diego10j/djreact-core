import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// material
import { TextField } from '@material-ui/core';
// utils
import { isDefined } from '../../../utils/utilitario';
// ----------------------------------------------------------------------

const StyledTextField = withStyles(() => ({
  root: {
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

const Texto = forwardRef(({ onChange, label = '', ...other }, ref) => {
  useImperativeHandle(ref, () => ({
    value,
    setValue
  }));

  const [value, setValue] = useState();

  return (
    <StyledTextField
      label={label.toUpperCase()}
      value={value || ''}
      margin="none"
      variant="outlined"
      size="small"
      InputLabelProps={{
        shrink: true
      }}
      onChange={async (event) => {
        if (!isDefined(onChange)) {
          setValue(event.target.value);
        } else {
          await setValue(event.target.value);
          onChange();
        }
      }}
      {...other}
    />
  );
});

Texto.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  label: PropTypes.string,
  onChange: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default Texto;
