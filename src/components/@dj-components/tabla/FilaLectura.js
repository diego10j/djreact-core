// Componente Check de Lectura
import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { withStyles } from '@material-ui/core/styles';

const StyledCheckbox = withStyles(() => ({
  root: {
    backgroundColor: 'transparent',
    outline: 'none',
    padding: 0,
    marggin: 0
  }
}))(Checkbox);

export function CheckLectura({ value: initialValue }) {
  return (
    <StyledCheckbox
      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
      disabled
      disableRipple
      name="check"
      value={initialValue || false}
      checked={initialValue || false}
      color="primary"
      checkedIcon={<CheckBoxIcon fontSize="small" />}
    />
  );
}

CheckLectura.propTypes = {
  value: PropTypes.bool
};
