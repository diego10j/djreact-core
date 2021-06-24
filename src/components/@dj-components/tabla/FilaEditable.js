import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// componentes
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Skeleton, TextField } from '@material-ui/core';
import { withStyles, experimentalStyled as styled, alpha } from '@material-ui/core/styles';
import DatePicker from '@material-ui/lab/DatePicker';
import TimePicker from '@material-ui/lab/TimePicker';
import { toDate, isFechaValida, isDate, toHora, getFormatoFecha, getFormatoHora } from '../../../utils/formatTime';
import { isDefined } from '../../../utils/utilitario';

const StyledTableCellBody = styled('td')(({ theme }) => ({
  padding: 0,
  borderBottom: `solid 1px ${theme.palette.divider}`,
  // borderRight: `solid 1px ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.primary.lighter, 0.5)
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
  combos,
  vistaFormularo
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
              vistaFormularo={vistaFormularo}
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
  combos: PropTypes.array,
  vistaFormularo: PropTypes.bool
};

// ----------------------------------------------------------------------
export function ComponenteEditable({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  combos,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada,
  vistaFormularo,
  hookFormulario
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
          vistaFormularo={vistaFormularo}
          hookFormulario={hookFormulario}
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
          vistaFormularo={vistaFormularo}
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
          vistaFormularo={vistaFormularo}
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
          vistaFormularo={vistaFormularo}
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
          vistaFormularo={vistaFormularo}
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
          vistaFormularo={vistaFormularo}
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
          vistaFormularo={vistaFormularo}
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
  combos: PropTypes.array,
  vistaFormularo: PropTypes.bool,
  hookFormulario: PropTypes.object
};

// ----------------------------------------------------------------------

const Texto = ({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada,
  vistaFormularo,
  hookFormulario
}) => {
  const [isModifico, setIsModificado] = useState(false);
  const [erorr, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);

  const onChange = (e) => {
    setValorFilaSeleccionada(column.nombre, e.target.value);
    setIsModificado(true);
    validaciones();
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    validaciones();
    if (isModifico) {
      modificarFila(column, index);
      updateMyData(index, column.nombre, getValorFilaSeleccionada(column.nombre));
      setIsModificado(false);
    }
  };

  const validaciones = () => {
    if (hookFormulario.validationSchema) {
      const fields = hookFormulario.validationSchema._nodes;
      if (fields.indexOf(column.nombre) >= 0) {
        Yup.reach(hookFormulario.validationSchema, column.nombre)
          .validate(getValorFilaSeleccionada(column.nombre))
          .then(() => {
            setMensajeError(null);
            setError(false);
          })
          .catch((err) => {
            setMensajeError(err.message);
            setError(true);
          });
      }
    }
  };

  return (
    <>
      {!vistaFormularo ? (
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
      ) : (
        <TextField
          id={column.nombre}
          value={getValorFilaSeleccionada(column.nombre) || ''}
          onChange={onChange}
          onBlur={onBlur}
          autoFocus={foco}
          margin="none"
          fullWidth
          variant="outlined"
          size="small"
          label={column.nombrevisual}
          disabled={column.lectura}
          error={erorr}
          helperText={mensajeError}
          required={column.requerida}
          InputLabelProps={{
            shrink: true,
            style: { textAlign: `${column.alinear}` }
          }}
        />
      )}
    </>
  );
};

Texto.propTypes = {
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number,
  vistaFormularo: PropTypes.bool,
  hookFormulario: PropTypes.object
};

// ----------------------------------------------------------------------

const TextoNumero = ({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada,
  vistaFormularo
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
    <>
      {!vistaFormularo ? (
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
      ) : (
        <TextField
          type="number"
          value={getValorFilaSeleccionada(column.nombre)}
          onChange={onChange}
          onBlur={onBlur}
          autoFocus={foco}
          margin="none"
          fullWidth
          variant="outlined"
          size="small"
          label={column.nombrevisual}
          disabled={column.lectura}
          InputLabelProps={{
            shrink: true,
            style: { textAlign: `${column.alinear}` }
          }}
        />
      )}
    </>
  );
};

TextoNumero.propTypes = {
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number,
  vistaFormularo: PropTypes.bool
};

// ----------------------------------------------------------------------

const Combo = ({
  column,
  modificarFila,
  updateMyData,
  index,
  combos,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada,
  vistaFormularo
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
        <>
          {!vistaFormularo ? (
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
          ) : (
            <FormControl variant="outlined" margin="none" fullWidth size="small">
              <InputLabel shrink id={`${column.nombre}`}>
                {column.nombrevisual}
              </InputLabel>
              <Select
                labelId={`${column.nombre}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                size="small"
                label={column.nombrevisual}
                disabled={column.lectura}
              >
                {combos
                  .find((col) => col.columna === column.nombre)
                  ?.listaCombo.map((element, index) => (
                    <MenuItem key={index} value={element.value}>
                      {element.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </>
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
  combos: PropTypes.array,
  vistaFormularo: PropTypes.bool
};

// ----------------------------------------------------------------------

const Check = ({
  column,
  modificarFila,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada,
  vistaFormularo
}) => {
  const onChange = (e) => {
    setValorFilaSeleccionada(column.nombre, e.target.checked);
    modificarFila(column, index);
    updateMyData(index, column.nombre, getValorFilaSeleccionada(column.nombre));
  };
  return (
    <>
      {!vistaFormularo ? (
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
      ) : (
        <>
          <FormControl variant="outlined" margin="none" size="small" fullWidth>
            <InputLabel shrink>{column.nombrevisual}</InputLabel>
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  sx={{ ml: 2 }}
                  icon={<CheckBoxOutlineBlankIcon />}
                  checked={getValorFilaSeleccionada(column.nombre) === true}
                  onChange={onChange}
                  color="primary"
                  disabled={column.lectura}
                  checkedIcon={<CheckBoxIcon />}
                />
              }
              label=""
              labelPlacement="end"
            />
          </FormControl>
        </>
      )}
    </>
  );
};

Check.propTypes = {
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  index: PropTypes.number,
  vistaFormularo: PropTypes.bool
};

// ----------------------------------------------------------------------

const Calendario = ({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada,
  vistaFormularo
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
    <>
      {!vistaFormularo ? (
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
      ) : (
        <DatePicker
          views={['day']}
          inputFormat="dd/MM/yyyy"
          value={value}
          mask="__/__/____"
          onChange={onChange}
          disabled={column.lectura}
          inputProps={{ style: { textAlign: `${column.alinear}` } }}
          renderInput={(params) => (
            <TextField
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
              label={column.nombrevisual}
              onChange={onChangeInput}
            />
          )}
        />
      )}
    </>
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
  combos: PropTypes.array,
  vistaFormularo: PropTypes.bool
};

// ----------------------------------------------------------------------

const Hora = ({
  column,
  modificarFila,
  foco,
  updateMyData,
  index,
  setValorFilaSeleccionada,
  getValorFilaSeleccionada,
  vistaFormularo
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
    <>
      {!vistaFormularo ? (
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
      ) : (
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
            <TextField
              {...params}
              fullWidth
              size="small"
              variant="outlined"
              margin="none"
              label={column.nombrevisual}
              autoFocus={foco}
              helperText={null}
              onBlur={onBlur}
              value={value}
              error={false}
              onChange={onChangeInput}
            />
          )}
        />
      )}
    </>
  );
};

Hora.propTypes = {
  setValorFilaSeleccionada: PropTypes.func,
  getValorFilaSeleccionada: PropTypes.func,
  column: PropTypes.object.isRequired,
  modificarFila: PropTypes.func,
  updateMyData: PropTypes.func,
  foco: PropTypes.bool,
  index: PropTypes.number,
  vistaFormularo: PropTypes.bool
};

// ----------------------------------------------------------------------
