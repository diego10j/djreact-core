import React, { useState } from 'react';
import PropTypes from 'prop-types';
// componentes
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export default function FilaEditable({
  row: { cells, values, index },
  columnaSeleccionada,
  modificarFila,
  updateMyData
}) {
  // console.log(cells);
  // console.log(values);
  return (
    <>
      {cells.map((cell, i) => (
        <td key={i}>
          <TextoTabla
            valor={values[cell.column.nombre]}
            column={cell.column}
            foco={columnaSeleccionada === cell.column.nombre}
            modificarFila={modificarFila}
            updateMyData={updateMyData}
            index={index}
            alinear={cell.column.alinear}
          />
        </td>
      ))}
    </>
  );
}

FilaEditable.propTypes = {
  row: PropTypes.object.isRequired,
  columnaSeleccionada: PropTypes.string.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func
};

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
      marggin: 0,
      fontSize: '0.875rem',
      borderColor: 'blue',
      fontWeight: '500',
      padding: '0 5px 0 5px !important',
      '&:before': {
        border: 'none'
      }
    },
    '& .MuiInputBase-input': {
      padding: '0 0 3px 0 !important'
    },
    '& .MuiInputBase-root:hover': {
      '&:before': {
        border: 'none'
      }
    }
  }
}))(TextField);

// Create an editable cell renderer
const TextoTabla = ({
  valor,
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  alinear
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(valor === null ? '' : valor);
  const [isModifico, setIsModificado] = useState(false);

  const onChange = (e) => {
    setValue(e.target.value);
    setIsModificado(true);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (isModifico) {
      updateMyData(index, column.id, value);
      modificarFila(column, value);
      setIsModificado(false);
    }
  };

  return (
    <>
      {true && (
        <StyledTextField
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          size="small"
          variant="standard"
          margin="none"
          autoFocus={foco}
          inputProps={{ style: { textAlign: `${alinear}` } }} // the change is here
        />
      )}
    </>
  );
};

TextoTabla.propTypes = {
  valor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number
};
