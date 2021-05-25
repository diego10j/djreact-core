import React, { useState } from 'react';
import PropTypes from 'prop-types';
// componentes
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { MenuItem, Select, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/lab';

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
      fontWeight: '500',
      padding: '0 5px 0 5px !important',
      '&:before': {
        border: 'none'
      }
    },
    '& .MuiInputBase-input': {
      padding: '0 0 4px 0 !important'
    },
    '& .MuiInputBase-root:hover': {
      '&:before': {
        border: 'none'
      }
    }
  }
}))(TextField);

const StyledSelect = withStyles(() => ({
  root: {
    border: 'none',
    fontSize: '0.875rem',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    padding: '0 5px 0 5px !important',
    marggin: 0,
    '&:before': {
      border: 'none'
    }
  }
}))(Select);

const StyledCheckbox = withStyles(() => ({
  root: {
    backgroundColor: 'transparent',
    outline: 'none',
    padding: 0,
    marggin: 0
  }
}))(Checkbox);

export default function FilaEditable({
  row: { cells, values, index },
  columns,
  columnaSeleccionada,
  modificarFila,
  updateMyData,
  combos
}) {
  // console.log(values);

  return (
    <>
      {cells.map((cell, i) => (
        <td key={i}>
          <ComponenteEditable
            valor={values[cell.column.nombre]}
            column={columns.find((col) => col.nombre === cell.column.nombre)}
            foco={columnaSeleccionada === cell.column.nombre}
            modificarFila={modificarFila}
            updateMyData={updateMyData}
            index={index}
            combos={combos}
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
  updateMyData: PropTypes.func,
  columns: PropTypes.array,
  combos: PropTypes.array
};

// Create an editable cell renderer
const ComponenteEditable = ({
  valor,
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  combos
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(valor === null ? '' : valor);
  const [isModifico, setIsModificado] = useState(false);

  const onChange = (e) => {
    setValue(e.target.value);
    setIsModificado(true);
  };

  const onChangeCheck = (e) => {
    setValue(e.target.checked);
    updateMyData(index, column.nombre, value);
    modificarFila(column, value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (isModifico) {
      updateMyData(index, column.nombre, value);
      modificarFila(column, value);
      setIsModificado(false);
    }
  };

  return (
    <>
      {column.componente === 'Texto' && (
        <StyledTextField
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          size="small"
          variant="standard"
          margin="none"
          autoFocus={foco}
          inputProps={{ style: { textAlign: `${column.alinear}` } }}
        />
      )}

      {column.componente === 'TextoNumero' && (
        <StyledTextField
          value={value}
          type="number"
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          size="small"
          variant="standard"
          margin="none"
          autoFocus={foco}
          inputProps={{ style: { textAlign: `${column.alinear}` } }}
        />
      )}

      {column.componente === 'TextoEntero' && (
        <StyledTextField
          value={value}
          type="number"
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          size="small"
          variant="standard"
          margin="none"
          autoFocus={foco}
          inputProps={{ style: { textAlign: `${column.alinear}` } }}
        />
      )}

      {column.componente === 'Combo' && (
        <StyledSelect
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
        >
          <MenuItem value="">
            <em>&nbsp;</em>
          </MenuItem>
          {combos
            .find((col) => col.columna === column.nombre)
            .listaCombo.map((element, index) => (
              <MenuItem key={index} value={element.value}>
                {element.label}
              </MenuItem>
            ))}
        </StyledSelect>
      )}

      {column.componente === 'Check' && (
        <div align="center">
          <StyledCheckbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checked={value === '' ? false : value}
            onChange={onChangeCheck}
            color="primary"
            checkedIcon={<CheckBoxIcon fontSize="small" />}
          />
        </div>
      )}

      {column.componente === 'Calendario' && (
        <DatePicker
          views={['date']}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          inputProps={{ style: { textAlign: `${column.alinear}` } }}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              fullWidth
              size="small"
              variant="standard"
              margin="none"
              autoFocus={foco}
              helperText={null}
            />
          )}
        />
      )}
    </>
  );
};

ComponenteEditable.propTypes = {
  valor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number,
  combos: PropTypes.array
};
