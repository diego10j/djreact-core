import React, { useState } from 'react';
import PropTypes from 'prop-types';
// componentes
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { MenuItem, Select, Skeleton, TextField } from '@material-ui/core';
import { withStyles, experimentalStyled as styled } from '@material-ui/core/styles';
import DatePicker from '@material-ui/lab/DatePicker';
import TimePicker from '@material-ui/lab/TimePicker';
import { toDate, isFechaValida, isDate, toHora, getFormatoFecha, getFormatoHora } from '../../../utils/formatTime';
import { isDefined } from '../../../utils/utilitario';

const StyledTableCellBody = styled('td')(({ theme }) => ({
  padding: 0,
  borderBottom: `solid 1px ${theme.palette.divider}`,
  borderRight: `solid 1px ${theme.palette.divider}`
}));

const StyledTextField = withStyles((theme) => ({
  root: {
    border: 'none',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    padding: 0,
    marggin: 0,
    '& .MuiInputBase-root': {
      fontSize: '0.875rem',
      height: '1.60rem',
      padding: 0,
      marggin: 0
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 0,
        borderColor: 'transparent'
      },
      // '&:hover fieldset': {
      //    borderColor: `${theme.palette.primary.dark}`
      //  },
      '&.Mui-focused fieldset': {
        // WeborderWidth: 1,
        borderColor: `${theme.palette.primary.main}`
      }
    },
    '& .MuiOutlinedInput-input': {
      padding: 0,
      paddingLeft: 5
    }
  }
}))(TextField);

