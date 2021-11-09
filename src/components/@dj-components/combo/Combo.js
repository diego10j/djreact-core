import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
// material
import { MenuItem, TextField } from '@mui/material';
// servicios
import { getComboTabla } from '../../../services/sistema/servicioSistema';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// utils
import { isDefined, toCapitalize } from '../../../utils/utilitario';
// ----------------------------------------------------------------------

const StyledTextField = withStyles(() => ({
  root: {
    // width: '8rem',
    '& .MuiInputBase-root': {
      // height: '1.99rem'
    },
    '& .MuiOutlinedInput-input': {
      // paddingBottom: 0
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 5
        // borderColor: 'transparent !important'
      }
    }
  }
}))(TextField);

const Combo = forwardRef(
  (
    {
      onChange,
      label = '',
      nombreTabla,
      campoPrimario,
      campoNombre,
      condicion,
      width = '17rem',
      labelNull = 'Null',
      ...other
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      value,
      setValue,
      actualizar
    }));

    const isMountedRef = useIsMountedRef();
    const [listaCombo, setListaCombo] = useState([]);
    const [value, setValue] = useState();

    useEffect(() => {
      getServicioCombo();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Obtiene las columnas del servicio web
     */
    const getServicioCombo = async () => {
      try {
        const { data } = await getComboTabla(nombreTabla, campoPrimario, campoNombre, condicion);
        if (isMountedRef.current) {
          setListaCombo([{ value: '', label: labelNull }, ...data.datos]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const actualizar = () => {
      getServicioCombo();
    };

    return (
      <StyledTextField
        select
        label={toCapitalize(label)}
        value={value || ''}
        margin="dense"
        variant="outlined"
        size="small"
        style={{ width, minWidth: width }}
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
      >
        {listaCombo.map((element, index) => (
          <MenuItem key={index} value={element.value}>
            {element.label}
          </MenuItem>
        ))}
      </StyledTextField>
    );
  }
);

Combo.propTypes = {
  value: PropTypes.string,
  labelNull: PropTypes.string,
  width: PropTypes.string,
  label: PropTypes.string,
  nombreTabla: PropTypes.string.isRequired,
  campoPrimario: PropTypes.string.isRequired,
  campoNombre: PropTypes.string.isRequired,
  condicion: PropTypes.string,
  onChange: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default Combo;
