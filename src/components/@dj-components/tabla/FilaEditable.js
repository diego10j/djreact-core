import React, { useState } from 'react';
import PropTypes from 'prop-types';
// componentes
import { TextField } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const StyledTextField = withStyles(() => ({
  root: {
    border: 'none',
    fontSize: '0.875rem',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    padding: 0,
    marggin: 0,
    '& .MuiInputBase-root': {
      padding: 0,
      marggin: 0,
      fontSize: '0.875rem',
      borderColor: 'blue',
      fontWeight: '400',
      '&:before': {
        border: 'none'
      }
    },
    '& .MuiInputBase-root:hover': {
      '&:before': {
        border: 'none'
      }
    }
  }
}))(TextField);

// Create an editable cell renderer
export const TextoTabla = ({
  value: initialValue,
  row: { index },
  column: { id },
  modificarFila,
  updateMyData // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);
  const [isModifico, setIsModificado] = useState(false);

  const onChange = (e) => {
    setValue(e.target.value);
    setIsModificado(true);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (isModifico) {
      // updateMyData(index, id, value);
      modificarFila(index, id, value);
      setIsModificado(false);
    }
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      {true && (
        <StyledTextField
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          size="small"
          variant="standard"
          margin="none"
        />
      )}
    </>
  );
};

TextoTabla.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.any
  }),
  row: PropTypes.shape({
    index: PropTypes.number.isRequired
  }),
  column: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  updateMyData: PropTypes.func.isRequired,
  modificarFila: PropTypes.func.isRequired
};