const StyledSelect = withStyles(() => ({
  root: {
    border: 'none',
    fontSize: '0.875rem',
    width: '100%',
    height: '1.60rem',
    backgroundColor: 'transparent',
    outline: 'none',
    padding: '0 5px 0 5px !important',
    marggin: 0,
    borderRadius: 0,
    '& .MuiSelect-outlined': {
      padding: 0
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent'
    }
    // '&:hover .MuiOutlinedInput-notchedOutline': {
    //   borderColor: `${theme.palette.primary.dark}`
    //  }
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
  row: { cells, index },
  filaSeleccionada,
  columns,
  columnaSeleccionada,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada,
  modificarFila,
  updateMyData,
  combos
}) {
  return (
    <>
      {filaSeleccionada &&
        cells.map((cell, i) => (
          <StyledTableCellBody key={i}>
            <ComponenteEditable
              filaSeleccionada={filaSeleccionada}
              setValorFilaSeleccionada={setValorFilaSeleccionada}
              getValorFilaSeleccionada={getValorFilaSeleccionada}
              column={columns.find((col) => col.nombre === cell.column.nombre)}
              foco={columnaSeleccionada === cell.column.nombre}
              modificarFila={modificarFila}
              updateMyData={updateMyData}
              index={index}
              combos={combos}
            />
          </StyledTableCellBody>
        ))}
    </>
  );
}

FilaEditable.propTypes = {
  row: PropTypes.object.isRequired,
  filaSeleccionada: PropTypes.object,
  columnaSeleccionada: PropTypes.string,
  modificarFila: PropTypes.func,
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  updateMyData: PropTypes.func,
  columns: PropTypes.array,
  combos: PropTypes.array
};

// Create an editable cell renderer
function ComponenteEditable({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  combos,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada
}) {
  return (
    <>
      {column.componente === 'Texto' && (
        <Texto
          setValorFilaSeleccionada={setValorFilaSeleccionada}
          getValorFilaSeleccionada={getValorFilaSeleccionada}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'TextoNumero' && (
        <TextoNumero
          setValorFilaSeleccionada={setValorFilaSeleccionada}
          getValorFilaSeleccionada={getValorFilaSeleccionada}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'TextoEntero' && (
        <TextoNumero
          setValorFilaSeleccionada={setValorFilaSeleccionada}
          getValorFilaSeleccionada={getValorFilaSeleccionada}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'Combo' && (
        <Combo
          setValorFilaSeleccionada={setValorFilaSeleccionada}
          getValorFilaSeleccionada={getValorFilaSeleccionada}
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
          setValorFilaSeleccionada={setValorFilaSeleccionada}
          getValorFilaSeleccionada={getValorFilaSeleccionada}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'Calendario' && (
        <Calendario
          setValorFilaSeleccionada={setValorFilaSeleccionada}
          getValorFilaSeleccionada={getValorFilaSeleccionada}
          column={column}
          modificarFila={modificarFila}
          foco={foco}
          updateMyData={updateMyData}
          index={index}
        />
      )}

      {column.componente === 'Hora' && (
        <Hora
          setValorFilaSeleccionada={setValorFilaSeleccionada}
          getValorFilaSeleccionada={getValorFilaSeleccionada}
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
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number,
  combos: PropTypes.array
};

const Texto = ({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada
}) => {
  const [isModifico, setIsModificado] = useState(false);

  const onChange = (e) => {
    setValorFilaSeleccionada(column.nombre, e.target.value);
    setIsModificado(true);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (isModifico) {
      modificarFila(column, index);
      updateMyData(index, column.nombre, getValorFilaSeleccionada(column.nombre));
      setIsModificado(false);
    }
  };

  return (
    <StyledTextField
      value={getValorFilaSeleccionada(column.nombre)}
      onChange={onChange}
      onBlur={onBlur}
      fullWidth
      size="small"
      variant="outlined"
      margin="none"
      autoFocus={foco}
      inputProps={{ style: { textAlign: `${column.alinear}` } }}
      disabled={column.lectura}
    />
  );
};
Texto.propTypes = {
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number
};

const TextoNumero = ({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada
}) => {
  // We need to keep and update the state of the cell normally
  const [isModifico, setIsModificado] = useState(false);

  const onChange = (e) => {
    setValorFilaSeleccionada(column.nombre, e.target.value);
    setIsModificado(true);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (isModifico) {
      modificarFila(column, index);
      updateMyData(index, column.nombre, getValorFilaSeleccionada(column.nombre));
      setIsModificado(false);
    }
  };

  return (
    <StyledTextField
      type="number"
      value={getValorFilaSeleccionada(column.nombre)}
      onChange={onChange}
      onBlur={onBlur}
      fullWidth
      size="small"
      variant="outlined"
      margin="none"
      autoFocus={foco}
      inputProps={{ style: { textAlign: `${column.alinear}` } }}
      disabled={column.lectura}
    />
  );
};

TextoNumero.propTypes = {
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number
};

const Combo = ({
  column,
  modificarFila,
  updateMyData,
  index,
  combos,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(
    getValorFilaSeleccionada(column.nombre) === null ? '' : getValorFilaSeleccionada(column.nombre)
  );
  const [isModifico, setIsModificado] = useState(false);

  const onChange = (e) => {
    setValue(e.target.value);
    setValorFilaSeleccionada(column.nombre, e.target.value);
    setIsModificado(true);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (isModifico) {
      modificarFila(column, index);
      updateMyData(index, column.nombre, getValorFilaSeleccionada(column.nombre));
      setIsModificado(false);
    }
  };

  return (
    <>
      {!isDefined(combos.find((col) => col.columna === column.nombre)?.listaCombo) ? (
        <Skeleton animation="wave" />
      ) : (
        <StyledSelect
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          variant="outlined"
          disabled={column.lectura}
        >
          {combos
            .find((col) => col.columna === column.nombre)
            ?.listaCombo.map((element, index) => (
              <MenuItem key={index} value={element.value}>
                {element.label}
              </MenuItem>
            ))}
        </StyledSelect>
      )}
    </>
  );
};
Combo.propTypes = {
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  index: PropTypes.number,
  combos: PropTypes.array
};

const Check = ({ column, modificarFila, updateMyData, index, setValorFilaSeleccionada, getValorFilaSeleccionada }) => {
  const onChange = (e) => {
    setValorFilaSeleccionada(column.nombre, e.target.checked);
    modificarFila(column, index);
    updateMyData(index, column.nombre, getValorFilaSeleccionada(column.nombre));
  };
  return (
    <div align="center">
      <StyledCheckbox
        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
        checked={getValorFilaSeleccionada(column.nombre) === true}
        onChange={onChange}
        color="primary"
        disabled={column.lectura}
        checkedIcon={<CheckBoxIcon fontSize="small" />}
      />
    </div>
  );
};

Check.propTypes = {
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  index: PropTypes.number
};

const Calendario = ({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada
}) => {
  const [value, setValue] = useState(
    getValorFilaSeleccionada(column.nombre) === null ? '' : toDate(getValorFilaSeleccionada(column.nombre))
  );
  const [isModifico, setIsModificado] = useState(false);

  /**
   * Cuando selecciona la facha del Calendario
   * @param {*} e
   */
  const onChange = (e) => {
    if (isFechaValida(e)) {
      setValue(e);
      setValorFilaSeleccionada(column.nombre, e);
      modificarFila(column, index);
      updateMyData(index, column.nombre, getFormatoFecha(e));
      setIsModificado(false);
    }
  };

  const onChangeInput = (e) => {
    setValue(e.target.value);
    setValorFilaSeleccionada(column.nombre, e.target.value);
    setIsModificado(true);
  };

  const onBlur = () => {
    if (isModifico) {
      modificarFila(column, index);
      if (isDate(value)) {
        updateMyData(index, column.nombre, getFormatoFecha(value));
      } else {
        updateMyData(index, column.nombre, value);
      }
      setIsModificado(false);
    }
  };

  return (
    <DatePicker
      views={['day']}
      inputFormat="dd/MM/yyyy"
      value={value}
      mask="__/__/____"
      onChange={onChange}
      disabled={column.lectura}
      inputProps={{ style: { textAlign: `${column.alinear}` } }}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          fullWidth
          size="small"
          variant="outlined"
          margin="none"
          autoFocus={foco}
          helperText={null}
          onBlur={onBlur}
          value={value}
          error={false}
          onChange={onChangeInput}
        />
      )}
    />
  );
};

Calendario.propTypes = {
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number,
  combos: PropTypes.array
};

const Hora = ({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada
}) => {
  const [value, setValue] = useState(
    getValorFilaSeleccionada(column.nombre) === null ? '' : toHora(getValorFilaSeleccionada(column.nombre))
  );
  const [isModifico, setIsModificado] = useState(false);

  /**
   * Cuando selecciona la hora
   * @param {*} e
   */
  const onChange = (e) => {
    if (isFechaValida(e)) {
      setValue(e);
      setValorFilaSeleccionada(column.nombre, e);
      modificarFila(column, index);
      updateMyData(index, column.nombre, getFormatoHora(e));
      setIsModificado(false);
    }
  };

  const onChangeInput = (e) => {
    setValue(e.target.value);
    setValorFilaSeleccionada(column.nombre, e.target.value);
    setIsModificado(true);
  };

  const onBlur = () => {
    if (isModifico) {
      modificarFila(column, index);
      if (isDate(value)) {
        updateMyData(index, column.nombre, getFormatoHora(value));
      } else {
        updateMyData(index, column.nombre, value);
      }
      setIsModificado(false);
    }
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
      disabled={column.lectura}
      inputProps={{ style: { textAlign: `${column.alinear}` } }}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          fullWidth
          size="small"
          variant="outlined"
          margin="none"
          autoFocus={foco}
          helperText={null}
          onBlur={onBlur}
          value={value}
          error={false}
          onChange={onChangeInput}
        />
      )}
    />
  );
};

Hora.propTypes = {
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number
};
