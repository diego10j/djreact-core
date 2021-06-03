import React, { useState } from 'react';
import PropTypes from 'prop-types';
// componentes
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { MenuItem, Select, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DatePicker from '@material-ui/lab/DatePicker';
import TimePicker from '@material-ui/lab/TimePicker';
import { toDate, isFechaValida, getFormatoFecha, toHora, getFormatoHora } from '../../../utils/formatTime';

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
      padding: '10px 5px 0 5px !important',
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
    },
    '&:hover': { outline: 'none', border: 'none' },
    '& .MuiInputBase-input': {
      padding: '0 0 4px 0 !important'
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
function ComponenteEditable({ valor, column, modificarFila, foco, updateMyData, index, combos }) {
  return (
    <>
      {column.componente === 'Texto' && (
        <Texto
          valor={valor}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'TextoNumero' && (
        <TextoNumero
          valor={valor}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'TextoEntero' && (
        <TextoNumero
          valor={valor}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'Combo' && (
        <Combo
          valor={valor}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
          combos={combos}
        />
      )}

      {column.componente === 'Check' && (
        <Check
          valor={valor}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'Calendario' && (
        <Calendario
          valor={valor}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'Hora' && (
        <Hora
          valor={valor}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}
    </>
  );
}

ComponenteEditable.propTypes = {
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number,
  combos: PropTypes.array
};

const Texto = ({ valor, column, modificarFila, foco, updateMyData, index }) => {
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
      updateMyData(index, column.nombre, value);
      modificarFila(column, value);
      setIsModificado(false);
    }
  };

  return (
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
  );
};
Texto.propTypes = {
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number
};

const TextoNumero = ({ valor, column, modificarFila, foco, updateMyData, index }) => {
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
      updateMyData(index, column.nombre, value);
      modificarFila(column, value);
      setIsModificado(false);
    }
  };

  return (
    <StyledTextField
      type="number"
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
  );
};

TextoNumero.propTypes = {
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number
};

const Combo = ({ valor, column, modificarFila, updateMyData, index, combos }) => {
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
      updateMyData(index, column.nombre, value);
      modificarFila(column, value);
      setIsModificado(false);
    }
  };

  return (
    <StyledSelect value={value} onChange={onChange} onBlur={onBlur} fullWidth variant="standard">
      <MenuItem value="">
        <em>&nbsp;</em>
      </MenuItem>
      {combos
        .find((col) => col.columna === column.nombre)
        ?.listaCombo.map((element, index) => (
          <MenuItem key={index} value={element.value}>
            {element.label}
          </MenuItem>
        ))}
    </StyledSelect>
  );
};
Combo.propTypes = {
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  index: PropTypes.number,
  combos: PropTypes.array
};

const Check = ({ valor, column, modificarFila, updateMyData, index }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(valor === null ? false : valor);

  const onChange = (e) => {
    setValue(e.target.checked);
    updateMyData(index, column.nombre, value);
    modificarFila(column, value);
  };

  return (
    <div align="center">
      <StyledCheckbox
        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
        checked={value}
        onChange={onChange}
        color="primary"
        checkedIcon={<CheckBoxIcon fontSize="small" />}
      />
    </div>
  );
};

Check.propTypes = {
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  index: PropTypes.number
};

const Calendario = ({ valor, column, modificarFila, foco, updateMyData, index }) => {
  const [value, setValue] = useState(valor === null ? '' : toDate(valor));

  const onChange = (e) => {
    if (isFechaValida(e)) {
      setValue(e);
    } else {
      setValue('');
      e = null;
    }
    updateMyData(index, column.nombre, getFormatoFecha(e));
    modificarFila(column, getFormatoFecha(e, 'YYYY-MM-DD'));
  };

  return (
    <DatePicker
      views={['day']}
      inputFormat="dd/MM/yyyy"
      mask="__/__/____"
      value={value}
      onChange={onChange}
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
  );
};

Calendario.propTypes = {
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number,
  combos: PropTypes.array
};

const Hora = ({ valor, column, modificarFila, foco, updateMyData, index }) => {
  const [value, setValue] = useState(valor === null ? '' : toHora(valor));

  const onChange = (e) => {
    if (isFechaValida(e)) {
      setValue(e);
    } else {
      setValue('');
      e = null;
    }
    updateMyData(index, column.nombre, getFormatoHora(e));
    modificarFila(column, getFormatoHora(e));
  };

  return (
    <TimePicker
      inputFormat="HH:mm:ss"
      mask="__:__:__"
      openTo="hours"
      ampm={false}
      views={['hours', 'minutes', 'seconds']}
      ampmInClock
      value={value}
      onChange={onChange}
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
  );
};

Hora.propTypes = {
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number
};
